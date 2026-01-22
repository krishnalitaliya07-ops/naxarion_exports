const nodemailer = require('nodemailer');
const { verificationEmailTemplate } = require('../mails/templates/verificationEmail');
const { passwordResetEmailTemplate } = require('../mails/templates/passwordResetEmail');
const { welcomeEmailTemplate } = require('../mails/templates/welcomeEmail');

// Create nodemailer transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// Send verification code email
exports.sendVerificationEmail = async (email, name, code) => {
  // Log OTP in console for development
  if (process.env.NODE_ENV === 'development') {
    console.log('\n========================================');
    console.log('📧 VERIFICATION EMAIL');
    console.log('========================================');
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`🔐 Verification Code: ${code}`);
    console.log(`⏰ Expires in: 10 minutes`);
    console.log('========================================\n');
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"Nexarion Global Exports" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Email Verification Code - Nexarion',
    html: verificationEmailTemplate(name, code)
  };

  await transporter.sendMail(mailOptions);
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, name, resetLink) => {
  // Log reset link in console for development
  if (process.env.NODE_ENV === 'development') {
    console.log('\n========================================');
    console.log('🔐 PASSWORD RESET EMAIL');
    console.log('========================================');
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`🔗 Reset Link: ${resetLink}`);
    console.log(`⏰ Expires in: 30 minutes`);
    console.log('========================================\n');
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"Nexarion Global Exports" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request - Nexarion',
    html: passwordResetEmailTemplate(name, resetLink)
  };

  await transporter.sendMail(mailOptions);
};

// Send welcome email after successful verification
exports.sendWelcomeEmail = async (email, name, role) => {
  // Log welcome email in console for development
  if (process.env.NODE_ENV === 'development') {
    console.log('\n========================================');
    console.log('🎉 WELCOME EMAIL');
    console.log('========================================');
    console.log(`To: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Role: ${role}`);
    console.log('========================================\n');
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"Nexarion Global Exports" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Nexarion Global Exports! 🎉',
    html: welcomeEmailTemplate(name, role)
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    // Don't throw error for welcome email, just log it
    console.log('Welcome email failed (non-critical):', error.message);
  }
};
