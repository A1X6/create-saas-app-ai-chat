"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, ChevronDown, HelpCircle } from "lucide-react";
import content from "./faq-content.json";

export function FAQSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <Badge variant="outline" className="px-4 py-2 bg-background/60 backdrop-blur-sm border-primary/20">
              <HelpCircle className="w-4 h-4 mr-2 text-primary" />
              {content.badge.text}
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              <TextAnimate
                animation="blurInUp"
                by="word"
                className="text-foreground"
              >
                {content.heading}
              </TextAnimate>
            </h2>
            <p className="text-xl text-muted-foreground">
              {content.subheading}
            </p>
          </div>

          {/* FAQ Collapsibles */}
          <div className="space-y-4">
            {content.faqs.map((faq, index) => (
              <BlurFade key={index} delay={0.1 + index * 0.05} inView>
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
          <BlurFade delay={0.5} inView>
            <div className="mt-12 text-center p-8 rounded-xl bg-card/60 backdrop-blur-sm border border-border">
              <h3 className="text-2xl font-bold mb-3">{content.additionalHelp.heading}</h3>
              <p className="text-muted-foreground mb-6">
                {content.additionalHelp.description}
              </p>
              <Link
                href="#contact-form"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .querySelector("#contact-form")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                {content.additionalHelp.buttonText}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
