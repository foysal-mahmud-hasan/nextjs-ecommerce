import { NextResponse } from "next/server";
import { sslConfig, createPaymentData } from "../../../../lib/sslConfig";
import { getPaymentUrls, logPaymentConfig } from "../../../../lib/config";

interface SSLResponse {
  status: string;
  GatewayPageURL?: string;
  failedreason?: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Generate unique transaction ID
    const transactionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Get URLs from environment configuration
    const urls = logPaymentConfig();

    const paymentData = createPaymentData({
      total_amount: body.amount,
      tran_id: transactionId,
      success_url: urls.successUrl,
      fail_url: urls.failUrl,
      cancel_url: urls.cancelUrl,
      product_name: body.productName,
      product_category: body.productCategory || "general",
      cus_name: body.customerName,
      cus_email: body.customerEmail,
      cus_add1: body.customerAddress,
      cus_phone: body.customerPhone,
    });

    const result: SSLResponse = await sslConfig.init(paymentData);

    if (!result.GatewayPageURL || result.status === "FAILED") {
      return NextResponse.json({
        success: false,
        message: result.failedreason || "Payment initialization failed"
      });
    }

    if (result.status === "SUCCESS") {
      // Store payment info in your database here
      // await savePayment({ transactionId, amount: body.amount, status: 'pending' });

      return NextResponse.json({
        success: true,
        gatewayUrl: result.GatewayPageURL,
        transactionId
      });
    }

    return NextResponse.json({
      success: false,
      message: "Unexpected response from payment gateway"
    });
  } catch (error) {
    console.error("Payment request error:", error);
    return NextResponse.json({
      success: false,
      message: "Internal server error"
    }, { status: 500 });
  }
}

export async function GET() {
  // Generate unique transaction ID for testing
  let transactionId = `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Get URLs from environment configuration
  const urls = logPaymentConfig();
  
  const paymentData = createPaymentData({
    total_amount: 256,
    tran_id: transactionId,
    success_url: urls.successUrl,
    fail_url: urls.failUrl,
    cancel_url: urls.cancelUrl,
    product_name: "Samsung Galaxy S23 ultra",
    product_category: "mobile",
    cus_name: "Kajol Roy",
    cus_email: "shrikajol@gmail.com",
    cus_add1: "Lalmonirhat",
    cus_phone: "01705956055",
  });
  try {
    const result: SSLResponse = await sslConfig.init(paymentData);
    
    if (!result.GatewayPageURL || result.status === "FAILED") {
      return NextResponse.json({ message: result.failedreason });
    } else if (result.status === "SUCCESS") {
      return NextResponse.redirect(result.GatewayPageURL);
    } 

    return NextResponse.json({ message: "Unexpected response" });
  } catch (error) {
    return NextResponse.json({ message: "Error: " + error });
  }
}
