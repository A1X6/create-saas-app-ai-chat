'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { BlurFade } from '@/components/ui/blur-fade';
import content from './faq-content.json';

export function FAQSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <BlurFade delay={0.2}>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                {content.section.heading.split(' ').slice(0, -1).join(' ')} <span className="text-primary">{content.section.headingHighlight}</span>
              </h2>
            </BlurFade>
            <BlurFade delay={0.3}>
              <p className="text-xl text-muted-foreground">
                {content.section.description}
              </p>
            </BlurFade>
          </div>

          {/* FAQ Accordion */}
          <BlurFade delay={0.4}>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {content.faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border rounded-lg px-6 bg-card"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="font-semibold">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
