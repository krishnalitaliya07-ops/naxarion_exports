exports.welcomeEmailTemplate = (name, role) => {
  const roleInfo = {
    customer: {
      icon: '🛍️',
      title: 'Welcome to Our Community',
      description: 'Start exploring quality products from verified suppliers worldwide'
    },
    importer: {
      icon: '📦',
      title: 'Welcome, Importer!',
      description: 'Discover and source products from trusted global suppliers'
    },
    exporter: {
      icon: '🚢',
      title: 'Welcome, Exporter!',
      description: 'Connect with buyers worldwide and grow your export business'
    },
    supplier: {
      icon: '🏭',
      title: 'Welcome, Supplier!',
      description: 'Showcase your products to a global marketplace'
    },
    buyer: {
      icon: '🤝',
      title: 'Welcome, Buyer!',
      description: 'Find quality products from verified suppliers'
    }
  };

  const info = roleInfo[role] || roleInfo.customer;

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <title>Welcome to Nexarion - ${name}</title>
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
          margin: 10px 0 0 0;
          font-size: 28px;
          font-weight: 700;
        }
        
        .header .icon {
          font-size: 64px;
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
        
        .feature-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
          margin: 30px 0;
        }
        
        .feature-card {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border: 1px solid #e5e7eb;
        }
        
        .feature-card .icon {
          font-size: 32px;
          margin-bottom: 10px;
        }
        
        .feature-card h3 {
          color: #1f2937;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 5px;
        }
        
        .feature-card p {
          color: #6b7280;
          font-size: 12px;
          margin: 0;
        }
        
        .cta-container {
          text-align: center;
          margin: 30px 0;
        }
        
        .cta-button {
          display: inline-block;
          padding: 16px 40px;
          background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%);
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 16px;
          box-shadow: 0 4px 6px rgba(20, 184, 166, 0.3);
        }
        
        .info-box {
          background: #eff6ff;
          border-left: 4px solid #3b82f6;
          padding: 20px;
          margin: 20px 0;
          border-radius: 6px;
        }
        
        .info-box p {
          color: #1e3a8a;
          margin: 0;
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
        
        .divider {
          height: 1px;
          background: #e5e7eb;
          margin: 20px 0;
        }
        
        /* Responsive Design */
        @media only screen and (max-width: 600px) {
          .feature-grid {
            grid-template-columns: 1fr;
          }
          
          .header {
            padding: 30px 20px;
          }
          
          .content {
            padding: 30px 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-wrapper">
        <div class="header">
          <div class="icon">${info.icon}</div>
          <h1>${info.title}</h1>
          <p>${info.description}</p>
        </div>
        
        <div class="content">
          <h2>Welcome to Nexarion, ${name}! 🎉</h2>
          
          <p>Congratulations! Your account has been successfully verified, and you're now part of the <strong>Nexarion Global Exports</strong> community.</p>
          
          <p>We're thrilled to have you on board as you begin your journey in global trade.</p>
          
          <div class="feature-grid">
            <div class="feature-card">
              <div class="icon">✓</div>
              <h3>Verified Suppliers</h3>
              <p>Trade with confidence</p>
            </div>
            <div class="feature-card">
              <div class="icon">🌍</div>
              <h3>Global Reach</h3>
              <p>Worldwide connections</p>
            </div>
            <div class="feature-card">
              <div class="icon">🔒</div>
              <h3>Secure Payments</h3>
              <p>Safe transactions</p>
            </div>
            <div class="feature-card">
              <div class="icon">📊</div>
              <h3>Analytics</h3>
              <p>Track your progress</p>
            </div>
          </div>
          
          <div class="cta-container">
            <a href="${process.env.CLIENT_URL || 'http://localhost:3000'}" class="cta-button">Explore Platform</a>
          </div>
          
          <div class="info-box">
            <p><strong>💡 Quick Tip:</strong> Complete your profile to get the most out of Nexarion. Add your business details, preferences, and verification documents to build trust with potential partners.</p>
          </div>
          
          <div class="divider"></div>
          
          <p>Need help getting started? Check out our resources or contact our support team.</p>
          
          <p>Happy trading!<br>
          <strong>The Nexarion Team</strong></p>
        </div>
        
        <div class="footer">
          <p><strong>Nexarion Global Exports</strong></p>
          <p>© ${new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
