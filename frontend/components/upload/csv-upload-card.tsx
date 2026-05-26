"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FileSpreadsheet, Sparkles, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CsvUploadCardProps = {
  onUploadComplete: (file: File) => void;
  onAnalyze: (file: File) => void | Promise<void>;
  isAnalyzing: boolean;
  isSubmitting?: boolean;
  errorMessage?: string | null;
};

function formatFileSize(size: number) {
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

export function CsvUploadCard({
  onUploadComplete,
  onAnalyze,
  isAnalyzing,
  isSubmitting = false,
  errorMessage,
}: CsvUploadCardProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedFile || !isUploading) {
      return;
    }

    const timer = window.setInterval(() => {
      let isComplete = false;

      setUploadProgress((current) => {
        const next = Math.min(current + 8, 100);

        if (next === 100) {
          isComplete = true;
          window.clearInterval(timer);
        }

        return next;
      });

      if (isComplete) {
        setIsUploading(false);
        window.setTimeout(() => onUploadComplete(selectedFile), 0);
      }
    }, 120);

    return () => window.clearInterval(timer);
  }, [isUploading, onUploadComplete, selectedFile]);

  const prepareFile = (file: File | null) => {
    if (!file) {
      return;
    }

    const isCsv =
      file.type === "text/csv" ||
      file.name.toLowerCase().endsWith(".csv") ||
      file.type === "application/vnd.ms-excel";

    if (!isCsv) {
      setError("Please upload a CSV file.");
      return;
    }

    setError(null);
    setSelectedFile(file);
    setUploadProgress(0);
    setIsUploading(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-[32px] border border-white/12 bg-white/8 p-1 shadow-[0_30px_120px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,229,208,0.18),transparent_32%),linear-gradient(135deg,rgba(200,212,184,0.14),rgba(255,255,255,0.02)_40%,rgba(61,79,53,0.18))]" />
      <div className="relative rounded-[28px] border border-white/10 bg-[#0b100d]/90 p-6 sm:p-8">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs tracking-[0.18em] text-[var(--landing-sage-light)] uppercase">
              <Sparkles className="size-3.5" />
              AI-ready data intake
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-playfair)] text-3xl tracking-tight text-white sm:text-4xl">
                Premium CSV Upload
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-white/64 sm:text-base">
                Drop your business data into a secure ingestion flow designed
                for fast AI analysis and clean operational reporting.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--landing-sage)]/16 bg-[var(--landing-sage)]/8 p-3">
            <motion.div
              animate={{ y: [0, -6, 0], scale: [1, 1.05, 1] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.8, ease: "easeInOut" }}
              className="flex size-12 items-center justify-center rounded-2xl bg-[var(--landing-sage)]/14 text-[var(--landing-sage-light)]"
            >
              <Upload className="size-6" strokeWidth={1.6} />
            </motion.div>
          </div>
        </div>

        <div
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            prepareFile(event.dataTransfer.files[0] ?? null);
          }}
          className={cn(
            "group relative overflow-hidden rounded-[28px] border border-dashed px-6 py-10 text-center transition-all duration-300",
            isDragging
              ? "border-[var(--landing-sage)]/70 bg-[var(--landing-sage)]/14 shadow-[0_0_0_1px_rgba(220,229,208,0.25)]"
              : "border-white/12 bg-white/[0.04] hover:border-[var(--landing-sage)]/45 hover:bg-white/[0.06]",
          )}
        >
          <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="mx-auto flex size-18 items-center justify-center rounded-[26px] border border-white/10 bg-white/8 text-[var(--landing-sage-light)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          >
            <FileSpreadsheet className="size-8" strokeWidth={1.6} />
          </motion.div>

          <div className="mt-6 space-y-2">
            <h3 className="text-xl font-semibold text-white">
              Drag and drop your CSV here
            </h3>
            <p className="mx-auto max-w-md text-sm leading-6 text-white/58">
              Upload sales, inventory, support, or customer data to generate
              instant business intelligence.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="h-11 rounded-full bg-[var(--landing-sage)] px-5 text-[0.95rem] font-medium text-[#172015] shadow-[0_18px_60px_rgba(200,212,184,0.18)] hover:bg-[var(--landing-sage-light)]"
            >
              Browse file
            </Button>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs tracking-[0.18em] text-white/58 uppercase">
              CSV only
            </div>
          </div>

          <input
            id={inputId}
            ref={inputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(event) => prepareFile(event.target.files?.[0] ?? null)}
          />
        </div>

        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/46">
              <span>Upload progress</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/8">
              <motion.div
                animate={{ width: `${uploadProgress}%` }}
                transition={{ ease: "easeOut", duration: 0.25 }}
                className="h-full rounded-full bg-[linear-gradient(90deg,var(--landing-olive),var(--landing-sage),#eef5e5)]"
              />
            </div>
          </div>

          <div className="grid gap-3 rounded-[24px] border border-white/8 bg-black/20 p-4 text-sm text-white/68 sm:grid-cols-3">
            <div>
              <p className="text-[0.7rem] tracking-[0.18em] text-white/42 uppercase">
                File name
              </p>
              <p className="mt-1 truncate text-sm text-white">
                {selectedFile?.name ?? "Awaiting upload"}
              </p>
            </div>
            <div>
              <p className="text-[0.7rem] tracking-[0.18em] text-white/42 uppercase">
                File size
              </p>
              <p className="mt-1 text-sm text-white">
                {selectedFile ? formatFileSize(selectedFile.size) : "--"}
              </p>
            </div>
            <div>
              <p className="text-[0.7rem] tracking-[0.18em] text-white/42 uppercase">
                Status
              </p>
              <p className="mt-1 text-sm text-white">
                {isUploading
                  ? "Uploading..."
                  : selectedFile && uploadProgress === 100
                    ? "Ready for AI analysis"
                    : "Waiting for CSV"}
              </p>
            </div>
          </div>

          {error || errorMessage ? (
            <p className="text-sm text-red-300">{error ?? errorMessage}</p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-white/54">
              Your file stays in a mock client-side flow for now. Backend
              ingestion can plug in later without changing the UI structure.
            </div>
            <Button
              type="button"
              disabled={
                !selectedFile || uploadProgress < 100 || isAnalyzing || isSubmitting
              }
              onClick={() => selectedFile && onAnalyze(selectedFile)}
              className="h-11 rounded-full border border-white/10 bg-white text-[#0b100d] hover:bg-[var(--landing-beige)] disabled:bg-white/10 disabled:text-white/35"
            >
              {isSubmitting
                ? "Uploading..."
                : isAnalyzing
                  ? "Analyzing..."
                  : "Analyze with AI"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
