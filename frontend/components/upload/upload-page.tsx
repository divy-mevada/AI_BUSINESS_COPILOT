"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";

import { CsvUploadCard } from "@/components/upload/csv-upload-card";
import { AnalysisResultsPreview } from "@/components/upload/analysis-results-preview";
import { LandingShell } from "@/components/landing/landing-shell";
import { useAuth } from "@/contexts/AuthContext";

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
  const [isScrolled, setIsScrolled] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isAnalyzing) return;

    const timers = stepLabels.map((_, index) =>
      window.setTimeout(() => setCompletedSteps(index + 1), 850 * (index + 1))
    );

    const finalTimer = window.setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 850 * (stepLabels.length + 1));

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(finalTimer);
    };
  }, [isAnalyzing]);

  const analysisProgress = useMemo(() => {
    if (!isAnalyzing && !showResults) return 0;
    if (showResults) return 100;
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
      const response = await fetch("http://127.0.0.1:8000/api/business/upload/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        let details = `Upload failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          if (typeof errorData?.details === "string") details = errorData.details;
          else if (typeof errorData?.error === "string") details = errorData.error;
        } catch {}
        throw new Error(details);
      }

      const data = await response.json();
      setAnalysis(data);
      setUploadedData(data);
      setIsAnalyzing(true);
    } catch (error) {
      console.error(error);
      setUploadError(error instanceof Error ? error.message : "Unable to upload the CSV file.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen flex flex-col selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Navbar exactly like landing page but with Log out button */}
      <nav
        id="main-nav"
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-margin-mobile md:px-margin-desktop ${
          isScrolled ? "py-4" : "py-6"
        }`}
      >
        <div
          id="nav-container"
          className={`max-w-container-max mx-auto flex justify-between items-center transition-all duration-500 rounded-full px-8 py-3 ${
            isScrolled 
              ? "bg-white/70 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(0,32,26,0.05)]" 
              : "bg-transparent border border-transparent shadow-none"
          }`}
        >
          {/* Brand Logo */}
          <Link href="/landing" className="font-display text-2xl font-bold tracking-tight text-primary">
            Lumina AI
          </Link>
          
          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            <Link className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="/landing#features">
              Features
            </Link>
            <Link className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="/landing#solutions">
              Solutions
            </Link>
            <Link className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer" href="/landing#pricing">
              Pricing
            </Link>
            <Link className="text-sm font-bold text-primary border-b-2 border-secondary" href="/upload">
              Dashboard
            </Link>
          </div>
          
          {/* Auth Actions */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => logout()}
              className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all mirror-shine shadow-lg shadow-primary/10 cursor-pointer"
            >
              Log out
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center px-margin-mobile md:px-margin-desktop py-32 md:py-40 max-w-container-max mx-auto w-full">
        {/* Page Header */}
        <div className="text-center mb-16 max-w-2xl">
          <h1 className="font-display text-5xl md:text-6xl text-primary mb-6">Upload Your Business Data</h1>
          <p className="text-lg md:text-xl text-on-surface-variant font-light">
            Securely ingest your proprietary datasets. Lumina AI will harmonize your records for deep intelligence extraction.
          </p>
        </div>

        {/* Central Upload Zone */}
        <div className="w-full max-w-3xl mb-24">
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
        </div>

        {(isAnalyzing || showResults || uploadedFile) && (
          <section className="w-full mb-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="overflow-hidden rounded-3xl border border-outline-variant bg-white p-6 shadow-xl sm:p-8 w-full"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-xl">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Number.POSITIVE_INFINITY, ease: "linear", duration: 8 }}
                      className="relative flex size-14 items-center justify-center rounded-full border border-outline-variant bg-surface"
                    >
                      <div className="absolute inset-1 rounded-full border border-dashed border-secondary/50" />
                      <span className="material-symbols-outlined text-secondary">model_training</span>
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-semibold text-primary font-display">
                        AI agents are analyzing your business...
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-on-surface-variant">
                        {uploadedFile
                          ? `Processing ${uploadedFile.name}${uploadedData ? " after successful upload." : " with a staged mock pipeline."}`
                          : "Preparing the mock analytics pipeline."}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-2">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                      <span>Pipeline progress</span>
                      <span>{analysisProgress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-container-high">
                      <motion.div
                        animate={{ width: `${analysisProgress}%` }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="h-full rounded-full bg-secondary"
                      />
                    </div>
                  </div>
                </div>

                <div className="min-w-0 flex-1 rounded-2xl border border-outline-variant bg-surface p-5">
                  <div className="text-xs tracking-[0.18em] text-on-surface-variant uppercase">
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
                          className="flex items-center gap-3 rounded-xl border border-outline-variant bg-white px-4 py-3"
                        >
                          <div className="flex size-8 items-center justify-center rounded-full border border-outline-variant bg-surface">
                            {done ? (
                              <Check className="size-4 text-secondary" />
                            ) : (
                              <div className="size-2 rounded-full bg-outline/40" />
                            )}
                          </div>
                          <span className="text-sm text-on-surface">{label}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            {showResults && (
              <div className="mt-12">
                <AnalysisResultsPreview analysis={analysis} />
              </div>
            )}
          </section>
        )}

        {/* Benefits Section */}
        <section className="w-full">
          <div className="flex flex-col items-center mb-12">
            <span className="text-xs font-semibold text-secondary uppercase tracking-widest mb-2">Capabilities</span>
            <h2 className="font-display text-4xl text-primary text-center">What the copilot will uncover</h2>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {[
              { title: "Anomaly Detection", icon: "query_stats", desc: "Instantly spot statistical deviations and potential operational risks across your entire supply chain." },
              { title: "Predictive Trends", icon: "monitoring", desc: "Forecast future market demands by analyzing historical performance cycles through our proprietary neural nets." },
              { title: "Silo Integration", icon: "hub", desc: "Automatically map and join disparate data tables from finance, marketing, and logistics into a single source of truth." },
              { title: "Narrative Synthesis", icon: "auto_awesome", desc: "Convert raw spreadsheets into executive-ready summaries and actionable strategic recommendations." },
            ].map((feature, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-md border border-white/30 shadow-sm p-8 rounded-2xl flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                <div className="text-secondary mb-4">
                  <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                </div>
                <h3 className="font-display text-2xl leading-tight text-primary mb-3">{feature.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Visual Hint */}
        <div className="mt-20 w-full flex flex-col md:flex-row gap-8 items-center justify-between p-8 bg-surface-container-low rounded-2xl">
          <div className="flex items-center gap-4">
            <img alt="Security Overview" className="w-16 h-16 rounded-lg object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwn4lG52LeNzB7wxsjcc7iVq0-QGezNy5gmm6cQSGrXexerIuDm4bfg5RkTOvePaFH6KTxg5veyHdv-WKr8AXq2IxHId_FrqoKWb_DpFlMhwlPM_tKDZEmScu1rHr6LQRjjv95K5GzQd9lbSbGBhQcKg9V_Qsj6duW-0te9hQcKfZynmK_A0FrUYVw7nJJ08lNqx9pMeTE2g5_fpGjDd9iQvfV3xk-jugqeW_-_52SUBOSZruzIkyXqpfO81pcg3x9BakgT6qg7IbN" />
            <div>
              <p className="text-xs font-semibold text-primary uppercase">Privacy First</p>
              <p className="text-sm text-on-surface-variant">All data is encrypted end-to-end and SOC2 Type II compliant.</p>
            </div>
          </div>
          <a className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1" href="#">
            LEARN ABOUT OUR SECURITY
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </a>
        </div>
      </main>

      {/* Footer Standard Shell */}
      <footer className="w-full mt-auto bg-surface-container-low border-t border-outline-variant">
        <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop py-12 max-w-container-max mx-auto gap-8">
          <div>
            <span className="font-display text-4xl text-primary block mb-2">Lumina</span>
            <p className="text-sm text-on-surface-variant">© 2024 Lumina Intelligence. All rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <a className="text-sm text-on-surface-variant hover:text-primary underline transition-all" href="#">Privacy Policy</a>
            <a className="text-sm text-on-surface-variant hover:text-primary underline transition-all" href="#">Terms of Service</a>
            <a className="text-sm text-on-surface-variant hover:text-primary underline transition-all" href="#">Security</a>
            <a className="text-sm text-on-surface-variant hover:text-primary underline transition-all" href="#">API Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
