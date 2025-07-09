/**
 * Get the base URL for the application from environment variables
 * Falls back to localhost:3000 if not set
 */
export function getBaseUrl(): string {
  return process.env.SSL_BASE_URL || "http://localhost:3000";
}

/**
 * Get all payment callback URLs
 */
export function getPaymentUrls() {
  const baseUrl = getBaseUrl();
  
  return {
    baseUrl,
    successUrl: `${baseUrl}/api/payment/success`,
    failUrl: `${baseUrl}/api/payment/fail`,
    cancelUrl: `${baseUrl}/api/payment/cancel`,
    ipnUrl: `${baseUrl}/api/payment/ipn`,
  };
}

/**
 * Log the current payment configuration
 */
export function logPaymentConfig() {
  const urls = getPaymentUrls();
  console.log('🔗 Payment URLs configured:', urls);
  return urls;
}
