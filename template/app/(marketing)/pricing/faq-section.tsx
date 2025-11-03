'use client';

import { BlurFade } from '@/components/ui/blur-fade';
import { TextAnimate } from '@/components/magicui/text-animate';
import { Badge } from '@/components/ui/badge';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

// TODO: Customize these FAQs based on your actual pricing and policies
const faqs = [
  {
    question: "Can I change plans later?",
    answer: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference immediately. When downgrading, the change will take effect at the end of your current billing period, and you'll receive a prorated credit for future billing."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover) through our secure payment processor, Stripe. For Enterprise plans, we also offer invoice billing with NET 30 terms."
  },
  {
    question: "Do you offer refunds?",
    answer: "Yes, we offer a 30-day money-back guarantee on all plans. If you're not satisfied with our service within the first 30 days, contact us for a full refund. No questions asked. After 30 days, refunds are handled on a case-by-case basis."
  },
  {
    question: "What happens when I exceed my plan limits?",
    answer: "If you exceed your plan's token limit, you'll receive an email notification. You can either upgrade to a higher plan or purchase additional credits. Your service won't be interrupted, but you may be prompted to upgrade before continuing to use paid AI models."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! All plans include a free trial period. Monthly plans get a 7-day trial, while yearly plans receive a 14-day trial. A credit card is required to start your trial, and you'll have full access to all features during the trial period."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, you can cancel your subscription at any time with no cancellation fees. Your access will continue until the end of your current billing period. You can manage your subscription directly from your account dashboard or contact our support team."
  },
  {
    question: "Do you offer educational or non-profit discounts?",
    answer: "Yes! We offer a 30% discount for verified educational institutions and non-profit organizations. Contact our sales team with proof of your status (edu email, 501(c)(3) documentation, etc.) to request a discount code."
  },
  {
    question: "What's included in support?",
    answer: "All plans include email support with a 24-hour response time. Professional and Enterprise plans get priority support (4-hour response), access to our knowledge base, and live chat. Enterprise customers also receive a dedicated account manager and custom onboarding assistance."
  },
  {
    question: "Are there any setup fees or hidden charges?",
    answer: "No. We believe in transparent pricing. The price you see is what you pay. There are no setup fees, hidden charges, or surprise costs. Additional AI credits can be purchased at any time if you exceed your plan's allocation."
  },
  {
    question: "Can I get a custom plan for my organization?",
    answer: "Yes! We work with organizations that need custom solutions. Enterprise plans can be tailored to your specific needs, including custom AI credit allocations, dedicated infrastructure, custom integrations, and more. Contact our sales team to discuss your requirements."
  },
];

export function FAQSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="px-4 py-2 bg-background/60 backdrop-blur-sm border-primary/20">
              FAQs
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              <TextAnimate
                animation="blurInUp"
                by="word"
                className="text-foreground"
              >
                Frequently Asked Questions
              </TextAnimate>
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about our pricing and plans
            </p>
          </div>

          {/* FAQ Accordions */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <BlurFade key={index} delay={0.1 + index * 0.05}>
                <Collapsible className="group">
                  <div className="bg-card/60 backdrop-blur-sm border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-colors">
                    <CollapsibleTrigger className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-accent/10 transition-colors">
                      <span className="font-semibold text-lg pr-4">{faq.question}</span>
                      <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 shrink-0" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-6 pb-5">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              </BlurFade>
            ))}
          </div>

          {/* Additional Help */}
          <BlurFade delay={0.7}>
            <div className="mt-12 text-center p-8 rounded-xl bg-card/60 backdrop-blur-sm border border-border">
              <h3 className="text-2xl font-bold mb-3">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Contact Support
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border text-card-foreground rounded-lg font-semibold hover:bg-accent transition-colors"
                >
                  Schedule a Demo
                </a>
              </div>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
