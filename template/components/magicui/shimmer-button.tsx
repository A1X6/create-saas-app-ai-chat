import React, { ComponentPropsWithoutRef, CSSProperties } from "react"

import { cn } from "@/lib/utils"

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor,
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            ...(shimmerColor && { "--shimmer-color": shimmerColor }),
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            ...(background && { "--bg": background }),
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden [border-radius:var(--radius)] border border-border px-6 py-3 whitespace-nowrap",
          background ? "text-white [background:var(--bg)]" : "bg-primary text-primary-foreground",
          shimmerColor && "[--shimmer-color:var(--shimmer-color)]",
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "[container-type:size] absolute inset-0 overflow-visible"
          )}
        >
          {/* spark */}
          <div className="animate-shimmer-slide absolute inset-0 [aspect-ratio:1] h-[100cqh] [border-radius:0] [mask:none]">
            {/* spark before */}
            <div
              className="animate-spin-around absolute -inset-full w-auto [translate:0_0] rotate-0"
              style={{
                background: shimmerColor
                  ? `conic-gradient(from calc(270deg-(var(--spread)*0.5)),transparent 0,var(--shimmer-color) var(--spread),transparent var(--spread))`
                  : `conic-gradient(from calc(270deg-(var(--spread)*0.5)),transparent 0,hsl(var(--primary)) var(--spread),transparent var(--spread))`
              }}
            />
          </div>
        </div>
        {children}

        {/* Highlight */}
        <div
          className={cn(
            "absolute inset-0 size-full",

            "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_hsl(var(--foreground)/0.1)]",

            // transition
            "transform-gpu transition-all duration-300 ease-in-out",

            // on hover
            "group-hover:shadow-[inset_0_-6px_10px_hsl(var(--foreground)/0.2)]",

            // on click
            "group-active:shadow-[inset_0_-10px_10px_hsl(var(--foreground)/0.2)]"
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            "absolute [inset:var(--cut)] -z-20 [border-radius:var(--radius)]",
            background ? "[background:var(--bg)]" : "bg-primary"
          )}
        />
      </button>
    )
  }
)

ShimmerButton.displayName = "ShimmerButton"
