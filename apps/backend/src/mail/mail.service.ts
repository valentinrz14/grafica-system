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

    // Verify connection configuration
    this.transporter.verify((error) => {
      if (error) {
        this.logger.error('Error configuring email transporter:', error);
      } else {
        this.logger.log('Email transporter configured successfully');
      }
    });
  }

  async sendOrderConfirmation(orderData: OrderEmailData): Promise<void> {
    try {
      // Read and compile the email template
      const templatePath = path.join(
        __dirname,
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const info = await this.transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME || 'Gráfica System'}" <${process.env.MAIL_FROM_ADDRESS || process.env.GMAIL_USER}>`,
        to: orderData.userEmail,
        subject: `Confirmación de Pedido #${orderData.orderId.substring(0, 8)}`,
        html,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.log(`Order confirmation email sent: ${info.messageId}`);
    } catch (error) {
      this.logger.error('Failed to send order confirmation email:', error);
      // Don't throw - we don't want email failures to fail order creation
    }
  }
}
