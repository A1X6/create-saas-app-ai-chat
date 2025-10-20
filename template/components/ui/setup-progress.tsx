"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

const SETUP_STEPS = [
  { id: "environment", name: "Environment", href: "/setup/environment" },
  { id: "database", name: "Database", href: "/setup/database" },
  { id: "prompts", name: "Prompts", href: "/setup/prompts" },
  { id: "stripe", name: "Stripe", href: "/setup/stripe" },
  { id: "finalize", name: "Finalize", href: "/setup/finalize" },
];

export function SetupProgress() {
  const pathname = usePathname();
  const currentStepId = pathname.split("/").pop() || SETUP_STEPS[0].id;
  const currentIndex = SETUP_STEPS.findIndex(
    (step) => step.id === currentStepId
  );

  return (
    <div className="mb-8">
      <Breadcrumb>
        <BreadcrumbList className="flex-wrap justify-center">
          {SETUP_STEPS.map((step, index) => {
            const isComplete = index < currentIndex;
            const isCurrent = step.id === currentStepId;

            return (
              <div key={step.id} className="flex items-center">
                <BreadcrumbItem>
                  <BreadcrumbLink
                    asChild
                    className={cn(
                      "flex items-center gap-2",
                      isCurrent && "text-primary font-semibold"
                    )}
                  >
                    <Link href={step.href}>
                      {isComplete ? (
                        <CheckCircle2 className="size-4 text-primary" />
                      ) : (
                        <Circle
                          className={cn(
                            "size-4",
                            isCurrent ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                      )}
                      <span>{step.name}</span>
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index < SETUP_STEPS.length - 1 && <BreadcrumbSeparator />}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
