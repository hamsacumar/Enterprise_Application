package com.Payment.Gateway.Controller;

import com.Payment.Gateway.Model.Order;
import com.Payment.Gateway.Repository.OrderRepository;
import com.Payment.Gateway.Utility.PayhereHashUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("api/payment")
public class PayherePaymentController {

    @Autowired
    private final OrderRepository orderRepository;

    public PayherePaymentController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    // Merchant credentials: loaded from environment variables (do NOT hardcode in source)
    @Value("${PAYHERE_MERCHANT_ID:}")
    private String MERCHANT_ID;

    @Value("${PAYHERE_MERCHANT_SECRET:}")
    private String MERCHANT_SECRET;

    // URLs for local development
    private static final String RETURN_URL = "http://localhost:4200/payment/success"; // After successful payment
    private static final String CANCEL_URL = "http://localhost:4200/payment/cancel";  // After user cancels

    // Local development notify URL
    private static final String NOTIFY_URL = "http://localhost:8080/api/payment/notify";

    // Request body structure from Angular
    public static class PaymentRequest {
        public double amount;
        public String itemName;

        // 💥 FIX: Add the missing fields here
        public String firstName;
        public String lastName;
        public String email;
        public String phone;
        public String address;
        public String city;
        public String country;
    }

    // Response body structure to send back to Angular
    public static class PayHereParameters {
        public String sandboxUrl = "https://sandbox.payhere.lk/pay/checkout";
        public String merchant_id;
        public String return_url;
        public String cancel_url;
        public String notify_url;
        public String order_id;
        public String items;
        public String currency;
        public String amount;
        public String first_name;  // Changed to match PayHere's exact parameter names
        public String last_name;   // Changed to match PayHere's exact parameter names
        public String email;
        public String phone;
        public String address;
        public String city;
        public String country;
        public String hash;
    }

    @PostMapping("/initiate")
    public PayHereParameters initiatePayment(@RequestBody PaymentRequest request) {

        // 1. Generate a unique Order ID (Crucial step for tracking)
        String payhereOrderId = "ORD-" + System.currentTimeMillis();
        String currency = "LKR";

        // **In a real app, save this orderId and initial status to your database here**
        // 2. SAVE ORDER to Database with PENDING status 💾
        Order newOrder = new Order(
                payhereOrderId,
                request.amount,
                currency,
                request.email // Use customer email
        );
        // In a real scenario, you'd also save the item details.
        orderRepository.save(newOrder);

        // 2. Format the amount for the hash calculation
        DecimalFormat df = new DecimalFormat("0.00", new DecimalFormatSymbols(Locale.US));
        String amountFormatted = df.format(request.amount);

    // 4. Populate the parameters for the Angular app in the exact order PayHere expects
        PayHereParameters params = new PayHereParameters();
        params.merchant_id = MERCHANT_ID;
        params.return_url = RETURN_URL;
        params.cancel_url = CANCEL_URL;
        params.notify_url = NOTIFY_URL;
        params.order_id = payhereOrderId;
        params.items = request.itemName;
        params.currency = currency;
        params.amount = amountFormatted;
        params.first_name = request.firstName; // Using PayHere's exact parameter names
        params.last_name = request.lastName;   // Using PayHere's exact parameter names
        params.email = request.email;
        params.phone = request.phone;
        params.address = request.address;
        params.city = request.city;
        params.country = request.country;
        
        // Generate hash after setting all parameters
        String hashString = MERCHANT_ID;
        hashString += payhereOrderId;
        hashString += amountFormatted;
        hashString += currency;
        hashString += PayhereHashUtils.getMd5Hash(MERCHANT_SECRET).toUpperCase();
        
        params.hash = PayhereHashUtils.getMd5Hash(hashString).toUpperCase();

        return params;
    }

    // 🎯 The IPN Notification Endpoint
    @PostMapping(value = "/notify", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<String> handlePayHereNotification(
            @RequestParam Map<String, String> formData) {

        // Extract all required fields from the PayHere POST request
        String merchantId = formData.get("merchant_id");
        String orderId = formData.get("order_id");
        String payhereAmount = formData.get("payhere_amount");
        String payhereCurrency = formData.get("payhere_currency");
        String statusCode = formData.get("status_code");
        String receivedMd5Sig = formData.get("md5sig");

        // Check if critical data is missing
        if (orderId == null || payhereAmount == null || statusCode == null || receivedMd5Sig == null) {
            System.err.println("IPN Error: Missing critical data fields.");
            return ResponseEntity.badRequest().body("Incomplete data.");
        }

        // 1. Recalculate the Hash for verification
        String localMd5Sig = PayhereHashUtils.generateIPNHash(
                merchantId, orderId, payhereAmount, payhereCurrency, statusCode, MERCHANT_SECRET);

        if (!localMd5Sig.equals(receivedMd5Sig)) {
            // Hash mismatch: Log and reject the notification (potential tampering)
            System.err.println("IPN Hash Mismatch for Order: " + orderId);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Verification Failed");
        }

        // 2. Hash matches - Process the payment status
        Optional<Order> orderOptional = orderRepository.findByPayhereOrderId(orderId);

        if (orderOptional.isPresent()) {
            Order order = orderOptional.get();

            // Status Code '2' means successful payment
            if ("2".equals(statusCode)) {
                if ("PENDING".equals(order.getPaymentStatus())) {
                    order.setPaymentStatus("PAID");
                    orderRepository.save(order);
                    System.out.println("✅ IPN Success: Order " + orderId + " marked as PAID.");
                }
            }
            // Handle other statuses (e.g., -1 for Canceled, -2 for Failed) if necessary
            else {
                // For failed or canceled payments, update the status
                order.setPaymentStatus("FAILED/CANCELED: " + statusCode);
                orderRepository.save(order);
            }
        } else {
            System.err.println("IPN Error: Order ID " + orderId + " not found in database.");
            // Still return 200 OK to PayHere to acknowledge receipt, even if we can't process it.
        }

        // 3. IMPORTANT: Return 200 OK to PayHere to confirm successful receipt and processing.
        return ResponseEntity.ok("Notification received.");
    }

}
