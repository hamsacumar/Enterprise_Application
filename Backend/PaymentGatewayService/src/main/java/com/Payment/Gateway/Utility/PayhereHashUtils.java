package com.Payment.Gateway.Utility;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.util.Locale;

public class PayhereHashUtils {

    // Helper to generate a 32-character, uppercase MD5 hash
    public static String getMd5Hash(String input) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] messageDigest = md.digest(input.getBytes());

            // Convert byte array to a BigInteger
            BigInteger no = new BigInteger(1, messageDigest);

            // Convert message digest into hex value
            String hashtext = no.toString(16);

            // Pad with zeros to make sure the hash is 32 characters
            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }

            return hashtext.toUpperCase();

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    // Main method to generate the final PayHere hash
    public static String generatePayHereHash(
            String merchantId,
            String orderId,
            double amount,
            String currency,
            String merchantSecret) {

        // 1. Calculate MD5 of the Merchant Secret and make it uppercase
        String hashedSecret = getMd5Hash(merchantSecret);

        // 2. Format the amount to two decimal places (e.g., "1000.00")
        // NOTE: Use Locale.US or specific DecimalFormatSymbols to ensure dot (.) is used for decimal separator
        DecimalFormat df = new DecimalFormat("0.00", new DecimalFormatSymbols(Locale.US));
        String amountFormatted = df.format(amount);

        // 3. Concatenate all required fields
        String data = merchantId + orderId + amountFormatted + currency + hashedSecret;

        // 4. Calculate the outer MD5 hash and make it uppercase
        return getMd5Hash(data);
    }

    public static String generateIPNHash(
            String merchantId,
            String orderId,
            String amount, // NOTE: Amount is already a formatted String from PayHere
            String currency,
            String statusCode,
            String merchantSecret) {

        // 1. Calculate MD5 of the Merchant Secret and make it uppercase
        String hashedSecret = getMd5Hash(merchantSecret);

        // 2. Concatenate all required fields in the specific IPN order
        String data = merchantId + orderId + amount + currency + statusCode + hashedSecret;

        // 3. Calculate the outer MD5 hash and make it uppercase
        return getMd5Hash(data);
    }
}
