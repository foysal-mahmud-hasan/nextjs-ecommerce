import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const transId = req.nextUrl.searchParams.get('tran_id');
    const amount = req.nextUrl.searchParams.get('amount');
    
    console.log('✅ Payment SUCCESS (GET):', { transId, amount });
    
    // Redirect to success page with transaction details
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
    
    // const findPayment= await MongoDB.findOne({trans_id})
    // if(findPayment){
    //   await findOneAndUpdate.payment.updateOne({trans_id,{
    //     $set:{paid:true},
    //   }})
    // }

    // Instead of redirecting, return HTML that redirects the user
    const redirectUrl = `${req.nextUrl.origin}/payment-success?tran_id=${transId}&amount=${amount}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Successful</title>
          <meta http-equiv="refresh" content="0;url=${redirectUrl}">
        </head>
        <body>
          <script>
            window.location.href = "${redirectUrl}";
          </script>
          <p>Payment successful! Redirecting...</p>
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('❌ Payment success error:', error);
    const redirectUrl = `${req.nextUrl.origin}/payment-failed?reason=Processing error`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Error</title>
          <meta http-equiv="refresh" content="0;url=${redirectUrl}">
        </head>
        <body>
          <script>
            window.location.href = "${redirectUrl}";
          </script>
          <p>Processing error! Redirecting...</p>
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
}
