import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const redirectUrl = `${req.nextUrl.origin}/payment-cancelled`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payment Cancelled</title>
        <meta http-equiv="refresh" content="0;url=${redirectUrl}">
      </head>
      <body>
        <script>
          window.location.href = "${redirectUrl}";
        </script>
        <p>Payment cancelled! Redirecting...</p>
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

export async function POST(req: NextRequest) {
  const redirectUrl = `${req.nextUrl.origin}/payment-cancelled`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Payment Cancelled</title>
        <meta http-equiv="refresh" content="0;url=${redirectUrl}">
      </head>
      <body>
        <script>
          window.location.href = "${redirectUrl}";
        </script>
        <p>Payment cancelled! Redirecting...</p>
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
