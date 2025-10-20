import type { Metadata } from 'next';

// Static Site Generation for best performance
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read our terms of service to understand the rules and regulations for using our platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: 10/18/2025</p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Acceptance of Terms</h2>
            <p>
              By accessing and using this service, you accept and agree to be bound by the terms
              and provision of this agreement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Use of Service</h2>
            <p>You agree to use the service only for lawful purposes and in accordance with these Terms.</p>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Use the service in any way that violates any applicable law or regulation</li>
              <li>Engage in any conduct that restricts or inhibits anyone's use of the service</li>
              <li>Attempt to gain unauthorized access to any portion of the service</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Subscriptions and Payments</h2>
            <p>
              Some parts of the service are billed on a subscription basis. You will be billed in
              advance on a recurring and periodic basis (monthly or yearly).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the service immediately,
              without prior notice or liability, under our sole discretion, for any reason whatsoever.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
            <p>
              In no event shall we be liable for any indirect, incidental, special, consequential or
              punitive damages, including without limitation, loss of profits, data, use, goodwill,
              or other intangible losses.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Changes to Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time. We will provide
              notice of any changes by posting the new Terms on this page.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
