import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
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
  private resend: Resend | null = null;
  private isConfigured = false;

  constructor() {
    // Check if Resend API key is configured
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey || apiKey === 'your-resend-api-key-here') {
      this.logger.warn(
        '⚠️  Email not configured. Set RESEND_API_KEY in .env to enable email notifications.',
      );
      this.logger.warn(
        '   Orders will be created successfully, but confirmation emails will not be sent.',
      );
      this.isConfigured = false;
      return;
    }

    try {
      // Initialize Resend client
      this.resend = new Resend(apiKey);
      this.isConfigured = true;
      this.logger.log('✅ Resend email service configured successfully');
    } catch (error) {
      this.logger.error('❌ Error initializing Resend:', error);
      this.logger.warn(
        '   Orders will be created, but emails will not be sent.',
      );
      this.isConfigured = false;
    }
  }

  async sendOrderConfirmation(orderData: OrderEmailData): Promise<void> {
    try {
      // Check if email service is configured
      if (!this.isConfigured || !this.resend) {
        this.logger.log(
          `Order ${orderData.orderId} created. Email not sent (Resend not configured).`,
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

      // Send email via Resend
      const fromEmail =
        process.env.MAIL_FROM_ADDRESS || 'onboarding@resend.dev';
      const fromName = process.env.MAIL_FROM_NAME || 'Gráfica System';

      const result = await this.resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: orderData.userEmail,
        subject: `Confirmación de Pedido #${orderData.orderId.substring(0, 8)}`,
        html,
      });

      if (result.error) {
        this.logger.error(
          'Failed to send order confirmation email:',
          result.error,
        );
      } else {
        this.logger.log(
          `✅ Order confirmation email sent successfully (ID: ${result.data?.id})`,
        );
      }
    } catch (error) {
      this.logger.error('Failed to send order confirmation email:', error);
      // Don't throw - we don't want email failures to fail order creation
    }
  }
}
