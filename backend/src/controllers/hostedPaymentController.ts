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
          body { 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            height: 100vh; 
            margin: 0; 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            background: #f8fafc; 
            padding: 24px;
            box-sizing: border-box;
          }
          .card {
            background: white;
            border-radius: 32px;
            padding: 40px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
            max-width: 400px;
            width: 100%;
            text-align: center;
            box-sizing: border-box;
          }
          .icon-box {
            width: 80px;
            height: 80px;
            border-radius: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 24px auto;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          }
          .icon-box.success {
            background: #ecfdf5;
            border: 1px solid #d1fae5;
          }
          .icon-box.cancel {
            background: #fff1f2;
            border: 1px solid #ffe4e6;
          }
          h2 { 
            color: #0f172a; 
            font-weight: 900; 
            font-size: 24px; 
            margin: 0 0 12px 0; 
            letter-spacing: -0.025em; 
          }
          p { 
            color: #64748b; 
            font-size: 14px; 
            margin: 0 0 32px 0; 
            font-weight: 500; 
            line-height: 1.6; 
          }
          .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: white;
            text-decoration: none;
            padding: 18px 36px;
            border-radius: 20px;
            font-weight: 800;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            transition: all 0.2s;
            width: 100%;
            box-sizing: border-box;
            border: none;
            cursor: pointer;
          }
          .btn.success {
            background: #2563eb;
            box-shadow: 0 10px 15px -3px rgba(37,99,235,0.3);
          }
          .btn.success:hover {
            background: #1d4ed8;
          }
          .btn.cancel {
            background: #e2e8f0;
            color: #475569;
          }
          .btn.cancel:hover {
            background: #cbd5e1;
          }
          .loader { 
            border: 4px solid #f3f3f3; 
            border-top: 4px solid #2563eb; 
            border-radius: 50%; 
            width: 40px; 
            height: 40px; 
            animation: spin 1s linear infinite; 
            margin: 0 auto 20px auto; 
          }
          @keyframes spin { 
            0% { transform: rotate(0deg); } 
            100% { transform: rotate(360deg); } 
          }
        </style>
      </head>
      <body>
        <div id="payment-box" class="card">
          <div class="loader"></div>
          <h2>Securing Checkout Session</h2>
          <p>Please complete payment via the Razorpay panel...</p>
        </div>

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
              const redirectUrl = "mobilefrontend://payment-success?razorpay_payment_id=" + response.razorpay_payment_id + "&razorpay_order_id=" + response.razorpay_order_id + "&razorpay_signature=" + response.razorpay_signature;
              
              // Render payment success screen immediately to obtain direct user click gesture
              document.body.innerHTML = \`
                <div class="card">
                  <div class="icon-box success">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                  </div>
                  <h2>Payment Successful!</h2>
                  <p>Your transaction has been verified successfully.<br>Tap below to return and activate your order.</p>
                  <a href="\${redirectUrl}" class="btn success">Return to Chakaachak</a>
                </div>
              \`;
              
              // Optimistically try auto redirect as well
              setTimeout(() => {
                window.location.href = redirectUrl;
              }, 600);
            },
            "modal": {
              "ondismiss": function() {
                const cancelUrl = "mobilefrontend://payment-cancelled";
                
                document.body.innerHTML = \`
                  <div class="card">
                    <div class="icon-box cancel">
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                    </div>
                    <h2>Payment Cancelled</h2>
                    <p>The checkout window was closed before completion.<br>Tap below to return to the app.</p>
                    <a href="\${cancelUrl}" class="btn cancel">Go Back</a>
                  </div>
                \`;
                
                // Optimistically try auto redirect
                setTimeout(() => {
                  window.location.href = cancelUrl;
                }, 600);
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
