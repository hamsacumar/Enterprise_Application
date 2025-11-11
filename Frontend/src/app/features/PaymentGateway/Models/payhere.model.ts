// The data Angular sends to the Spring Boot backend
export interface PayHerePaymentRequest {
  amount: number;
  itemName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

// The data Angular receives back from Spring Boot
export interface PayHereParameters {
  sandboxUrl: string; // "https://sandbox.payhere.lk/pay/checkout"
  merchant_id: string;
  return_url: string;
  cancel_url: string;
  notify_url: string;
  order_id: string;
  items: string;
  currency: string;
  amount: string; // Note: String formatted to "0.00"
  first_name: string; // Changed to match PayHere's exact parameter names
  last_name: string;  // Changed to match PayHere's exact parameter names
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  hash: string;
}