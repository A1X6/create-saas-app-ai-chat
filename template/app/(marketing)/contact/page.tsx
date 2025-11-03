import type { Metadata } from "next";
import { ContactHero } from "@/components/contact/contact-hero";
import { ContactOptionsCards } from "@/components/contact/contact-options-cards";
import { ContactFormSection } from "@/components/contact/contact-form-section";
import { FAQSection } from "@/components/contact/faq-section";
import { SocialSection } from "@/components/contact/social-section";
import { FinalCTA } from "@/components/contact/final-cta";

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: "Contact - {{APP_NAME}}",
  description: "Get in touch with our team. We're here to help you with any questions about AI prompt engineering and our platform. Contact us via email or form. We respond within 24 hours.",
  keywords: [
    'contact prompt consultant',
    'prompt engineering support',
    'AI support',
    'get help with prompts',
    'prompt consultant contact',
    'AI customer service',
    'prompt engineering questions'
  ],
  openGraph: {
    title: "Contact Us - {{APP_NAME}}",
    description: "Get in touch with our team. We're here to help with any questions about AI prompt engineering. We respond within 24 hours.",
    type: 'website',
    url: '/contact',
    images: [
      {
        url: '/og-contact.png',
        width: 1200,
        height: 630,
        alt: 'Contact {{APP_NAME}}',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Contact Us - {{APP_NAME}}",
    description: "Get in touch with our team. We respond within 24 hours.",
    images: ['/og-contact.png'],
  },
  alternates: {
    canonical: '/contact',
  },
};

// FAQ data for JSON-LD
const faqs = [
  {
    question: "What are your support hours?",
    answer:
      "Our support team is available Monday through Friday, 9 AM to 6 PM EST. We typically respond to all inquiries within 24 hours, though most responses come much sooner during business hours.",
  },
  {
    question: "How quickly will I get a response?",
    answer:
      "We aim to respond to all inquiries within 24 hours. During business hours, you can often expect a response within 2-4 hours. Urgent matters receive priority handling.",
  },
  {
    question: "Can I schedule a demo?",
    answer:
      "Absolutely! You can request a demo by selecting 'Sales' as your inquiry type in the contact form above, or by emailing us directly. Our team will work with you to schedule a convenient time.",
  },
  {
    question: "Do you offer enterprise support?",
    answer:
      "Yes, we offer dedicated enterprise support with priority response times, a dedicated account manager, and custom SLAs. Contact us to learn more about our enterprise plans.",
  },
  {
    question: "How do I submit a feature request?",
    answer:
      "We love hearing from our users! You can submit feature requests by selecting 'Other' in the inquiry type and describing your idea, or visit our community forum where you can also vote on existing requests.",
  },
  {
    question: "Where can I find documentation?",
    answer:
      "Our comprehensive documentation is available in the Help Center. You can also explore our Features page for detailed information about {{APP_NAME}}'s capabilities.",
  },
];

export default function ContactPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  // BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact',
        item: `${baseUrl}/contact`,
      },
    ],
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="relative min-h-screen">
        {/* Hero Section */}
        <ContactHero />

        {/* Contact Options Cards */}
        <ContactOptionsCards />

        {/* Contact Form Section with Info Panel */}
        <ContactFormSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* Social Media */}
        <SocialSection />

        {/* Final CTA */}
        <FinalCTA />
      </div>
    </>
  );
}
