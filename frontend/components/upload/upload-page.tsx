"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Boxes,
  ChartColumnIncreasing,
  Check,
  Download,
  Lightbulb,
  MessageSquareQuote,
} from "lucide-react";

import { CsvUploadCard } from "@/components/upload/csv-upload-card";
import { AnalysisResultsPreview } from "@/components/upload/analysis-results-preview";
import { Button } from "@/components/ui/button";
import { LandingShell } from "@/components/landing/landing-shell";

const featureCards = [
  {
    title: "Sales Analytics",
    description:
      "Spot growth patterns, margin movement, and seasonality trends.",
    icon: ChartColumnIncreasing,
  },
  {
    title: "Customer Insights",
    description:
      "Uncover sentiment shifts, churn signals, and repeat-buyer behavior.",
    icon: MessageSquareQuote,
  },
  {
    title: "Inventory Intelligence",
    description: "Monitor stock health, fast movers, and replenishment risks.",
    icon: Boxes,
  },
  {
    title: "AI Recommendations",
    description:
      "Receive actionable suggestions based on business performance signals.",
    icon: Lightbulb,
  },
];

const stepLabels = [
  "Mapping schema",
  "Standardizing data",
  "Running sales analytics",
  "Generating AI recommendations",
];

type AnalysisResult = {
  sales_insights: {
    total_revenue?: number;
    total_quantity_sold?: number;
    best_selling_product?: string;
    average_rating?: number;
    most_returned_product?: string;
    lowest_rated_product?: string;
  };
  inventory_insights: {
    low_stock_products: string[];
    fast_moving_products: string[];
    dead_inventory_products: string[];
  };
  customer_insights: {
    positive_reviews?: number;
    negative_reviews?: number;
    overall_sentiment?: number;
    top_positive_keywords?: string[];
    top_negative_keywords?: string[];
  };
  recommendations: string;
};

