import { Injectable, Logger } from '@nestjs/common';
import Mailgun from 'mailgun.js';
import formData from 'form-data';
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
  private mailgunClient: any = null;
  private mailgunDomain: string | null = null;
  private isConfigured = false;

  constructor() {
    // Check if Mailgun is configured
    const apiKey = process.env.MAILGUN_API_KEY;
    const domain = process.env.MAILGUN_DOMAIN;

    if (!apiKey || apiKey === 'your-mailgun-api-key-here') {
      this.logger.warn(
        '⚠️  Email not configured. Set MAILGUN_API_KEY in .env to enable email notifications.',
      );
      this.logger.warn(
        '   Orders will be created successfully, but confirmation emails will not be sent.',
      );
      this.isConfigured = false;
      return;
    }

    if (!domain || domain === 'sandbox-xxx.mailgun.org') {
      this.logger.warn(
        '⚠️  Email not configured. Set MAILGUN_DOMAIN in .env to enable email notifications.',
      );
      this.logger.warn(
        '   Orders will be created successfully, but confirmation emails will not be sent.',
      );
      this.isConfigured = false;
      return;
    }

    try {
      // Initialize Mailgun client
      const mailgun = new Mailgun(formData);
      this.mailgunClient = mailgun.client({
        username: 'api',
        key: apiKey,
        url: 'https://api.mailgun.net', // Use https://api.eu.mailgun.net for EU region
      });
      this.mailgunDomain = domain;
      this.isConfigured = true;
      this.logger.log('✅ Mailgun email service configured successfully');
    } catch (error) {
      this.logger.error('❌ Error initializing Mailgun:', error);
      this.logger.warn(
        '   Orders will be created, but emails will not be sent.',
      );
      this.isConfigured = false;
    }
  }

  async sendOrderConfirmation(orderData: OrderEmailData): Promise<void> {
    try {
      // Check if email service is configured
      if (!this.isConfigured || !this.mailgunClient || !this.mailgunDomain) {
        this.logger.log(
          `Order ${orderData.orderId} created. Email not sent (Mailgun not configured).`,
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

      // Send email via Mailgun
      const fromEmail =
        process.env.MAIL_FROM_ADDRESS || `noreply@${this.mailgunDomain}`;
      const fromName = process.env.MAIL_FROM_NAME || 'Gráfica System';

      const result = await this.mailgunClient.messages.create(
        this.mailgunDomain,
        {
          from: `${fromName} <${fromEmail}>`,
          to: [orderData.userEmail],
          subject: `Confirmación de Pedido #${orderData.orderId.substring(0, 8)}`,
          html,
        },
      );

      this.logger.log(
        `✅ Order confirmation email sent successfully (ID: ${result.id})`,
      );
    } catch (error) {
      this.logger.error('Failed to send order confirmation email:', error);
      // Don't throw - we don't want email failures to fail order creation
    }
  }
}
