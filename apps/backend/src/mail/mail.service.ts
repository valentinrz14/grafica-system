import { Injectable, Logger } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
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
  private isConfigured = false;

  constructor() {
    // Check if SendGrid API key is configured
    const apiKey = process.env.SENDGRID_API_KEY;

    if (!apiKey || apiKey === 'your-sendgrid-api-key-here') {
      this.logger.warn(
        '⚠️  Email not configured. Set SENDGRID_API_KEY in .env to enable email notifications.',
      );
      this.logger.warn(
        '   Orders will be created successfully, but confirmation emails will not be sent.',
      );
      this.isConfigured = false;
      return;
    }

    try {
      // Initialize SendGrid
      sgMail.setApiKey(apiKey);
      this.isConfigured = true;
      this.logger.log('✅ SendGrid email service configured successfully');
    } catch (error) {
      this.logger.error('❌ Error initializing SendGrid:', error);
      this.logger.warn(
        '   Orders will be created, but emails will not be sent.',
      );
      this.isConfigured = false;
    }
  }

  async sendOrderConfirmation(orderData: OrderEmailData): Promise<void> {
    try {
      // Check if email service is configured
      if (!this.isConfigured) {
        this.logger.log(
          `Order ${orderData.orderId} created. Email not sent (SendGrid not configured).`,
        );
        return;
      }

      // Register Handlebars helpers
      handlebars.registerHelper('gt', function (a, b) {
        return a > b;
      });

      // Read and compile the email template
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

      // Send email via SendGrid
      const fromEmail = process.env.MAIL_FROM_ADDRESS || 'noreply@example.com';
      const fromName = process.env.MAIL_FROM_NAME || 'Gráfica System';

      const msg = {
        to: orderData.userEmail,
        from: {
          email: fromEmail,
          name: fromName,
        },
        subject: `Confirmación de Pedido #${orderData.orderId.substring(0, 8)}`,
        html,
      };

      await sgMail.send(msg);

      this.logger.log(
        `✅ Order confirmation email sent successfully to ${orderData.userEmail}`,
      );
    } catch (error) {
      this.logger.error('Failed to send order confirmation email:', error);
      // Don't throw - we don't want email failures to fail order creation
    }
  }
}
