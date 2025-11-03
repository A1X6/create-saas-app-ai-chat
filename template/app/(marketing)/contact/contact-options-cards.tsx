"use client";

import { Mail, MessageSquare, ArrowRight, Sparkles, LucideIcon } from "lucide-react";
import SpotlightCard from "@/components/SpotlightCard";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import content from "./contact-options-content.json";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Mail,
  MessageSquare,
};

// Map content to include icon components
const contactOptions = content.contactOptions.map((option) => ({
  ...option,
  icon: iconMap[option.icon],
}));

export function ContactOptionsCards() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <Badge variant="outline" className="px-4 py-2 bg-background/60 backdrop-blur-sm border-primary/20">
            <Sparkles className="w-4 h-4 mr-2 text-primary" />
            {content.badge.text}
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold">
            <TextAnimate
              animation="blurInUp"
              by="word"
              className="text-foreground"
            >
              {content.heading}
            </TextAnimate>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {content.subheading}
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {contactOptions.map((option, index) => (
            <BlurFade key={option.title} delay={0.1 + index * 0.1} inView>
              <SpotlightCard className="group cursor-pointer h-full transition-all duration-300 hover:scale-[1.02]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <option.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-primary font-semibold text-sm uppercase tracking-wide">
                      {content.contactLabel}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-card-foreground mb-3">
                    {option.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
                    {option.description}
                  </p>

                  {option.isEmail ? (
                    <a
                      href={option.href}
                      className="inline-flex items-center text-sm font-semibold text-primary transition-all"
                    >
                      {option.action}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  ) : option.href.startsWith("#") ? (
                    <button
                      onClick={() => {
                        const element = document.querySelector(option.href);
                        element?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="inline-flex items-center text-sm font-semibold text-primary transition-all"
                    >
                      {option.action}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <Link
                      href={option.href}
                      className="inline-flex items-center text-sm font-semibold text-primary transition-all"
                    >
                      {option.action}
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>
              </SpotlightCard>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
