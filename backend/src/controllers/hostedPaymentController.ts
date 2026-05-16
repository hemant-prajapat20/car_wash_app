import { Request, Response } from 'express';
import { razorpayInstance } from '../config/razorpay';

export const getHostedPaymentPage = async (req: Request, res: Response) => {
  const { orderId, amount, name, email, contact, key } = req.query;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Razorpay Checkout</title>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <style>
          body { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; font-family: sans-serif; background: #f8fafc; }
          .loader { border: 4px solid #f3f3f3; border-top: 4px solid #2563eb; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          h2 { color: #1e293b; font-weight: 800; margin-bottom: 8px; }
          p { color: #64748b; font-size: 14px; }
        </style>
      </head>
      <body>
        <script>
          const options = {
            "key": "${key}",
            "amount": "${amount}",
            "currency": "INR",
            "name": "Chakaachak",
            "description": "Service Booking",
            "order_id": "${orderId}",
            "prefill": {
              "name": "${name}",
              "email": "${email}",
              "contact": "${contact}"
            },
            "theme": { "color": "#2563eb" },
            "handler": function (response) {
              // Redirect back to app with success
              window.location.href = "mobilefrontend://payment-success?razorpay_payment_id=" + response.razorpay_payment_id + "&razorpay_order_id=" + response.razorpay_order_id + "&razorpay_signature=" + response.razorpay_signature;
            },
            "modal": {
              "ondismiss": function() {
                window.location.href = "mobilefrontend://payment-cancelled";
              }
            }
          };
          const rzp = new Razorpay(options);
          rzp.open();
        </script>
      </body>
    </html>
  `;
  res.send(html);
};
