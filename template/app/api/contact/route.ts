import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  company: z.string().max(100).optional(),
  inquiryType: z.enum(['general', 'support', 'sales', 'partnership', 'press', 'other']),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

// Generate a simple ticket ID
function generateTicketId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `PC-${timestamp}-${random}`.toUpperCase();
}

// Get inquiry type badge color
function getInquiryTypeColor(type: string): string {
  const colors: Record<string, string> = {
    general: '#3b82f6',
    support: '#ef4444',
    sales: '#10b981',
    partnership: '#8b5cf6',
    press: '#f59e0b',
    other: '#6b7280',
  };
  return colors[type] || colors.other;
}

// Get inquiry type label
function getInquiryTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    general: 'General Inquiry',
    support: 'Customer Support',
    sales: 'Sales',
    partnership: 'Partnership Opportunity',
    press: 'Press & Media',
    other: 'Other',
  };
  return labels[type] || 'Other';
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service is not configured' },
        { status: 500 }
      );
    }

    const ticketId = generateTicketId();
    const inquiryColor = getInquiryTypeColor(validatedData.inquiryType);
    const inquiryLabel = getInquiryTypeLabel(validatedData.inquiryType);

    // Send admin notification email
    const adminEmail = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.RESEND_TO_EMAIL || 'support@example.com',
      replyTo: validatedData.email,
      subject: `[${inquiryLabel}] New Contact Form: ${ticketId}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Submission</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background-color: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">New Contact Form Submission</h1>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 14px;">Ticket ID: ${ticketId}</p>
              </div>

              <!-- Inquiry Type Badge -->
              <div style="margin-bottom: 24px;">
                <span style="background-color: ${inquiryColor}; color: white; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                  ${inquiryLabel}
                </span>
              </div>

              <!-- Contact Details -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <h2 style="color: #1f2937; font-size: 16px; margin: 0 0 16px 0; font-weight: 600;">Contact Information</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #6b7280; width: 120px;">Name:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${validatedData.name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Email:</td>
                    <td style="padding: 8px 0;">
                      <a href="mailto:${validatedData.email}" style="color: #6366f1; text-decoration: none; font-weight: 500;">${validatedData.email}</a>
                    </td>
                  </tr>
                  ${
                    validatedData.company
                      ? `<tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Company:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${validatedData.company}</td>
                  </tr>`
                      : ''
                  }
                  <tr>
                    <td style="padding: 8px 0; font-weight: 600; color: #6b7280;">Inquiry Type:</td>
                    <td style="padding: 8px 0; color: #1f2937;">${inquiryLabel}</td>
                  </tr>
                </table>
              </div>

              <!-- Message -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h2 style="color: #1f2937; font-size: 16px; margin: 0 0 12px 0; font-weight: 600;">Message</h2>
                <p style="color: #1f2937; white-space: pre-wrap; margin: 0; line-height: 1.6;">${validatedData.message}</p>
              </div>

              <!-- Quick Actions -->
              <div style="background-color: #eff6ff; border-left: 4px solid #6366f1; border-radius: 4px; padding: 16px; margin-bottom: 24px;">
                <p style="margin: 0; color: #1f2937; font-size: 14px;">
                  <strong>💡 Suggested Response Time:</strong>
                  ${validatedData.inquiryType === 'support' ? '2-4 hours' : '24 hours'}
                </p>
              </div>

              <!-- Footer -->
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                <p style="color: #6b7280; font-size: 12px; margin: 0;">
                  This email was sent from the {{APP_NAME}} contact form.<br>
                  Received at ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
New Contact Form Submission
Ticket ID: ${ticketId}

Inquiry Type: ${inquiryLabel}

Contact Information:
Name: ${validatedData.name}
Email: ${validatedData.email}
${validatedData.company ? `Company: ${validatedData.company}` : ''}

Message:
${validatedData.message}

---
This email was sent from the {{APP_NAME}} contact form.
Received at ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST
      `,
    });

    // Send user confirmation email
    const userEmail = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: validatedData.email,
      subject: `We received your message - ${ticketId}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank You for Contacting Us</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
            <div style="background-color: white; border-radius: 12px; padding: 32px; box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 8px; padding: 24px; margin-bottom: 24px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Thank You!</h1>
                <p style="color: rgba(255, 255, 255, 0.9); margin: 12px 0 0 0; font-size: 16px;">We've received your message</p>
              </div>

              <!-- Greeting -->
              <p style="font-size: 16px; color: #1f2937; margin-bottom: 20px;">
                Hi ${validatedData.name},
              </p>

              <p style="font-size: 16px; color: #1f2937; margin-bottom: 24px; line-height: 1.7;">
                Thank you for reaching out to {{APP_NAME}}. We've received your <strong>${inquiryLabel.toLowerCase()}</strong> and our team will review it shortly.
              </p>

              <!-- Reference Number -->
              <div style="background-color: #eff6ff; border-radius: 8px; padding: 20px; margin-bottom: 24px; text-align: center;">
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Reference Number</p>
                <p style="margin: 0; color: #1f2937; font-size: 20px; font-weight: 700; font-family: monospace;">${ticketId}</p>
              </div>

              <!-- What's Next -->
              <div style="margin-bottom: 24px;">
                <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 16px 0; font-weight: 600;">What happens next?</h2>

                <div style="display: flex; align-items: start; margin-bottom: 16px;">
                  <div style="background-color: #6366f1; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; margin-right: 12px; flex-shrink: 0;">1</div>
                  <div>
                    <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #1f2937;">We review your message</h3>
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">A team member will be assigned to your inquiry</p>
                  </div>
                </div>

                <div style="display: flex; align-items: start; margin-bottom: 16px;">
                  <div style="background-color: #6366f1; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; margin-right: 12px; flex-shrink: 0;">2</div>
                  <div>
                    <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #1f2937;">We prepare a response</h3>
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">Our specialist will craft a personalized reply</p>
                  </div>
                </div>

                <div style="display: flex; align-items: start;">
                  <div style="background-color: #6366f1; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; margin-right: 12px; flex-shrink: 0;">3</div>
                  <div>
                    <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #1f2937;">You'll hear from us within 24 hours</h3>
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">Most responses come much sooner during business hours</p>
                  </div>
                </div>
              </div>

              <!-- Help Resources -->
              <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #1f2937;">While you wait...</h3>
                <p style="margin: 0 0 12px 0; font-size: 14px; color: #6b7280;">Check out these helpful resources:</p>
                <ul style="margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;"><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'}/features" style="color: #6366f1; text-decoration: none;">Help Center & Documentation</a></li>
                  <li style="margin-bottom: 8px;"><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'}/pricing" style="color: #6366f1; text-decoration: none;">View Our Pricing Plans</a></li>
                  <li><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'}/features" style="color: #6366f1; text-decoration: none;">Explore Features</a></li>
                </ul>
              </div>

              <!-- Footer -->
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                <p style="color: #6b7280; font-size: 14px; margin: 0 0 12px 0;">
                  Best regards,<br>
                  <strong style="color: #1f2937;">The {{APP_NAME}} Team</strong>
                </p>
                <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                  This is an automated confirmation. Please do not reply to this email.<br>
                  For urgent matters, please contact us at ${process.env.RESEND_TO_EMAIL || 'support@example.com'}
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
Hi ${validatedData.name},

Thank you for reaching out to {{APP_NAME}}. We've received your ${inquiryLabel.toLowerCase()} and our team will review it shortly.

Reference Number: ${ticketId}

What happens next?
1. We review your message - A team member will be assigned to your inquiry
2. We prepare a response - Our specialist will craft a personalized reply
3. You'll hear from us within 24 hours - Most responses come much sooner during business hours

While you wait, check out these helpful resources:
- Help Center & Documentation: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'}/features
- View Our Pricing Plans: ${process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com'}/pricing

Best regards,
The {{APP_NAME}} Team

---
This is an automated confirmation. Please do not reply to this email.
For urgent matters, please contact us at ${process.env.RESEND_TO_EMAIL || 'support@example.com'}
      `,
    });

    if (adminEmail.error || userEmail.error) {
      console.error('Resend error:', adminEmail.error || userEmail.error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        ticketId,
        adminMessageId: adminEmail.data?.id,
        userMessageId: userEmail.data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid form data', details: error.errors },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
