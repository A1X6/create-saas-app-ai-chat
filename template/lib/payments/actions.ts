'use server';

import { redirect } from 'next/navigation';
import { createCheckoutSession, createCustomerPortalSession } from './stripe';
import { getUser } from '@/lib/db/queries';

export async function checkoutAction(formData: FormData) {
  const user = await getUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  const priceId = formData.get('priceId') as string;
  await createCheckoutSession({ priceId });
}

export async function customerPortalAction() {
  const user = await getUser();

  if (!user) {
    redirect('/auth/sign-in');
  }

  const portalSession = await createCustomerPortalSession();
  redirect(portalSession.url);
}
