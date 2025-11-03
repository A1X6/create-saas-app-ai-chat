'use server';

import { sendContactEmail } from '@/lib/email/resend';
import { z } from 'zod';
import messages from './messages.json';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function submitContactForm(formData: FormData) {
  try {
    // Validate form data
    const validatedData = contactFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    });

    // Send email
    await sendContactEmail(validatedData);

    return {
      success: true,
      message: messages.contact.submit.success,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      };
    }

    console.error('Contact form error:', error);
    return {
      success: false,
      message: messages.contact.submit.errors.failed,
    };
  }
}
