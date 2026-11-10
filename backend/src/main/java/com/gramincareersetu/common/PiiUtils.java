package com.gramincareersetu.common;

/**
 * Utility for masking Personally Identifiable Information (PII)
 * in application logs and diagnostic outputs to comply with data privacy standards.
 */
public final class PiiUtils {

    private PiiUtils() {}

    /**
     * Masks a phone number showing only the first 2 and last 2 digits.
     * e.g., "9876543210" -> "98******10"
     */
    public static String maskPhone(String phone) {
        if (phone == null || phone.isBlank()) {
            return "[EMPTY]";
        }
        String clean = phone.trim();
        if (clean.length() <= 4) {
            return "****";
        }
        return clean.substring(0, 2) + "******" + clean.substring(clean.length() - 2);
    }

    /**
     * Masks an email address showing only the first and last character of the local part.
     * e.g., "ravi.kumar@gmail.com" -> "r***r@gmail.com"
     */
    public static String maskEmail(String email) {
        if (email == null || email.isBlank()) {
            return "[EMPTY]";
        }
        int atIndex = email.indexOf('@');
        if (atIndex <= 1) {
            return "****" + (atIndex >= 0 ? email.substring(atIndex) : "");
        }
        String local = email.substring(0, atIndex);
        String domain = email.substring(atIndex);
        if (local.length() <= 2) {
            return local.charAt(0) + "***" + domain;
        }
        return local.charAt(0) + "***" + local.charAt(local.length() - 1) + domain;
    }
}
