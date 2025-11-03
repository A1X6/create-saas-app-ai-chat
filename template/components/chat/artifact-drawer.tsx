"use client";

import { useState } from "react";
import { Copy, Download, X, Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Response } from "@/components/ui/response";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ArtifactDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  artifact: {
    id: string;
    title: string;
    content: string;
    updatedAt: Date;
  } | null;
  mode?: "panel" | "drawer"; // New prop to determine layout mode
}

export function ArtifactDrawer({
  open,
  onOpenChange,
  artifact,
  mode = "drawer",
}: ArtifactDrawerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!artifact) return;

    try {
      await navigator.clipboard.writeText(artifact.content);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDownloadMarkdown = () => {
    if (!artifact) return;

    const blob = new Blob([artifact.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${artifact.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded as Markdown");
  };

  const handleDownloadPDF = async () => {
    if (!artifact) return;

    const loadingToast = toast.loading("Generating PDF...");

    try {
      const { jsPDF } = await import("jspdf");

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "letter",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 40;
      const maxWidth = pageWidth - margin * 2;
      let yPosition = margin;

      const checkPageBreak = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
      };

      // Add title
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      const titleLines = doc.splitTextToSize(artifact.title, maxWidth);
      titleLines.forEach((line: string) => {
        checkPageBreak(25);
        doc.text(line, margin, yPosition);
        yPosition += 25;
      });

      // Add line under title
      yPosition += 5;
      doc.setLineWidth(1);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 20;

      // Process content
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");

      const lines = artifact.content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.trim() === "") {
          yPosition += 6;
          continue;
        }

        if (line.startsWith("# ")) {
          checkPageBreak(30);
          doc.setFontSize(16);
          doc.setFont("helvetica", "bold");
          const text = line.substring(2);
          const wrappedLines = doc.splitTextToSize(text, maxWidth);
          wrappedLines.forEach((wrappedLine: string) => {
            doc.text(wrappedLine, margin, yPosition);
            yPosition += 22;
          });
          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          yPosition += 4;
        } else if (line.startsWith("## ")) {
          checkPageBreak(25);
          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          const text = line.substring(3);
          const wrappedLines = doc.splitTextToSize(text, maxWidth);
          wrappedLines.forEach((wrappedLine: string) => {
            doc.text(wrappedLine, margin, yPosition);
            yPosition += 20;
          });
          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          yPosition += 3;
        } else if (line.startsWith("### ")) {
          checkPageBreak(22);
          doc.setFontSize(12);
          doc.setFont("helvetica", "bold");
          const text = line.substring(4);
          const wrappedLines = doc.splitTextToSize(text, maxWidth);
          wrappedLines.forEach((wrappedLine: string) => {
            doc.text(wrappedLine, margin, yPosition);
            yPosition += 18;
          });
          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          yPosition += 2;
        } else if (
          line.trim().startsWith("- ") ||
          line.trim().startsWith("* ")
        ) {
          checkPageBreak(16);
          const indent = line.search(/[-*]/);
          const text = line.substring(line.indexOf(" ") + 1);
          const wrappedLines = doc.splitTextToSize(
            text,
            maxWidth - indent - 10
          );

          wrappedLines.forEach((wrappedLine: string, index: number) => {
            if (index === 0) {
              doc.text("•", margin + indent, yPosition);
              doc.text(wrappedLine, margin + indent + 10, yPosition);
            } else {
              doc.text(wrappedLine, margin + indent + 10, yPosition);
            }
            yPosition += 16;
          });
        } else if (/^\d+\.\s/.test(line.trim())) {
          checkPageBreak(16);
          const match = line.match(/^(\s*)(\d+)\.\s(.+)$/);
          if (match) {
            const [, spaces, num, text] = match;
            const indent = spaces.length * 4;
            const wrappedLines = doc.splitTextToSize(
              text,
              maxWidth - indent - 15
            );

            wrappedLines.forEach((wrappedLine: string, index: number) => {
              if (index === 0) {
                doc.text(`${num}.`, margin + indent, yPosition);
                doc.text(wrappedLine, margin + indent + 15, yPosition);
              } else {
                doc.text(wrappedLine, margin + indent + 15, yPosition);
              }
              yPosition += 16;
            });
          }
        } else {
          checkPageBreak(16);
          let text = line;
          text = text.replace(/\*\*(.+?)\*\*/g, "$1");
          text = text.replace(/\*(.+?)\*/g, "$1");
          text = text.replace(/`(.+?)`/g, "$1");

          const wrappedLines = doc.splitTextToSize(text, maxWidth);
          wrappedLines.forEach((wrappedLine: string) => {
            doc.text(wrappedLine, margin, yPosition);
            yPosition += 16;
          });
        }
      }

      const filename = `${artifact.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
      doc.save(filename);

      toast.dismiss(loadingToast);
      toast.success("PDF downloaded successfully");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(
        `Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  };

  if (!artifact) return null;

  // The content that will be rendered in both modes
  const artifactContent = (
    <>
      {/* Header */}
      <div
        className={cn(mode === "panel" ? "p-4 border-b" : "px-6 py-4 border-b")}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {mode === "drawer" ? (
              <SheetTitle className="text-xl leading-tight pr-8">
                {artifact.title}
              </SheetTitle>
            ) : (
              <h2 className="text-xl font-semibold leading-tight pr-8">
                {artifact.title}
              </h2>
            )}
            {mode === "drawer" ? (
              <SheetDescription className="mt-2">
                Last updated{" "}
                {formatDistanceToNow(new Date(artifact.updatedAt), {
                  addSuffix: true,
                })}
              </SheetDescription>
            ) : (
              <p className="text-sm text-muted-foreground mt-2">
                Last updated{" "}
                {formatDistanceToNow(new Date(artifact.updatedAt), {
                  addSuffix: true,
                })}
              </p>
            )}
          </div>
          {/* Close button for panel mode */}
          {mode === "panel" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {/* Copy Button */}
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </Button>

          {/* Download Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={handleDownloadMarkdown}>
                Download as Markdown
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownloadPDF}>
                Download as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          "flex-1 overflow-auto",
          mode === "panel" ? "p-4" : "px-6 py-4"
        )}
      >
        <Response>{artifact.content}</Response>
      </div>
    </>
  );

  // Render based on mode
  if (mode === "panel") {
    // Inline panel mode (for desktop split view)
    if (!open) return null;

    return (
      <Card className="flex flex-col h-full overflow-hidden">
        {artifactContent}
      </Card>
    );
  }

  // Drawer mode (for mobile overlay)
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[600px] flex flex-col p-0"
      >
        {artifactContent}
      </SheetContent>
    </Sheet>
  );
}
