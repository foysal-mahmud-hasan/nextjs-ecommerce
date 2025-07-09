"use client";

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-yellow-600 mb-4">Payment Cancelled</h1>
        
        <p className="text-gray-600 mb-6">
          You have cancelled the payment process. No charges have been made to your account.
        </p>
        
        <div className="space-y-3">
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Continue Shopping
          </button>
          
          <button 
            onClick={() => window.history.back()}
            className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Go Back
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-6">
          Your cart items are still saved and waiting for you.
        </p>
      </div>
    </div>
  );
}
