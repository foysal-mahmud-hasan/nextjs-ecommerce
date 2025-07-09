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
    ipn_url: `${getBaseUrl()}/api/payment/ipn`,
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
