import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const transId = formData.get('tran_id') as string;
    const status = formData.get('status') as string;
    const amount = formData.get('amount') as string;
    
    console.log('IPN received:', { transId, status, amount });
    
    // Here you would typically:
    // 1. Validate the transaction with SSLCommerz
    // 2. Update your database
    // 3. Send confirmation emails, etc.
    
    if (status === 'VALID') {
      // Transaction is valid
      console.log(`Transaction ${transId} is valid`);
      return new NextResponse('OK', { status: 200 });
    } else {
      // Transaction is invalid
      console.log(`Transaction ${transId} is invalid`);
      return new NextResponse('INVALID', { status: 400 });
    }
  } catch (error) {
    console.error('IPN Error:', error);
    return new NextResponse('ERROR', { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return new NextResponse('IPN endpoint - use POST method', { status: 405 });
}
