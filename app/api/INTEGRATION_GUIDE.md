# 🚀 SSLCommerz Integration Guide for Existing Next.js Projects

This guide will help you integrate SSLCommerz payment gateway into your existing Next.js application.

## 📋 Prerequisites

- Next.js 13+ with App Router
- Node.js 16+
- SSLCommerz merchant account (sandbox or live)

## 🎯 Step-by-Step Integration

### Step 1: Install Dependencies

```bash
npm install sslcommerz
# or
yarn add sslcommerz
```

### Step 2: Environment Configuration

Create or update your `.env.local` file:

```env
# SSLCommerz Credentials
STORE_ID="your_store_id_here"
STORE_PASSWORD="your_store_password_here"

# Base URL for payment callbacks
SSL_BASE_URL="https://yourdomain.com"  # Production
# SSL_BASE_URL="https://your-ngrok-url.ngrok-free.app"  # Local with ngrok
# SSL_BASE_URL="http://localhost:3000"  # Local (callbacks won't work)
```

### Step 3: Create Configuration Utility

Create `lib/config.ts`:

```typescript
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
    successUrl: \`\${baseUrl}/api/payment/success\`,
    failUrl: \`\${baseUrl}/api/payment/fail\`,
    cancelUrl: \`\${baseUrl}/api/payment/cancel\`,
    ipnUrl: \`\${baseUrl}/api/payment/ipn\`,
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
```

### Step 4: Create SSL Configuration

Create `lib/sslConfig.ts`:

```typescript
import { SslCommerzPayment } from "sslcommerz";
import { getBaseUrl } from "./config";

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; // Set to true for production

export const sslConfig = new SslCommerzPayment(store_id, store_passwd, is_live);

interface PaymentData {
  total_amount: number;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  product_name: string;
  product_category: string;
  cus_name: string;
  cus_email: string;
  cus_add1: string;
  cus_phone: string;
}

export const createPaymentData = (data: PaymentData) => {
  return {
    total_amount: data.total_amount,
    tran_id: data.tran_id,
    currency: "BDT",
    success_url: data.success_url,
    fail_url: data.fail_url,
    cancel_url: data.cancel_url,
    ipn_url: \`\${getBaseUrl()}/api/payment/ipn\`,
    shipping_method: "Courier",
    product_name: data.product_name,
    product_category: data.product_category,
    product_profile: "general",
    cus_name: data.cus_name,
    cus_email: data.cus_email,
    cus_add1: data.cus_add1,
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: data.cus_phone,
    cus_fax: "01711111111",
    ship_name: data.cus_name,
    ship_add1: data.cus_add1,
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
  };
};
```

### Step 5: Create API Routes

#### 5.1 Payment Request Route

Create `app/api/payment/request/route.ts`:

