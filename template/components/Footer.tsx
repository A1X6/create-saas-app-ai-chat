"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import content from "./Footer/content.json";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-transparent relative z-1000">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-semibold text-lg">{'{{APP_NAME}}'}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {'{{APP_DESCRIPTION}}'}
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">{content.sections.product.title}</h3>
            <ul className="space-y-2">
              {content.sections.product.links.map((link) => (
                <li key={link.href}>
                  <Button
                    asChild
                    variant="link"
                    className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">{content.sections.legal.title}</h3>
            <ul className="space-y-2">
              {content.sections.legal.links.map((link) => (
                <li key={link.href}>
                  <Button
                    asChild
                    variant="link"
                    className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">{content.sections.support.title}</h3>
            <ul className="space-y-2">
              {content.sections.support.links.map((link) => (
                <li key={link.href}>
                  <Button
                    asChild
                    variant="link"
                    className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {currentYear} {'{{APP_NAME}}'}. {content.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
