"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SpotlightCard from "@/components/home/SpotlightCard";
import { toast } from "sonner";
import {
  Mail,
  MessageSquare,
  User,
  Building2,
  Loader2,
  CheckCircle2,
  Clock,
  Shield,
} from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import Link from "next/link";
import content from "./form-content.json";

const iconMap = {
  CheckCircle2,
  MessageSquare,
  Clock,
};

export function ContactFormSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeToComms, setAgreeToComms] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    inquiryType: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      toast.success("Message sent successfully!", {
        description: "We'll get back to you within 24 hours.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        inquiryType: "",
        message: "",
      });
      setAgreeToComms(false);
    } catch (error) {
      toast.error("Failed to send message", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      id="contact-form"
      className="container mx-auto px-4 sm:px-6 py-16 max-w-7xl"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form - Left Side (2/3) */}
        <div className="lg:col-span-2">
          <BlurFade delay={0.2} inView>
            <SpotlightCard className="p-8">
              <h2 className="text-3xl font-bold mb-2">Send Us a Message</h2>
              <p className="text-muted-foreground mb-8">
                Fill out the form below and we&apos;ll get back to you shortly.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="bg-background/50"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-primary" />
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={isSubmitting}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Company */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="company"
                      className="flex items-center gap-2"
                    >
                      <Building2 className="h-4 w-4 text-primary" />
                      Company Name
                    </Label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Acme Inc. (optional)"
                      value={formData.company}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="bg-background/50"
                    />
                  </div>

                  {/* Inquiry Type */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="inquiryType"
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4 text-primary" />
                      Inquiry Type <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.inquiryType}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, inquiryType: value }))
                      }
                      required
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue
                          placeholder={
                            content.form.fields.inquiryType.placeholder
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {content.inquiryTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">
                    Message <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us more about your inquiry..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={isSubmitting}
                    rows={6}
                    className="bg-background/50 resize-none"
                  />
                </div>

                {/* Agreement Checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="agree"
                    checked={agreeToComms}
                    onChange={(e) => setAgreeToComms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border"
                    disabled={isSubmitting}
                  />
                  <Label
                    htmlFor="agree"
                    className="text-sm text-muted-foreground cursor-pointer"
                  >
                    I agree to receive communications about my inquiry
                  </Label>
                </div>

                {/* Submit Button */}
                <div className="space-y-3">
                  <Button
                    type="submit"
                    disabled={isSubmitting || !agreeToComms}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                    <Shield className="h-3 w-3" />
                    We respect your privacy. See our{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </div>
              </form>
            </SpotlightCard>
          </BlurFade>
        </div>

        {/* Info Panel - Right Side (1/3) */}
        <div className="space-y-6">
          <BlurFade delay={0.3} inView>
            <SpotlightCard className="p-6">
              <h3 className="text-xl font-bold mb-4">What Happens Next?</h3>
              <div className="space-y-4">
                {content.nextSteps.map((step, index) => {
                  const Icon = iconMap[step.icon as keyof typeof iconMap];
                  return (
                    <div key={index} className="flex gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 h-fit shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">
                          {step.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </SpotlightCard>
          </BlurFade>

          <BlurFade delay={0.4} inView>
            <SpotlightCard className="p-6">
              <h3 className="text-xl font-bold mb-4">Alternative Contact</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-1">Email Direct</p>
                  <a
                    href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com"}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {process.env.NEXT_PUBLIC_SUPPORT_EMAIL ||
                      "support@example.com"}
                  </a>
                </div>
                <div>
                  <p className="text-sm font-medium mb-1">Business Hours</p>
                  <p className="text-sm text-muted-foreground">
                    Mon - Fri, 9AM - 6PM EST
                  </p>
                </div>
              </div>
            </SpotlightCard>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}
