import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get('session_id');
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  if (!sessionId) {
    return NextResponse.redirect(`${baseUrl}/pricing`);
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Handle successful checkout (paid or trial)
    if (session.payment_status === 'paid' || session.payment_status === 'no_payment_required') {
      return NextResponse.redirect(`${baseUrl}/dashboard?checkout=success`);
    }
    // Handle unpaid subscriptions (trial period active)
    else if (session.status === 'complete' && session.mode === 'subscription') {
      return NextResponse.redirect(`${baseUrl}/dashboard?checkout=success`);
    }
    // Handle cancelled/failed payments
    else {
      return NextResponse.redirect(`${baseUrl}/pricing?checkout=cancelled`);
    }
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.redirect(`${baseUrl}/pricing`);
  }
}
