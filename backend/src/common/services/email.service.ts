import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = this.newTransport();
  }

  //sendgrid

  // private newTransport(): nodemailer.Transporter {
  //   return nodemailer.createTransport({
  //     host: 'smtp.sendgrid.net',
  //     port: 587,
  //     auth: {
  //       user: 'apikey',
  //       pass: process.env.SENDGRID_API_KEY,
  //     },
  //   });
  // }

  private newTransport(): nodemailer.Transporter {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: +process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || 'tripupnow2@gmail.com',
        pass: process.env.EMAIL_PASS || '',
      },
    });
  }

  async send(subject: string, to: string, html: string, text: string) {
    const mailOptions = {
      from: `TripUpNow <${process.env.SENDER_EMAIL}>`,
      to,
      subject,
      html,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendWelcome(user, randomPassword, companyName) {
    const message = `Hi ${user.name},
      
      Please refer to the login credentials

      email: ${user.email}
      Password: ${randomPassword}

      Please log in and update the password for more security



      Thanks!`;

    await this.send(`Welcome to ${companyName}`, user.email, null, message);
  }

  async sendPasswordReset(user, otp, resetUrl) {
    const message = `Forgot your password? 

    Please follow the link below to reset your password

    ${resetUrl}

    Your OTP: ${otp}

    If you didn't request a password reset, please ignore this email.`;

    await this.send('Reset Password', user.email, null, message);
  }

async requestPasswordReset(email, otp) {
  const message = `
Hi ${'there'},

We received a request to reset the password for your TripUpNow account.

🔒 One-Time Password (OTP): **${otp}**

Please use this OTP to verify your identity and proceed with resetting your password.

If you did not request this, please ignore this message — your account remains secure.

Regards,  
The TripUpNow Team
`;

  await this.send('TripUpNow Password Reset Request', email, null, message);
}


  generateResetUrl(token: string): string {
    // Replace '' with your actual application's base URL
    const baseUrl = '';
    const resetPath = '/reset-password/' + token;

    return baseUrl + resetPath;
  }

  //   generateResetUrl(token: string): string {
  //     // Replace 'http://your-app-base-url' with your actual application's base URL
  //     const baseUrl = 'http://your-app-base-url';
  //     const resetPath = `/reset-password/${token}`;

  //     // Use the 'url.resolve' method to construct the URL
  //     const resetUrl = url.resolve(baseUrl, resetPath);

  //     return resetUrl;
  //   }

  generateOTP() {
    // Generate a random 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generateResetToken(): string {
    // Implement token generation logic here
    // You can use a library like `crypto` to generate a random token
    const crypto = require('crypto');
    const token = crypto.randomBytes(32).toString('hex'); // Generate a 64-character hexadecimal token

    return token;
  }
}
