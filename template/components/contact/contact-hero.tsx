import { Clock } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { Ripple } from "@/components/ui/ripple";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Badge } from "@/components/ui/badge";
import content from './hero-content.json';

export function ContactHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden py-24">
      {/* Ripple Background */}
      <Ripple
        mainCircleSize={210}
        mainCircleOpacity={0.24}
        numCircles={8}
      />

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <BlurFade delay={0.1}>
            <div className="flex justify-center">
              <Badge variant="outline" className="px-4 py-2 bg-background/60 backdrop-blur-sm border-primary/20">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                {content.badge.text}
              </Badge>
            </div>
          </BlurFade>

          {/* Main Heading */}
          <BlurFade delay={0.2}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
              <TextAnimate
                animation="blurInUp"
                by="word"
                className="text-foreground"
              >
                {content.heading}
              </TextAnimate>
            </h1>
          </BlurFade>

          {/* Subheadline */}
          <BlurFade delay={0.3}>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {content.description}
            </p>
          </BlurFade>
        </div>
      </div>
    </section>
  );
}