export function UploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedData, setUploadedData] = useState<unknown>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAnalyzing) {
      return;
    }

    const timers = stepLabels.map((_, index) =>
      window.setTimeout(
        () => {
          setCompletedSteps(index + 1);
        },
        850 * (index + 1),
      ),
    );

    const finalTimer = window.setTimeout(
      () => {
        setIsAnalyzing(false);
        setShowResults(true);
      },
      850 * (stepLabels.length + 1),
    );

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(finalTimer);
    };
  }, [isAnalyzing]);

  const analysisProgress = useMemo(() => {
    if (!isAnalyzing && !showResults) {
      return 0;
    }

    if (showResults) {
      return 100;
    }

    return Math.round((completedSteps / stepLabels.length) * 100);
  }, [completedSteps, isAnalyzing, showResults]);

  const handleUpload = async (file: File) => {
    setIsSubmitting(true);
    setUploadError(null);
    setUploadedFile(file);
    setCompletedSteps(0);
    setShowResults(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/business/upload/",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        let details = `Upload failed with status ${response.status}`;

        try {
          const errorData = await response.json();
          if (typeof errorData?.details === "string") {
            details = errorData.details;
          } else if (typeof errorData?.error === "string") {
            details = errorData.error;
          }
        } catch {
          // Keep default fallback message when response body is not JSON.
        }

        throw new Error(details);
      }

      const data = await response.json();
      setAnalysis(data);
      setUploadedData(data);
      setIsAnalyzing(true);
    } catch (error) {
      console.error(error);
      setUploadError(
        error instanceof Error
          ? error.message
          : "Unable to upload the CSV file.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#070a08] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(200,212,184,0.16),transparent_28%),radial-gradient(circle_at_20%_20%,rgba(245,240,232,0.1),transparent_24%),radial-gradient(circle_at_80%_0%,rgba(61,79,53,0.3),transparent_36%),linear-gradient(180deg,#070a08_0%,#0b100d_48%,#070a08_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent)] opacity-40" />

      <LandingShell className="relative z-10 flex flex-col gap-20 py-10 sm:py-14 lg:py-18">
        <section className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] px-6 py-14 shadow-[0_40px_160px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:px-10 lg:px-14">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative mx-auto flex max-w-3xl flex-col items-center text-center"
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-1.5 text-xs tracking-[0.18em] text-[var(--landing-sage-light)] uppercase">
              <BrainCircuit className="size-3.5" />
              AI business ingestion
            </div>
            <h1 className="font-[family-name:var(--font-playfair)] text-4xl leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Upload Your Business Data
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/64 sm:text-lg">
              Let AI analyze your sales, inventory, customer feedback, and
              business performance in seconds.
            </p>
          </motion.div>

          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 0.65, 0.4] }}
            transition={{
              duration: 7,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(220,229,208,0.18),transparent_22%),radial-gradient(circle_at_10%_20%,rgba(245,240,232,0.12),transparent_18%),radial-gradient(circle_at_90%_30%,rgba(61,79,53,0.18),transparent_24%)]"
          />
        </section>

        <section className="mx-auto w-full max-w-4xl space-y-6">
          <CsvUploadCard
            onUploadComplete={(file) => {
              setUploadedFile(file);
              setUploadError(null);
              setShowResults(false);
            }}
            onAnalyze={handleUpload}
            isAnalyzing={isAnalyzing}
            isSubmitting={isSubmitting}
            errorMessage={uploadError}
          />

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col items-center gap-3 rounded-[28px] border border-white/10 bg-white/[0.03] px-6 py-6 text-center backdrop-blur-xl"
          >
            <Button
              asChild
              className="h-11 rounded-full border border-white/10 bg-white/8 px-5 text-white hover:bg-white/12"
            >
              <a href="/sample-business-data.csv" download>
                <Download className="size-4" />
                Download sample CSV
              </a>
            </Button>
            <p className="text-sm text-white/56">
              Use our sample format to test the AI Business Copilot.
            </p>
          </motion.div>
        </section>

        <section className="space-y-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-[0.18em] text-[var(--landing-sage-light)] uppercase">
              <Lightbulb className="size-3.5" />
              AI features
            </div>
            <h2 className="mt-4 font-[family-name:var(--font-playfair)] text-3xl tracking-tight text-white sm:text-4xl">
              What the copilot will uncover from each upload
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map(({ title, description, icon: Icon }, index) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.08,
                  ease: "easeOut",
                }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl"
              >
                <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(220,229,208,0.1),transparent_45%,rgba(61,79,53,0.18))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative flex size-12 items-center justify-center rounded-2xl bg-[var(--landing-sage)]/12 text-[var(--landing-sage-light)]">
                  <Icon className="size-5" strokeWidth={1.6} />
                </div>
                <h3 className="relative mt-5 text-xl font-semibold text-white">
                  {title}
                </h3>
                <p className="relative mt-2 text-sm leading-6 text-white/56">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {(isAnalyzing || showResults || uploadedFile) && (
          <section className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_30px_110px_rgba(0,0,0,0.35)] backdrop-blur-2xl sm:p-8"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-xl">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                        duration: 8,
                      }}
                      className="relative flex size-14 items-center justify-center rounded-full border border-white/12 bg-white/5"
                    >
                      <div className="absolute inset-1 rounded-full border border-dashed border-[var(--landing-sage)]/50" />
                      <BrainCircuit
                        className="size-6 text-[var(--landing-sage-light)]"
                        strokeWidth={1.6}
                      />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-semibold text-white">
                        AI agents are analyzing your business...
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-white/56">
                        {uploadedFile
                          ? `Processing ${uploadedFile.name}${uploadedData ? " after successful upload." : " with a staged mock pipeline."}`
                          : "Preparing the mock analytics pipeline."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-white/42">
                      <span>Pipeline progress</span>
                      <span>{analysisProgress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/8">
                      <motion.div
                        animate={{ width: `${analysisProgress}%` }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="h-full rounded-full bg-[linear-gradient(90deg,var(--landing-olive),var(--landing-sage),#eef5e5)]"
                      />
                    </div>
                  </div>
                </div>

                <div className="min-w-0 flex-1 rounded-[28px] border border-white/10 bg-black/18 p-5">
                  <div className="text-xs tracking-[0.18em] text-white/42 uppercase">
                    Processing steps
                  </div>
                  <div className="mt-4 space-y-3">
                    {stepLabels.map((label, index) => {
                      const done = completedSteps > index || showResults;

                      return (
                        <motion.div
                          key={label}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.25, delay: index * 0.05 }}
                          className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                        >
                          <div className="flex size-8 items-center justify-center rounded-full border border-white/12 bg-white/6">
                            {done ? (
                              <Check className="size-4 text-[var(--landing-sage-light)]" />
                            ) : (
                              <div className="size-2 rounded-full bg-white/40" />
                            )}
                          </div>
                          <span className="text-sm text-white/72">{label}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            {showResults ? <AnalysisResultsPreview analysis={analysis} /> : null}
k          </section>
        )}
      </LandingShell>
    </div>
  );
}
