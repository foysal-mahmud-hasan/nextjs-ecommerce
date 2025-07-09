import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const reason = req.nextUrl.searchParams.get('reason') || 'Payment failed';
  const redirectUrl = new URL('/payment-failed', req.url);
  redirectUrl.searchParams.set('reason', reason);
  
  return NextResponse.redirect(redirectUrl.toString());
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const reason = formData.get('fail_reason') as string || formData.get('error') as string || 'Payment failed';
    
    console.log('❌ Payment FAILED (POST):', { reason });
    
    const redirectUrl = `${req.nextUrl.origin}/payment-failed?reason=${encodeURIComponent(reason)}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Failed</title>
          <meta http-equiv="refresh" content="0;url=${redirectUrl}">
        </head>
        <body>
          <script>
            window.location.href = "${redirectUrl}";
          </script>
          <p>Payment failed! Redirecting...</p>
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
    const redirectUrl = `${req.nextUrl.origin}/payment-failed?reason=Unknown error occurred`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payment Failed</title>
          <meta http-equiv="refresh" content="0;url=${redirectUrl}">
        </head>
        <body>
          <script>
            window.location.href = "${redirectUrl}";
          </script>
          <p>Payment failed! Redirecting...</p>
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
