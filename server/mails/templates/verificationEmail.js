exports.verificationEmailTemplate = (name, code) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Email Verification - Nexarion</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f3f4f6;
          padding: 20px;
        }
        
        .email-wrapper {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%);
          color: #ffffff;
          padding: 40px 30px;
          text-align: center;
        }
        
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 700;
        }
        
        .header .logo {
          font-size: 48px;
          margin-bottom: 10px;
        }
        
        .content {
          padding: 40px 30px;
          background: #ffffff;
        }
        
        .content h2 {
          color: #1f2937;
          font-size: 24px;
          margin-bottom: 20px;
        }
        
        .content p {
          color: #4b5563;
          font-size: 16px;
          margin-bottom: 15px;
        }
        
        .code-container {
          background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
          border: 3px dashed #14b8a6;
          padding: 30px;
          text-align: center;
          margin: 30px 0;
          border-radius: 10px;
        }
        
        .code-label {
          color: #059669;
          font-size: 14px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 10px;
        }
        
        .verification-code {
          font-size: 40px;
          font-weight: 800;
          color: #14b8a6;
          letter-spacing: 8px;
          font-family: 'Courier New', monospace;
          margin: 10px 0;
        }
        
        .expiry-notice {
          background: #fef3c7;
          border-left: 4px solid #f59e0b;
          padding: 15px;
          margin: 20px 0;
          border-radius: 6px;
        }
        
        .expiry-notice p {
          color: #92400e;
          margin: 0;
          font-size: 14px;
        }
        
        .info-box {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
          border: 1px solid #e5e7eb;
        }
        
        .info-box p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }
        
        .footer {
          background: #f9fafb;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        
        .footer p {
          color: #6b7280;
          font-size: 14px;
          margin: 5px 0;
        }
        
        .footer .social-links {
          margin: 15px 0;
        }
        
        .footer .social-links a {
          display: inline-block;
          margin: 0 10px;
          color: #14b8a6;
          text-decoration: none;
          font-size: 14px;
        }
        
        .divider {
          height: 1px;
          background: #e5e7eb;
          margin: 20px 0;
        }
        
        /* Responsive Design */
        @media only screen and (max-width: 600px) {
          body {
            padding: 10px;
          }
          
          .email-wrapper {
            border-radius: 8px;
          }
          
          .header {
            padding: 30px 20px;
          }
          
          .header h1 {
            font-size: 24px;
          }
          
          .header .logo {
            font-size: 40px;
          }
          
          .content {
            padding: 30px 20px;
          }
          
          .content h2 {
            font-size: 20px;
          }
          
          .verification-code {
            font-size: 32px;
            letter-spacing: 6px;
          }
          
          .code-container {
            padding: 20px;
          }
          
          .footer {
            padding: 20px;
          }
        }
        
        @media only screen and (max-width: 480px) {
          .verification-code {
            font-size: 28px;
            letter-spacing: 4px;
          }
          
          .content h2 {
            font-size: 18px;
          }
          
          .content p {
            font-size: 14px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <!-- Header -->
        <div class="header">
          <div class="logo">🌍</div>
          <h1>Welcome to Nexarion Global Exports</h1>
        </div>
        
        <!-- Content -->
        <div class="content">
          <h2>Hello ${name}! 👋</h2>
          
          <p>Thank you for registering with <strong>Nexarion Global Exports</strong>. We're excited to have you join our global trading community!</p>
          
          <p>To complete your registration and verify your email address, please use the verification code below:</p>
          
          <!-- Verification Code -->
          <div class="code-container">
            <div class="code-label">Your Verification Code</div>
            <div class="verification-code">${code}</div>
          </div>
          
          <!-- Expiry Notice -->
          <div class="expiry-notice">
            <p><strong>⏰ Important:</strong> This verification code will expire in <strong>10 minutes</strong>. Please verify your email as soon as possible.</p>
          </div>
          
          <!-- Info Box -->
          <div class="info-box">
            <p><strong>Didn't request this?</strong><br>
            If you didn't create an account with Nexarion, please ignore this email. Your security is important to us.</p>
          </div>
          
          <div class="divider"></div>
          
          <p>If you have any questions or need assistance, feel free to contact our support team.</p>
          
          <p>Best regards,<br>
          <strong>The Nexarion Team</strong></p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p><strong>Nexarion Global Exports</strong></p>
          <p>Connecting verified suppliers and buyers worldwide</p>
          
          <div class="social-links">
            <a href="#">Website</a> •
            <a href="#">Support</a> •
            <a href="#">Contact</a>
          </div>
          
          <div class="divider"></div>
          
          <p style="font-size: 12px; color: #9ca3af;">
            © ${new Date().getFullYear()} Nexarion Global Exports. All rights reserved.<br>
            This is an automated message, please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
