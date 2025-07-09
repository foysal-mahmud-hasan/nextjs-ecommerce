# SSLCommerz Payment Integration for Fragorus E-commerce

This project has been integrated with SSLCommerz payment gateway for secure online payments.

## 🚀 Quick Setup

### 1. Environment Variables

Update your `.env.local` file with your SSLCommerz credentials:

```env
# SSLCommerz Credentials
STORE_ID="your_actual_store_id"
STORE_PASSWORD="your_actual_store_password"

# Base URL for payment callbacks
SSL_BASE_URL="http://localhost:3000"  # Local development
# SSL_BASE_URL="https://yourdomain.com"  # Production
```

### 2. For Testing (Local Development with ngrok)

1. Install ngrok: `npm install -g ngrok`
2. Start your dev server: `npm run dev`
3. In another terminal, start ngrok: `ngrok http 3000`
4. Copy the ngrok URL and update `SSL_BASE_URL` in `.env.local`
5. Restart your dev server

### 3. Payment Flow

1. **Checkout Page**: `/checkout` - Simplified form with only necessary customer information
2. **Payment Processing**: Users fill the form and click "Pay with SSLCommerz"
3. **Redirection**: Users are redirected to SSLCommerz payment gateway
4. **Result Pages**:
   - Success: `/payment-success`
   - Failed: `/payment-failed`
   - Cancelled: `/payment-cancelled`

## 📁 File Structure

```
├── hooks/
│   └── usePayment.ts          # Payment hook for easy integration
├── lib/
│   ├── config.ts             # Environment configuration
│   └── sslConfig.ts          # SSLCommerz configuration
├── app/
│   ├── checkout/page.tsx     # Updated checkout page
│   ├── payment-success/page.tsx
│   ├── payment-failed/page.tsx
│   ├── payment-cancelled/page.tsx
│   └── api/payment/
│       ├── request/route.ts  # Payment initialization
│       ├── success/route.ts  # Success callback
│       ├── fail/route.ts     # Failure callback
│       ├── cancel/route.ts   # Cancel callback
│       └── ipn/route.ts      # Instant Payment Notification
```

## 🔧 Key Features

- ✅ Simplified checkout form (removed credit card fields)
- ✅ Real-time payment status updates
- ✅ Proper error handling and user feedback
- ✅ Loading states and disabled buttons during processing
- ✅ Transaction ID tracking
- ✅ Mobile-responsive design
- ✅ Toast notifications for user feedback

## 🛡️ Security Features

- Server-side payment validation
- Secure callback URLs
- Transaction verification
- Error logging and monitoring

## 📱 Testing the Integration

1. Add products to cart
2. Go to checkout (`/checkout`)
3. Fill in customer information (all fields with * are required)
4. Click "Pay ৳{amount} with SSLCommerz"
5. Complete payment on SSLCommerz gateway
6. Verify redirection to success/failure pages

## 🚨 Important Notes

- Always use HTTPS in production
- Keep your SSLCommerz credentials secure
- Test thoroughly before going live
- Monitor payment logs for debugging

## 🔄 Production Deployment

1. Update `SSL_BASE_URL` to your production domain
2. Set `is_live = true` in `lib/sslConfig.ts`
3. Use production SSLCommerz credentials
4. Enable HTTPS/SSL on your domain
5. Test payment flow thoroughly

## 📊 Database Integration

The current implementation includes placeholders for database operations. To fully integrate:

1. Uncomment and implement payment record creation in `/api/payment/request`
2. Add payment status updates in success/fail callbacks
3. Link payments to your existing order system

---

**Note**: Make sure to replace `"your_actual_store_id"` and `"your_actual_store_password"` with your real SSLCommerz credentials.
