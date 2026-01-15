import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

export interface OrderEmailData {
  orderId: string;
  userEmail: string;
  userName: string;
  files: Array<{
    originalName: string;
    pages: number;
  }>;
  options: {
    size: string;
    isColor: boolean;
    isDuplex: boolean;
    quantity: number;
  };
  totalPrice: number;
  pickupDate?: string; // Formatted date string
  pickupTime?: string; // Time in HH:mm format
  comment?: string;
}

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    // Check if email credentials are configured
    const isConfigured =
      process.env.GMAIL_USER &&
      process.env.GMAIL_APP_PASSWORD &&
      process.env.GMAIL_USER !== 'test@gmail.com' &&
      process.env.GMAIL_APP_PASSWORD !== 'test-password-placeholder';

    if (!isConfigured) {
      this.logger.warn(
        '⚠️  Email not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env to enable email notifications.',
      );
      this.logger.warn(
        '   Orders will be created successfully, but confirmation emails will not be sent.',
      );
    }

    // Configure Gmail SMTP transporter
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // TLS
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Verify connection configuration (only if credentials are set)
    if (isConfigured) {
      this.transporter.verify((error) => {
        if (error) {
          this.logger.error(
            '❌ Error configuring email transporter:',
            error.message,
          );
          this.logger.warn(
            '   Orders will be created, but emails will not be sent.',
          );
        } else {
          this.logger.log('✅ Email transporter configured successfully');
        }
      });
    }
  }

  async sendOrderConfirmation(orderData: OrderEmailData): Promise<void> {
    try {
      // Check if email is configured
      const isConfigured =
        process.env.GMAIL_USER &&
        process.env.GMAIL_APP_PASSWORD &&
        process.env.GMAIL_USER !== 'test@gmail.com' &&
        process.env.GMAIL_APP_PASSWORD !== 'test-password-placeholder';

      if (!isConfigured) {
        this.logger.log(
          `Order ${orderData.orderId} created. Email not sent (credentials not configured).`,
        );
        return;
      }

      // Register Handlebars helpers
      handlebars.registerHelper('gt', function (a, b) {
        return a > b;
      });

      // Read and compile the email template
      // Use absolute path from project root to ensure template is found
      const templatePath = path.join(
        process.cwd(),
        'src',
        'mail',
        'templates',
        'order-confirmation.hbs',
      );
      const templateSource = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateSource);

      // Generate HTML from template
      const html = template({
        orderId: orderData.orderId,
        userName: orderData.userName,
        files: orderData.files,
        options: orderData.options,
        totalPrice: orderData.totalPrice.toFixed(2),
        pickupDate: orderData.pickupDate,
        pickupTime: orderData.pickupTime,
        comment: orderData.comment,
        hasPickupInfo: orderData.pickupDate && orderData.pickupTime,
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
      });

      // Send email

      const info = await this.transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME || 'Gráfica System'}" <${process.env.MAIL_FROM_ADDRESS || process.env.GMAIL_USER}>`,
        to: orderData.userEmail,
        subject: `Confirmación de Pedido #${orderData.orderId.substring(0, 8)}`,
        html,
      });

      this.logger.log(`Order confirmation email sent: ${info.messageId}`);
    } catch (error) {
      this.logger.error('Failed to send order confirmation email:', error);
      // Don't throw - we don't want email failures to fail order creation
    }
  }
}
