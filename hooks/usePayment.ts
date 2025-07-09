import { useState } from "react";

interface PaymentData {
  amount: number;
  productName: string;
  productCategory?: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerPhone: string;
}

export function usePayment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initiatePayment = async (paymentData: PaymentData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/payment/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      const result = await response.json();

      if (result.success) {
        // Redirect to SSLCommerz gateway
        window.location.href = result.gatewayUrl;
      } else {
        setError(result.message || "Payment initiation failed");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    initiatePayment,
    loading,
    error,
  };
}
