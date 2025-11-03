"use client";

import { Twitter, Linkedin, Github, MessageCircle, Share2 } from "lucide-react";
import SpotlightCard from "@/components/home/SpotlightCard";
import { BlurFade } from "@/components/ui/blur-fade";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Badge } from "@/components/ui/badge";

// Update these with your actual social media links
const socialLinks = [
  {
    icon: Twitter,
    name: "Twitter/X",
    href: "https://twitter.com",
    color: "hover:text-blue-400",
  },
  {
    icon: Linkedin,
    name: "LinkedIn",
    href: "https://linkedin.com",
    color: "hover:text-blue-600",
  },
  {
    icon: Github,
    name: "GitHub",
    href: "https://github.com",
    color: "hover:text-purple-500",
  },
  {
    icon: MessageCircle,
    name: "Discord",
    href: "#",
    color: "hover:text-indigo-500",
  },
];

export function SocialSection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <Badge
              variant="outline"
              className="px-4 py-2 bg-background/60 backdrop-blur-sm border-primary/20"
            >
              <Share2 className="w-4 h-4 mr-2 text-primary" />
              Connect With Us
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              <TextAnimate
                animation="blurInUp"
                by="word"
                className="text-foreground"
              >
                Follow Our Journey
              </TextAnimate>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay connected through our social media channels
            </p>
          </div>

          {/* Social Media Links */}
          <BlurFade delay={0.1} inView>
            <SpotlightCard className="p-8">
              <div className="flex items-center gap-3 mb-6 justify-center">
                <h3 className="text-2xl font-bold">Connect With Us</h3>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border-primary/20"
                >
                  Remote-First
                </Badge>
              </div>
              <p className="text-muted-foreground mb-8 text-center">
                Follow us on social media for updates, tips, and community
                discussions
              </p>

              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-4 rounded-lg border border-border bg-background/50 transition-all hover:scale-105 hover:border-primary/50 ${link.color}`}
                  >
                    <link.icon className="h-6 w-6" />
                    <span className="font-semibold text-sm">{link.name}</span>
                  </a>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="text-sm text-muted-foreground">
                  <strong>Remote-first company</strong> serving clients
                  worldwide
                </p>
              </div>
            </SpotlightCard>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
