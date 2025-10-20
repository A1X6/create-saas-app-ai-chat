'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  ArrowRight,
  ArrowLeft,
  FileText,
  CheckCircle2,
  XCircle,
  Loader2,
  Info,
  FileJson,
  Upload,
} from 'lucide-react';
import { useState, useEffect, useTransition, useRef } from 'react';
import { toast } from 'sonner';
import {
  checkPromptsStatus,
  convertPromptsToJson,
  uploadPromptFiles,
} from '@/lib/actions/prompts-actions';

type PromptsStatus = {
  markdownCount: number;
  jsonCount: number;
  markdownFiles: string[];
  jsonFiles: string[];
};

export default function PromptsPage() {
  const [status, setStatus] = useState<PromptsStatus | null>(null);
  const [isChecking, startCheckTransition] = useTransition();
  const [isConverting, startConvertTransition] = useTransition();
  const [isUploading, startUploadTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-check prompts status on mount
  useEffect(() => {
    checkPromptsStatusHandler();
  }, []);

  const checkPromptsStatusHandler = () => {
    startCheckTransition(async () => {
      toast.info('Checking prompts status...', {
        description: 'Scanning markdown and JSON files',
      });

      try {
        const result = await checkPromptsStatus();

        if (!result.success) {
          toast.error('Failed to check prompts status', {
            description: result.message,
          });
          setStatus({
            markdownCount: 0,
            jsonCount: 0,
            markdownFiles: [],
            jsonFiles: [],
          });
          return;
        }

        setStatus({
          markdownCount: result.markdownCount,
          jsonCount: result.jsonCount,
          markdownFiles: result.markdownFiles,
          jsonFiles: result.jsonFiles,
        });

        toast.success('Prompts status checked!', {
          description: result.message,
        });
      } catch (error) {
        toast.error('Failed to check prompts status', {
          description: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });
  };

  const handleConvertPrompts = () => {
    startConvertTransition(async () => {
      toast.info('Converting prompts...', {
        description: 'Generating JSON files from markdown',
      });

      const result = await convertPromptsToJson();

      if (result.success) {
        toast.success('Prompts converted!', {
          description: 'JSON files generated successfully',
        });
        // Refresh status
        checkPromptsStatusHandler();
      } else {
        toast.error('Failed to convert prompts', {
          description: result.message,
        });
      }
    });
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    startUploadTransition(async () => {
      toast.info('Uploading files...', {
        description: `Uploading ${files.length} file(s)`,
      });

      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      const result = await uploadPromptFiles(formData);

      if (result.success) {
        toast.success('Files uploaded!', {
          description: result.message,
        });
        // Refresh status
        checkPromptsStatusHandler();
      } else {
        toast.error('Failed to upload files', {
          description: result.message,
        });
      }
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const canProceed = status !== null && status.jsonCount > 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">AI Prompts Configuration</h2>
        <p className="text-muted-foreground">
          Upload markdown prompt files and convert them to JSON format for AI models.
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>How It Works</AlertTitle>
        <AlertDescription>
          Upload your <code className="text-xs bg-muted px-1 rounded">.md</code> files using the
          dropzone below, then click "Convert to JSON" to generate the corresponding JSON files
          automatically.
        </AlertDescription>
      </Alert>

      {/* File Upload Dropzone */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Upload Markdown Files</CardTitle>
              <CardDescription>Drag and drop or click to upload .md files</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".md"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="p-4 bg-primary/10 rounded-full">
                <Upload className="w-8 h-8 text-primary" />
              </div>

              {isUploading ? (
                <div className="space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                  <p className="font-medium">Uploading files...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <p className="font-medium text-lg">
                      Drop your markdown files here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse and select files
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Only .md files are accepted
                  </Badge>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Prompts Status Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Prompt Files Status</CardTitle>
                <CardDescription>Markdown and JSON file counts</CardDescription>
              </div>
            </div>
            {status !== null && (
              <Badge variant={canProceed ? 'default' : 'secondary'}>
                {canProceed ? 'Ready' : 'Pending'}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === null ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking prompts...</span>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Markdown Files */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Markdown Files</p>
                    <p className="text-sm text-muted-foreground">
                      Source prompt files in <code className="text-xs bg-muted px-1 rounded">prompts/markdown/</code>
                    </p>
                  </div>
                </div>
                <Badge variant="outline">{status.markdownCount} files</Badge>
              </div>

              {/* JSON Files */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileJson className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">JSON Files</p>
                    <p className="text-sm text-muted-foreground">
                      Generated files in <code className="text-xs bg-muted px-1 rounded">prompts/json/</code>
                    </p>
                  </div>
                </div>
                <Badge variant="outline">{status.jsonCount} files</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File Lists */}
      {status !== null && status.markdownCount > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Available Files</CardTitle>
            <CardDescription>List of markdown and JSON files</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {status.markdownFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Markdown Files:</p>
                <div className="grid gap-2">
                  {status.markdownFiles.map((file) => (
                    <div
                      key={file}
                      className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
                    >
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-mono">{file}</span>
                      {status.jsonFiles.includes(file.replace('.md', '.json')) ? (
                        <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
                      ) : (
                        <XCircle className="w-4 h-4 text-muted-foreground ml-auto" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {status.jsonFiles.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium">JSON Files:</p>
                <div className="grid gap-2">
                  {status.jsonFiles.map((file) => (
                    <div
                      key={file}
                      className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg"
                    >
                      <FileJson className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-mono">{file}</span>
                      <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Quick Guide</CardTitle>
              <CardDescription>Step-by-step instructions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium mt-0.5">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium">Upload Markdown Files</p>
              <p className="text-sm text-muted-foreground">
                Drag and drop your <code className="text-xs bg-muted px-1 rounded">.md</code> files
                into the upload zone above, or click to browse
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium mt-0.5">
              2
            </div>
            <div className="flex-1">
              <p className="font-medium">Convert to JSON</p>
              <p className="text-sm text-muted-foreground">
                After uploading, click "Convert to JSON" to generate the JSON files
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium mt-0.5">
              3
            </div>
            <div className="flex-1">
              <p className="font-medium">Verify & Continue</p>
              <p className="text-sm text-muted-foreground">
                Check the status shows JSON files generated, then proceed to Stripe configuration
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            onClick={checkPromptsStatusHandler}
            disabled={isChecking}
          >
            {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isChecking ? 'Checking...' : 'Refresh Status'}
          </Button>
          <Button
            size="lg"
            className="flex-1"
            onClick={handleConvertPrompts}
            disabled={isConverting || status === null || status.markdownCount === 0}
          >
            {isConverting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isConverting ? 'Converting...' : 'Convert to JSON'}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-4 border-t">
        <Button asChild variant="outline" className="gap-2" type="button">
          <Link href="/setup/database">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </Button>
        <Button
          asChild
          className="gap-2"
          type="button"
          disabled={!canProceed}
        >
          <Link href="/setup/stripe">
            Next: Stripe
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
