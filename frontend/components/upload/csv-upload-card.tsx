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
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
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
    if (!selectedFile || !isUploading) return;

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
    if (!file) return;

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
        "relative overflow-hidden custom-shadow border-2 border-dashed rounded-xl p-12 md:p-20 text-center flex flex-col items-center transition-all duration-300 cursor-pointer group",
        isDragging
          ? "border-primary bg-secondary-container/10"
          : "border-outline-variant hover:border-primary bg-gradient-to-br from-white/80 to-[#e2ead8]/40"
      )}
    >
      {/* Background visual texture */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{ backgroundImage: "radial-gradient(circle at 2px 2px, #01261f 1px, transparent 0)", backgroundSize: "24px 24px" }}
      ></div>
      
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="mb-6 w-20 h-20 bg-secondary-container rounded-full flex items-center justify-center mx-auto text-on-secondary-container transition-transform group-hover:scale-110 duration-300">
          <span className="material-symbols-outlined text-4xl">cloud_upload</span>
        </div>
        
        <h2 className="font-display text-4xl text-primary mb-2">Drag & Drop CSV Files</h2>
        <p className="text-on-surface-variant mb-8 text-base">Or click to browse your computer (Max file size: 500MB)</p>

        {isUploading || (selectedFile && uploadProgress > 0) ? (
          <div className="w-full max-w-md mx-auto mb-6">
            <div className="flex justify-between items-end mb-2">
              <span className="text-xs font-semibold text-primary uppercase">{selectedFile.name}</span>
              <span className="text-xs font-semibold text-primary">{uploadProgress}%</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${uploadProgress}%` }}
                className="h-full bg-secondary rounded-full relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/30 animate-[progress-slide_2s_ease-in-out_infinite]" />
              </motion.div>
            </div>
          </div>
        ) : null}

        {error || errorMessage ? (
          <p className="text-sm text-red-600 mb-4">{error ?? errorMessage}</p>
        ) : null}

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          {!selectedFile || uploadProgress < 100 ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="bg-primary text-white px-8 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md"
            >
              <span className="material-symbols-outlined">upload_file</span>
              SELECT FILE
            </button>
          ) : (
            <button
              type="button"
              disabled={isAnalyzing || isSubmitting}
              onClick={() => selectedFile && onAnalyze(selectedFile)}
              className="bg-secondary text-on-secondary-container px-8 py-3 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-md disabled:opacity-50"
            >
              <span className="material-symbols-outlined">analytics</span>
              {isAnalyzing || isSubmitting ? "PROCESSING..." : "VIEW DASHBOARD"}
            </button>
          )}
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
    </div>
  );
}
