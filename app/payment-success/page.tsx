"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { useProductStore } from '../_zustand/store';
import toast from 'react-hot-toast';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const transId = searchParams.get('tran_id');
  const amount = searchParams.get('amount');
  const { clearCart } = useProductStore();

  useEffect(() => {
    // Clear the cart when payment is successful
    if (transId) {
      clearCart();
      toast.success('Payment completed successfully!');
    }
  }, [transId, clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-green-600 mb-4">Payment Successful!</h1>
        
        <p className="text-gray-600 mb-6">
          Your payment has been processed successfully. Thank you for your purchase! Your cart has been cleared.
        </p>
        
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
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="text-green-600 font-medium">Completed</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Continue Shopping
          </button>
          
          <button 
            onClick={() => window.print()}
            className="w-full bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Print Receipt
          </button>
        </div>
        
        <p className="text-xs text-gray-500 mt-6">
          You will receive a confirmation email shortly.
        </p>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
