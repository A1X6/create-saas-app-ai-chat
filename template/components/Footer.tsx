import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "About", href: "/about" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
    support: [
      { label: "Contact", href: "/contact" },
      { label: "Documentation", href: "/docs" },
    ],
  };

  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <GalleryVerticalEnd className="h-6 w-6" />
              <span className="font-semibold text-lg">SaaS App</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Production-ready SaaS starter template for building amazing applications.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Product</h3>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link.href}>
                  <Button asChild variant="link" className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground">
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Button asChild variant="link" className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground">
                    <Link href={link.href}>{link.label}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.href}>
                  <Button asChild variant="link" className="h-auto p-0 text-sm text-muted-foreground hover:text-foreground">
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
            © {currentYear} SaaS App. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm">
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                Twitter
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                GitHub
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
