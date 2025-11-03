"use client";

import { BlurFade } from "@/components/ui/blur-fade";
import { TextAnimate } from "@/components/magicui/text-animate";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MagicCard } from "@/components/ui/magic-card";
import {
  Target,
  Eye,
  Lightbulb,
  Users,
  Award,
  Heart,
  Zap,
  Shield,
} from "lucide-react";
import content from "./mission-vision-values-content.json";

export function MissionVisionValues() {
  // Icon mapping
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Lightbulb,
    Users,
    Award,
    Heart,
    Zap,
    Shield,
  };

  const values = content.values.items.map((value) => ({
    ...value,
    icon: iconMap[value.icon],
  }));

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <Badge
              variant="outline"
              className="px-4 py-2 bg-background/60 backdrop-blur-sm border-primary/20"
            >
              {content.sectionBadge}
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              <TextAnimate
                animation="blurInUp"
                by="word"
                className="text-foreground"
              >
                {content.sectionHeading}
              </TextAnimate>
            </h2>
          </div>

          {/* Mission & Vision Tabs */}
          <BlurFade delay={0.2}>
            <Tabs defaultValue="mission" className="mb-16">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                <TabsTrigger
                  value="mission"
                  className="flex items-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  {content.tabs.mission.label}
                </TabsTrigger>
                <TabsTrigger value="vision" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {content.tabs.vision.label}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="mission">
                <div className="p-8 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                  <div className="max-w-3xl mx-auto space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Target className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">
                        {content.tabs.mission.title}
                      </h3>
                    </div>
                    {content.tabs.mission.paragraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-lg text-muted-foreground leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vision">
                <div className="p-8 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                  <div className="max-w-3xl mx-auto space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Eye className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">
                        {content.tabs.vision.title}
                      </h3>
                    </div>
                    {content.tabs.vision.paragraphs.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-lg text-muted-foreground leading-relaxed"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </BlurFade>

          {/* Core Values */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">
                {content.values.sectionTitle}
              </h3>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                {content.values.sectionDescription}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((value, index) => (
                <BlurFade key={index} delay={0.2 + index * 0.1}>
                  <MagicCard className="h-full cursor-pointer group">
                    <div className="p-6 space-y-4">
                      {/* Icon */}
                      <div className="p-3 rounded-xl bg-primary/10 w-fit group-hover:bg-primary/20 transition-colors">
                        <value.icon className="h-6 w-6 text-primary" />
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <h4 className="text-xl font-semibold">{value.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  </MagicCard>
                </BlurFade>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
