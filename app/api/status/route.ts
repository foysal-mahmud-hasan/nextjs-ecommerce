import { NextResponse } from "next/server";
import { getPaymentUrls } from "../../../lib/config";

export async function GET() {
  const urls = getPaymentUrls();
  
  return NextResponse.json({
    ...urls,
    storeId: process.env.STORE_ID ? "Configured" : "Not configured",
    environment: process.env.NODE_ENV || "development"
  });
}
