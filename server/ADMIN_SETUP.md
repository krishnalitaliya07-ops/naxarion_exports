# Admin Dashboard Setup Guide

## 🔐 Admin Authentication System

### Security Features

1. **Hidden Login Route**: `/admin-portal-access`
   - Not listed in public navigation
   - Separate from regular user login
   - Custom endpoint: `/api/auth/admin-secure-portal-2026`

2. **Role-Based Access Control (RBAC)**
   - Only users with `role: 'admin'` can access admin routes
   - Additional middleware protection on all admin endpoints
   - Activity logging for all admin actions

3. **Enhanced Security (Ready for Production)**
   - OTP verification system is ready but **disabled for development**
   - To enable OTP: Uncomment the OTP code in `authController.js` → `adminLogin` function
   - OTP sends a 6-digit code via email
   - 10-minute expiration on OTP codes

### Development Mode

**OTP is currently DISABLED** for easier testing and debugging.

When ready for production:
1. Uncomment OTP code in `server/controllers/authController.js` (lines marked with TODO)
2. Create email template for admin OTP in `server/mails/templates/`
3. Update frontend to handle OTP verification flow

---

## 🚀 Quick Start

### Step 1: Create Admin User

Run this command from the `server` directory:

```bash
node create-admin.js
```

This will create an admin account with:
- **Email**: `admin@nexarion.com`
- **Password**: `Admin@123456`
- **Role**: `admin`

⚠️ **IMPORTANT**: Change this password after first login!

### Step 2: Access Admin Panel

1. Navigate to: `http://localhost:5173/admin-portal-access`
2. Login with the credentials above
3. You'll be redirected to the admin dashboard

---

## 📁 Admin Dashboard Structure

### Backend Routes

**Authentication**:
- `POST /api/auth/admin` - Admin login (hidden endpoint)
- `POST /api/auth/admin-verify-otp` - OTP verification (for production)

**Admin API** (All require authentication + admin role):
- `GET /api/admin/dashboard/overview` - Dashboard stats
- `GET /api/admin/stats` - System statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/users/:id` - User details
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `PATCH /api/admin/users/:id/toggle-active` - Toggle user status
- `GET /api/admin/orders` - All orders
- `GET /api/admin/products` - All products
- `GET /api/admin/quotes` - All quotes
- `GET /api/admin/shipments` - All shipments
- `GET /api/admin/contacts` - Contact submissions

### Frontend Routes

- `/admin-portal-access` - Admin login page (hidden)
- `/admin/dashboard` - Admin dashboard overview
- `/admin/users` - User management
- `/admin/suppliers` - Supplier management
- `/admin/products` - Product management
- `/admin/orders` - Order management
- `/admin/shipments` - Shipment tracking
- `/admin/payments` - Payment management
- `/admin/quotes` - Quote management
- `/admin/contacts` - Contact messages
- `/admin/reports` - Analytics & reports
- `/admin/settings` - System settings

---

## 🎨 Admin Dashboard Features

### Current Implementation

✅ **Secure Admin Login**
- Hidden route with custom endpoint
- Role verification
- Enhanced password validation

✅ **Dashboard Overview**
- Total revenue, orders, users, products
- Quick stats (active users, pending orders, etc.)
- Recent activity (last 7 days)
- System information

✅ **Sidebar Navigation**
- Collapsible sidebar
- Organized by sections (Management, Operations, System)
- Active route highlighting
- Quick actions

✅ **Data Management**
- Users, Products, Orders, Quotes, Shipments
- Pagination support
- Search and filter capabilities
- CRUD operations

### Planned Features (To Implement)

🔜 **User Management Pages**
- List all users with pagination
- View user details
- Edit user information
- Activate/deactivate users
- Delete users

🔜 **Order Management**
- View all orders
- Update order status
- Track shipments
- Process refunds

🔜 **Product Management**
- Add/edit/delete products
- Category management
- Inventory tracking

🔜 **Analytics & Reports**
- Revenue charts
- User growth analytics
- Order statistics
- Export reports (PDF, CSV)

🔜 **Settings**
- System configuration
- Email templates
- Payment settings
- Notification preferences

---

## 🔒 Security Best Practices

### For Development:
1. ✅ Hidden login route (not publicly listed)
2. ✅ Role-based access control
3. ✅ JWT token authentication
4. ✅ Password hashing with bcrypt
5. ⏸️ OTP verification (disabled)

### For Production:
1. Enable OTP verification (see authController.js)
2. Set up IP whitelisting for admin access
3. Implement login attempt limiting
4. Add session timeout for inactivity
5. Enable audit logging for all admin actions
6. Use environment variables for sensitive data
7. Change default admin password
8. Set up 2FA (Two-Factor Authentication)

---

## 📝 Notes

### Admin Credentials (Development Only)
- Store in environment variables for production
- Never commit real credentials to git
- Use strong, unique passwords

### OTP System (For Production)
When enabling OTP:
1. Uncomment code in `adminLogin` function
2. Create email template: `server/mails/templates/adminOTPEmail.js`
3. Test email delivery
4. Update frontend to handle OTP input
5. Test full OTP flow

### Logging
All admin actions are logged to console. In production:
- Use proper logging service (Winston, Morgan)
- Store logs in database or file
- Set up alerts for suspicious activity
- Regular log reviews

---

## 🛠️ Customization

### Changing Admin Login Route
1. Update backend: `server/routes/authRoutes.js`
2. Update frontend: `client/src/pages/auth/AdminLogin.jsx`
3. Update this README

### Adding New Admin Features
1. Create controller in `server/controllers/adminController.js`
2. Add route in `server/routes/adminRoutes.js`
3. Create frontend page in `client/src/pages/admin/`
4. Add to sidebar navigation in `AdminDashboardLayout.jsx`

---

## 📞 Support

For issues or questions:
1. Check server logs for errors
2. Verify environment variables
3. Ensure MongoDB is running
4. Check admin user exists in database

---

## 🎯 Next Steps

1. Run `node create-admin.js` to create admin user
2. Access admin panel at `/admin-portal-access`
3. Explore the dashboard
4. Start building additional admin pages as needed
5. When ready for production, enable OTP verification
