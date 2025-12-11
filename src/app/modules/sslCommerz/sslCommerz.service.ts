import  httpStatus  from 'http-status';
import axios from "axios";
import config from "../../../config";
import { ISSLCommerz } from "./sslCommerz.interface";
import ApiError from "../../errors/ApiError";

const sslPaymentInit =  async (payload: ISSLCommerz) => {

try {
      const data = {
    store_id: config.SSLCommerz.store_id,
    store_passwd: config.SSLCommerz.store_passwd,
    total_amount: payload.amount,
    currency: "BDT",
    tran_id: payload.transactionId,
    success_url: `${config.SSLCommerz.success_backend_url}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success&bookingDateId=${payload.bookingDateId}`,
    fail_url: `${config.SSLCommerz.fail_backend_url}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail&bookingDateId=${payload.bookingDateId}`,
    cancel_url: `${config.SSLCommerz.cancel_backend_url}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel&bookingDateId=${payload.bookingDateId}`,
    // ipn_url: config.SSLCommerz.ipn_url,
    shipping_method: "N/A",
    product_name: "Tour",
    product_category: "Service",
    product_profile: "general",
    cus_name: payload.name,
    cus_email: payload.email,
    cus_add1: payload.address,
    cus_add2: "N/A",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: payload.phoneNumber,
    cus_fax: "01711111111",
    ship_name: "N/A",
    ship_add1: "N/A",
    ship_add2: "N/A",
    ship_city: "N/A",
    ship_state: "N/A",
    ship_postcode: 1000,
    ship_country: "N/A",
  };
 const response =await axios({
    method: "post",
    url: config.SSLCommerz.payment_api,
    data: data,
    headers: {"Content-Type": "application/x-www-form-urlencoded"}
 })

 console.log(data);
 
 return response.data;
} catch (error) {
    console.log(error)
    throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to initiate payment');
}

};


export const sslCommerzService = {
    sslPaymentInit
};