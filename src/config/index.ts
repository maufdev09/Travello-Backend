import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

  },
  openRouter_api_key: process.env.OPENROUTER_API_KEY,
  SSLCommerz: {
    store_id: process.env.SSL_STORE_ID,
    store_passwd: process.env.SSL_STORE_PASS,
    payment_api: process.env.SSL_PAYMENT_API,
    validation_api: process.env.SSL_VALIDATOIN_API,

    success_backend_url: process.env.SSL_SUCCESS_BACKEND_URL,
    fail_backend_url: process.env.SSL_FAIL_BACKEND_URL,
    cancel_backend_url: process.env.SSL_CANCEL_BACKEND_URL,
    success_frontend_url: process.env.SSL_SUCCESS_FRONTEND_URL,
    fail_frontend_url: process.env.SSL_FAIL_FRONTEND_URL,
    cancel_frontend_url: process.env.SSL_CANCEL_FRONTEND_URL,
    

  }
};
