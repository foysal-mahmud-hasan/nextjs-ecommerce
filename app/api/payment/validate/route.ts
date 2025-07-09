import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Payment validation endpoint",
    timestamp: new Date().toISOString(),
    status: "ready"
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Validation request received:', body);
    
    return NextResponse.json({
      status: "success",
      message: "Transaction validated",
      data: body
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({
      status: "error",
      message: "Validation failed"
    }, { status: 400 });
  }
}