```typescript
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
    const transactionId = \`\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`;

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
```

#### 5.2 Success Callback Route

Create `app/api/payment/success/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const transId = req.nextUrl.searchParams.get('tran_id');
    const amount = req.nextUrl.searchParams.get('amount');

    console.log('✅ Payment SUCCESS (GET):', { transId, amount });

    const redirectUrl = new URL('/payment-success', req.url);
    if (transId) redirectUrl.searchParams.set('tran_id', transId);
    if (amount) redirectUrl.searchParams.set('amount', amount);

    return NextResponse.redirect(redirectUrl.toString());
  } catch (error) {
    console.error('❌ Payment success GET error:', error);
    return NextResponse.redirect(new URL('/payment-failed', req.url));
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const transId = formData.get('tran_id') as string;
    const amount = formData.get('amount') as string;
    const status = formData.get('status') as string;

    console.log('✅ Payment SUCCESS (POST):', { transId, amount, status });

    // Update payment status in your database here
    // await updatePaymentStatus(transId, 'completed');

    const redirectUrl = \`\${req.nextUrl.origin}/payment-success?tran_id=\${transId}&amount=\${amount}\`;

    const html = \`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Successful</title>
          <meta http-equiv="refresh" content="0;url=\${redirectUrl}">
        </head>
        <body>
          <script>
            window.location.href = "\${redirectUrl}";
          </script>
          <p>Payment successful! Redirecting...</p>
        </body>
      </html>
    \`;

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    console.error('❌ Payment success error:', error);
    const redirectUrl = \`\${req.nextUrl.origin}/payment-failed?reason=Processing error\`;

    const html = \`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Error</title>
          <meta http-equiv="refresh" content="0;url=\${redirectUrl}">
        </head>
        <body>
          <script>window.location.href = "\${redirectUrl}";</script>
          <p>Processing error! Redirecting...</p>
        </body>
      </html>
    \`;

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}
```

#### 5.3 Fail Callback Route

Create `app/api/payment/fail/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const reason = req.nextUrl.searchParams.get('reason') || 'Payment failed';
  const redirectUrl = \`\${req.nextUrl.origin}/payment-failed?reason=\${encodeURIComponent(reason)}\`;

  return NextResponse.redirect(redirectUrl);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const reason = formData.get('fail_reason') as string || 'Payment failed';
    const transId = formData.get('tran_id') as string;

    console.log('❌ Payment FAILED (POST):', { reason, transId });

    // Update payment status in your database here
    // await updatePaymentStatus(transId, 'failed');

    const redirectUrl = \`\${req.nextUrl.origin}/payment-failed?reason=\${encodeURIComponent(reason)}\`;

    const html = \`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Failed</title>
          <meta http-equiv="refresh" content="0;url=\${redirectUrl}">
        </head>
        <body>
          <script>window.location.href = "\${redirectUrl}";</script>
          <p>Payment failed! Redirecting...</p>
        </body>
      </html>
    \`;

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    const redirectUrl = \`\${req.nextUrl.origin}/payment-failed?reason=Unknown error\`;
    return NextResponse.redirect(redirectUrl);
  }
}
```

#### 5.4 Cancel Callback Route

Create `app/api/payment/cancel/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const redirectUrl = \`\${req.nextUrl.origin}/payment-cancelled\`;
  return NextResponse.redirect(redirectUrl);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const transId = formData.get('tran_id') as string;

    console.log('⚠️ Payment CANCELLED (POST):', { transId });

    // Update payment status in your database here
    // await updatePaymentStatus(transId, 'cancelled');

    const redirectUrl = \`\${req.nextUrl.origin}/payment-cancelled\`;

    const html = \`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Cancelled</title>
          <meta http-equiv="refresh" content="0;url=\${redirectUrl}">
        </head>
        <body>
          <script>window.location.href = "\${redirectUrl}";</script>
          <p>Payment cancelled! Redirecting...</p>
        </body>
      </html>
    \`;

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (error) {
    const redirectUrl = \`\${req.nextUrl.origin}/payment-cancelled\`;
    return NextResponse.redirect(redirectUrl);
  }
}
```

#### 5.5 IPN Route (Optional but recommended)

Create `app/api/payment/ipn/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const transId = formData.get('tran_id') as string;
    const status = formData.get('status') as string;
    const amount = formData.get('amount') as string;

    console.log('📢 IPN received:', { transId, status, amount });

    // Validate transaction with SSLCommerz here if needed
    // Update your database based on IPN data

    if (status === 'VALID') {
      // Transaction is valid - update database
      console.log(\`Transaction \${transId} is valid\`);
      return new NextResponse('OK', { status: 200 });
    } else {
      console.log(\`Transaction \${transId} is invalid\`);
      return new NextResponse('INVALID', { status: 400 });
    }
  } catch (error) {
    console.error('IPN Error:', error);
    return new NextResponse('ERROR', { status: 500 });
  }
}
```

### Step 6: Create Payment Pages

#### 6.1 Success Page

Create `app/payment-success/page.tsx`:

```tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const transId = searchParams.get("tran_id");
  const amount = searchParams.get("amount");

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>

        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully. Thank you for your
          purchase!
        </p>

        {(transId || amount) && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 space-y-2">
              {transId && (
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono font-medium">{transId}</span>
                </div>
              )}
              {amount && (
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">৳{amount}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => (window.location.href = "/")}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
```

#### 6.2 Failed Page

Create `app/payment-failed/page.tsx`:

```tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Failed</h1>

        <p className="text-gray-600 mb-6">
          We're sorry, but your payment could not be processed. Please try
          again.
        </p>

        {reason && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">
              <strong>Reason:</strong> {reason}
            </p>
          </div>
        )}

        <button
          onClick={() => (window.location.href = "/")}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <PaymentFailedContent />
    </Suspense>
  );
}
```

#### 6.3 Cancelled Page

Create `app/payment-cancelled/page.tsx`:

```tsx
"use client";

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-yellow-600 mb-4">
          Payment Cancelled
        </h1>

        <p className="text-gray-600 mb-6">
          You have cancelled the payment process. No charges have been made to
          your account.
        </p>

        <button
          onClick={() => (window.location.href = "/")}
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}
```

### Step 7: Create Payment Hook (Optional)

Create `hooks/usePayment.ts`:

```typescript
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
```

### Step 8: Usage Example

Here's how to use the payment system in your components:

```tsx
"use client";

import { useState } from 'react';
import { usePayment } from '../hooks/usePayment';

export default function PaymentForm() {
  const { initiatePayment, loading, error } = usePayment();
  const [formData, setFormData] = useState({
    amount: 100,
    productName: 'Sample Product',
    customerName: '',
    customerEmail: '',
    customerAddress: '',
    customerPhone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    initiatePayment(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Amount (৳)</label>
        <input
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Product Name</label>
        <input
          type="text"
          value={formData.productName}
          onChange={(e) => setFormData({...formData, productName: e.target.value})}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Customer Name</label>
        <input
          type="text"
          value={formData.customerName}
          onChange={(e) => setFormData({...formData, customerName: e.target.value})}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Email</label>
        <input
          type="email"
          value={formData.customerEmail}
          onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Phone</label>
        <input
          type="tel"
          value={formData.customerPhone}
          onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-bold mb-2">Address</label>
        <textarea
          value={formData.customerAddress}
          onChange={(e) => setFormData({...formData, customerAddress: e.target.value})}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          rows={3}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg"
      >
        {loading ? 'Processing...' : \`Pay ৳\${formData.amount}\`}
      </button>
    </form>
  );
}
```

## 🔧 Testing & Deployment

### Local Testing with ngrok:

1. **Install ngrok**: \`npm install -g ngrok\`
2. **Start your app**: \`npm run dev\`
3. **Start ngrok**: \`ngrok http 3000\`
4. **Update SSL_BASE_URL** in your \`.env.local\` with the ngrok URL
5. **Restart your app**

### Production Deployment:

1. **Set environment variables** in your hosting platform
2. **Update SSL_BASE_URL** to your production domain
3. **Set \`is_live = true\`** in \`lib/sslConfig.ts\` for production
4. **Test thoroughly** before going live

## 🎯 Database Integration

To properly track payments, integrate with your database:

```typescript
// Example with Prisma
import { prisma } from "@/lib/prisma";

// In payment request route:
await prisma.payment.create({
  data: {
    transactionId,
    amount: body.amount,
    status: "pending",
    customerEmail: body.customerEmail,
    productName: body.productName,
  },
});

// In success route:
await prisma.payment.update({
  where: { transactionId },
  data: { status: "completed" },
});
```

## ✅ Checklist

- [ ] Install sslcommerz package
- [ ] Configure environment variables
- [ ] Create configuration utilities
- [ ] Set up API routes (request, success, fail, cancel, ipn)
- [ ] Create payment result pages
- [ ] Test with ngrok for local development
- [ ] Integrate with your database
- [ ] Deploy with production credentials

## 🚨 Important Notes

1. **Never commit** \`.env\` files to version control
2. **Always validate** payment data server-side
3. **Use HTTPS** in production
4. **Implement proper** error handling and logging
5. **Test thoroughly** before going live
6. **Keep transaction IDs** unique and unpredictable

This integration provides a complete, production-ready SSLCommerz payment system for your Next.js application!
