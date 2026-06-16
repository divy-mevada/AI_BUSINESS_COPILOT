"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

import { CsvUploadCard } from "@/components/upload/csv-upload-card";
import { AnalysisResultsPreview } from "@/components/upload/analysis-results-preview";
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
  customer_segmentation?: {
    [key: string]: {
      name: string;
      size: number;
      avg_spent: number;
      avg_freq: number;
      avg_rating: number;
    };
  };
  sales_forecast?: {
    trend?: string;
    daily_growth_rate?: number;
    historical_dates?: string[];
    historical_values?: number[];
    forecast_dates?: string[];
    forecast_values?: number[];
    error?: string;
  };
  marketing_strategy?: string;
};

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'upload' | 'reports' | 'settings'>('dashboard');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedData, setUploadedData] = useState<unknown>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { user, logout } = useAuth();

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

  const userName = user ? `${user.first_name}`.trim() : "Divy";
  const userFullImageUrl = user?.profile_picture || "https://lh3.googleusercontent.com/aida-public/AB6AXuBjrYnj8-GrpChSIeE4ksFEbRsFm_mDRFH9QxvEM4JWojuJMWdO9a2vcDBdKegYdp7-owGfKR3Eo6o5ph81LQhcA3GhYuRxenOu9dYPRUr6AIpzcb29wuulwA40IXisfKKAV-sTzdiJ6T25Rv_T2WDRkikT8t4ty7XYObeSeZArlLVuYr_jx5zJq95Rn0NxHfZHmWeMOYBRzL3Dr1nnBOV_Xrwz62FVsxmkEs8AGP_4lmA-cvgPDcYQ9-mlIme1T_To09-MGvK5Vz7C";

  return (
    <div className="flex min-h-screen bg-surface">
      {/* SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-surface-container-low border-r border-outline-variant z-50 flex flex-col p-6 text-left">
        <div className="mb-12">
          <h1 className="font-display text-4xl text-primary tracking-tight">Lumina AI</h1>
        </div>
        <nav className="flex-grow space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
              activeTab === 'dashboard'
                ? "bg-secondary-container text-on-secondary-fixed font-semibold accent-glow"
                : "text-on-surface-variant font-medium hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-body-md">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
              activeTab === 'upload'
                ? "bg-secondary-container text-on-secondary-fixed font-semibold accent-glow"
                : "text-on-surface-variant font-medium hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined">upload_file</span>
            <span className="font-body-md">Upload Data</span>
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
              activeTab === 'reports'
                ? "bg-secondary-container text-on-secondary-fixed font-semibold accent-glow"
                : "text-on-surface-variant font-medium hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined">analytics</span>
            <span className="font-body-md">Reports</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-pointer ${
              activeTab === 'settings'
                ? "bg-secondary-container text-on-secondary-fixed font-semibold accent-glow"
                : "text-on-surface-variant font-medium hover:bg-surface-container"
            }`}
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-body-md">Settings</span>
          </button>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-outline-variant">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-fixed-dim flex items-center justify-center overflow-hidden border border-outline-variant">
              <img alt="Profile" className="w-full h-full object-cover" src={userFullImageUrl} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-label-sm text-label-sm text-on-surface truncate">{userName}</p>
              <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Premium Plan</p>
            </div>
            <button onClick={() => logout()} className="ml-auto text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="ml-64 flex-1 p-margin-desktop min-h-screen relative overflow-y-auto bg-surface flex flex-col justify-between">
        <div className="w-full">
          {/* TOP HEADER */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 stagger-in" style={{ animationDelay: "0s" }}>
            <div className="text-left">
              <p className="font-label-sm text-label-sm text-on-surface-variant mb-1 uppercase tracking-widest">
                {activeTab === 'dashboard' && 'Dashboard / Overview'}
                {activeTab === 'upload' && 'Dashboard / Data Ingestion'}
                {activeTab === 'reports' && 'Dashboard / Strategic Reports'}
                {activeTab === 'settings' && 'Dashboard / Account Settings'}
              </p>
              <h2 className="font-display text-headline-xl text-primary">
                {activeTab === 'dashboard' && `Welcome back, ${userName}`}
                {activeTab === 'upload' && 'Upload Spreadsheets'}
                {activeTab === 'reports' && 'Intellectual Reports'}
                {activeTab === 'settings' && 'System Configuration'}
              </h2>
            </div>
            <div className="flex items-center gap-6 w-full sm:w-auto justify-end">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
                <input className="bg-surface-container-lowest border border-outline-variant rounded-full pl-12 pr-6 py-2 w-64 focus:border-secondary focus:ring-0 text-sm outline-none" placeholder="Search insights..." type="text"/>
              </div>
              <button className="relative w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low transition-colors cursor-pointer">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-secondary-fixed rounded-full ring-2 ring-white"></span>
              </button>
            </div>
          </header>

          {/* TAB VIEW RENDERING */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-12 gap-gutter">
              {/* HERO WELCOME */}
              <section className="col-span-12 lg:col-span-8 stagger-in" style={{ animationDelay: "0.1s" }}>
                <div className="premium-card rounded-xl p-10 h-full relative overflow-hidden flex flex-col justify-center text-left">
                  <div className="relative z-10">
                    <h3 className="font-display text-display-lg text-primary mb-6 leading-tight">
                      {uploadedFile ? "Your AI Business Analyst is ready." : "Upload your business data"}
                    </h3>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mb-10">
                      {uploadedFile 
                        ? `Processed and analyzed dataset: ${uploadedFile.name}. All strategic metrics and insights have been updated.` 
                        : "Upload your CSV spreadsheet data to generate real-time AI analysis, calculate KPIs, and compile strategic reports."}
                    </p>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setActiveTab('upload')}
                        className="px-8 py-3 bg-secondary-container text-on-secondary-fixed rounded-lg font-bold hover:scale-[0.98] transition-transform flex items-center gap-2 accent-glow cursor-pointer"
                      >
                        <span className="material-symbols-outlined">upload</span>
                        Upload CSV
                      </button>
                      {uploadedFile && (
                        <button
                          onClick={() => setActiveTab('reports')}
                          className="px-8 py-3 border border-outline-variant hover:border-primary text-on-surface rounded-lg font-bold hover:scale-[0.98] transition-transform cursor-pointer"
                        >
                          View Reports
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Decorative Element */}
                  <div className="absolute top-0 right-0 w-80 h-80 bg-secondary-container/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                </div>
              </section>

              {/* QUICK INSIGHTS PANEL */}
              <section className="col-span-12 lg:col-span-4 stagger-in" style={{ animationDelay: "0.2s" }}>
                <div className="premium-card rounded-xl p-8 h-full text-left">
                  <div className="flex items-center gap-2 mb-8">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                    <h4 className="font-label-sm text-label-sm text-secondary uppercase tracking-widest">AI Insights</h4>
                  </div>
                  
                  {analysis ? (
                    <div className="space-y-8 animate-fade-in-down">
                      {analysis.sales_insights?.total_revenue !== undefined && (
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-secondary-container/20 rounded-lg text-secondary">
                            <span className="material-symbols-outlined">trending_up</span>
                          </div>
                          <div>
                            <p className="font-body-md font-semibold text-on-surface">
                              ${analysis.sales_insights.total_revenue.toLocaleString()} Revenue
                            </p>
                            <p className="text-sm text-on-surface-variant">Tracked total volume generated.</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${
                          analysis.inventory_insights?.low_stock_products?.length > 0 
                            ? "bg-error-container/40 text-error" 
                            : "bg-secondary-container/20 text-secondary"
                        }`}>
                          <span className="material-symbols-outlined">inventory_2</span>
                        </div>
                        <div>
                          <p className="font-body-md font-semibold text-on-surface">
                            {analysis.inventory_insights?.low_stock_products?.length > 0 
                              ? `Low Stock: ${analysis.inventory_insights.low_stock_products.length} SKU(s)`
                              : "Inventory Stable"}
                          </p>
                          <p className="text-sm text-on-surface-variant">
                            {analysis.inventory_insights?.low_stock_products?.length > 0
                              ? `Items needing attention: ${analysis.inventory_insights.low_stock_products.slice(0, 2).join(", ")}${analysis.inventory_insights.low_stock_products.length > 2 ? "..." : ""}`
                              : "All stock levels are currently normal."}
                          </p>
                        </div>
                      </div>

                      {analysis.customer_insights?.overall_sentiment !== undefined && (
                        <div className="flex items-start gap-4">
                          <div className="p-2 bg-secondary-container/20 rounded-lg text-secondary">
                            <span className="material-symbols-outlined">sentiment_satisfied</span>
                          </div>
                          <div>
                            <p className="font-body-md font-semibold text-on-surface">
                              Customer Sentiment
                            </p>
                            <p className="text-sm text-on-surface-variant">
                              Overall score: {(analysis.customer_insights.overall_sentiment * 100).toFixed(0)}% Positive.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center h-[240px]">
                      <span className="material-symbols-outlined text-outline text-4xl mb-4">analytics</span>
                      <p className="text-sm text-on-surface-variant px-4">No active insights. Upload a dataset to view AI-generated alerts and analytics here.</p>
                    </div>
                  )}

                  {analysis && (
                    <button
                      onClick={() => setActiveTab('reports')}
                      className="mt-10 w-full py-4 text-secondary font-label-sm text-label-sm border-t border-outline-variant pt-6 flex items-center justify-center gap-2 hover:gap-4 transition-all cursor-pointer"
                    >
                      VIEW DETAILED REPORTS
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  )}
                </div>
              </section>

              {/* KPI GRID */}
              <section className="col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter stagger-in" style={{ animationDelay: "0.3s" }}>
                {/* Total Reports */}
                <div className="premium-card rounded-xl p-6 text-left">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-4 uppercase tracking-widest">Total Reports</p>
                  <div className="flex items-end justify-between">
                    <h5 className="font-display text-headline-lg text-primary">{uploadedFile ? 1 : 0}</h5>
                    <div className="text-secondary flex items-center text-xs font-bold">
                      {uploadedFile ? "+1" : "--"}
                    </div>
                  </div>
                  <div className="mt-6 h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-fixed transition-all duration-500" style={{ width: uploadedFile ? "100%" : "0%" }}></div>
                  </div>
                </div>
                
                {/* Revenue Tracked */}
                <div className="premium-card rounded-xl p-6 text-left">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-4 uppercase tracking-widest">Revenue Tracked</p>
                  <div className="flex items-end justify-between">
                    <h5 className="font-display text-headline-lg text-primary">
                      {analysis?.sales_insights?.total_revenue 
                        ? `$${analysis.sales_insights.total_revenue.toLocaleString()}`
                        : "$0.00"}
                    </h5>
                    <div className="text-secondary flex items-center text-xs font-bold">
                      {analysis?.sales_insights?.total_revenue ? "Active" : "--"}
                    </div>
                  </div>
                  <div className="mt-6 flex gap-1 h-10 items-end">
                    <div className={`w-full bg-secondary-container/20 h-1/2 rounded-sm ${analysis ? "bg-secondary-container" : ""}`}></div>
                    <div className={`w-full bg-secondary-container/20 h-3/4 rounded-sm ${analysis ? "bg-secondary-container" : ""}`}></div>
                    <div className={`w-full bg-secondary-container h-full rounded-sm ${analysis ? "bg-secondary" : ""}`}></div>
                    <div className={`w-full bg-secondary-container/20 h-2/3 rounded-sm ${analysis ? "bg-secondary-container" : ""}`}></div>
                  </div>
                </div>
                
                {/* Avg. Rating */}
                <div className="premium-card rounded-xl p-6 text-left">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-4 uppercase tracking-widest">Avg. Rating</p>
                  <div className="flex items-end justify-between">
                    <h5 className="font-display text-headline-lg text-primary">
                      {analysis?.sales_insights?.average_rating 
                        ? analysis.sales_insights.average_rating.toFixed(1)
                        : "--"}
                    </h5>
                    <div className="text-on-surface-variant flex items-center text-xs">
                      {analysis?.sales_insights?.average_rating && (
                        <span className="material-symbols-outlined text-sm text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-6 h-1.5 bg-surface-container rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-fixed transition-all duration-500" style={{ 
                      width: analysis?.sales_insights?.average_rating 
                        ? `${(analysis.sales_insights.average_rating / 5) * 100}%` 
                        : "0%" 
                    }}></div>
                  </div>
                </div>
                
                {/* Items Sold */}
                <div className="premium-card rounded-xl p-6 text-left">
                  <p className="font-label-sm text-label-sm text-on-surface-variant mb-4 uppercase tracking-widest">Items Sold</p>
                  <div className="flex items-end justify-between">
                    <h5 className="font-display text-headline-lg text-primary">
                      {analysis?.sales_insights?.total_quantity_sold !== undefined 
                        ? analysis.sales_insights.total_quantity_sold.toLocaleString()
                        : "--"}
                    </h5>
                    <div className="text-on-surface-variant flex items-center text-[10px] font-bold uppercase tracking-widest">
                      {analysis ? "Active" : "--"}
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between gap-1">
                    <div className={`w-1/4 h-1.5 rounded-full ${analysis ? "bg-secondary-fixed" : "bg-surface-container"}`}></div>
                    <div className={`w-1/4 h-1.5 rounded-full ${analysis ? "bg-secondary-fixed" : "bg-surface-container"}`}></div>
                    <div className={`w-1/4 h-1.5 rounded-full ${analysis ? "bg-secondary-fixed" : "bg-surface-container"}`}></div>
                    <div className={`w-1/4 h-1.5 rounded-full ${analysis ? "bg-secondary-fixed" : "bg-surface-container"}`}></div>
                  </div>
                </div>
              </section>

              {/* RECENT REPORTS TABLE */}
              <section className="col-span-12 lg:col-span-8 stagger-in" style={{ animationDelay: "0.4s" }}>
                <div className="premium-card rounded-xl overflow-hidden">
                  <div className="p-8 border-b border-outline-variant flex justify-between items-center">
                    <h4 className="font-display text-2xl text-primary">Recent Reports</h4>
                    {uploadedFile && (
                      <button className="text-xs font-label-sm text-secondary hover:underline tracking-widest cursor-pointer">VIEW ARCHIVE</button>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-surface-container-low">
                        <tr>
                          <th className="px-8 py-5 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Report Name</th>
                          <th className="px-8 py-5 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Upload Date</th>
                          <th className="px-8 py-5 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Revenue</th>
                          <th className="px-8 py-5 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant">
                        {uploadedFile ? (
                          <tr className="hover:bg-surface-container-low transition-colors group">
                            <td className="px-8 py-6 font-code text-code text-primary group-hover:text-secondary">{uploadedFile.name}</td>
                            <td className="px-8 py-6 text-sm text-on-surface-variant">
                              {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="px-8 py-6 text-sm font-semibold text-on-surface">
                              {analysis?.sales_insights?.total_revenue
                                ? `$${analysis.sales_insights.total_revenue.toLocaleString()}`
                                : "--"}
                            </td>
                            <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                showResults
                                  ? "bg-secondary-container/20 text-on-secondary-fixed-variant border border-secondary-container/40"
                                  : "bg-surface-container text-on-surface-variant border border-outline-variant"
                              }`}>
                                {showResults ? "Analyzed" : "Processing"}
                              </span>
                            </td>
                          </tr>
                        ) : (
                          <tr>
                            <td colSpan={4} className="px-8 py-12 text-center text-on-surface-variant">
                              <div className="flex flex-col items-center justify-center">
                                <span className="material-symbols-outlined text-4xl text-outline mb-2">folder_open</span>
                                <p className="text-sm">No reports uploaded yet. Go to the Upload tab to add and analyze your data.</p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              {/* UPLOAD CTA */}
              <section className="col-span-12 lg:col-span-4 stagger-in" style={{ animationDelay: "0.5s" }}>
                <div
                  onClick={() => setActiveTab('upload')}
                  className="premium-card rounded-xl border-dashed border-2 border-outline-variant p-10 flex flex-col items-center justify-center text-center h-full group hover:border-secondary transition-colors bg-surface-container-low/30 cursor-pointer"
                >
                  <div className="w-16 h-16 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-secondary transition-all">
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-secondary">cloud_upload</span>
                  </div>
                  <h4 className="font-display text-2xl text-primary mb-3">Premium CSV Upload</h4>
                  <p className="font-body-md text-on-surface-variant mb-8 px-4">Drag and drop your spreadsheet files here or browse your folders for instant analysis.</p>
                  <button className="px-8 py-3 bg-secondary-container text-on-secondary-fixed rounded-lg font-bold hover:shadow-lg transition-all accent-glow cursor-pointer">
                    Browse Files
                  </button>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-12 stagger-in" style={{ animationDelay: "0.1s" }}>
              <div className="max-w-2xl text-left">
                <h3 className="font-display text-headline-xl text-primary mb-4">Upload Business Data</h3>
                <p className="font-body-lg text-on-surface-variant font-light">
                  Ingest your spreadsheet files here. Lumina AI will automatically harmonize, run metrics computations, and construct custom reports.
                </p>
              </div>

              {/* Central Upload Zone */}
              <div className="w-full max-w-3xl">
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
                <section className="w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="overflow-hidden rounded-3xl border border-outline-variant bg-white p-6 shadow-xl sm:p-8 w-full text-left"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div className="max-w-xl flex-1">
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
                                ? `Processing ${uploadedFile.name} through the intelligence extraction engine.`
                                : "Preparing the analytics pipeline."}
                            </p>
                          </div>
                        </div>

                        <div className="mt-6 space-y-2">
                          <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-on-surface-variant font-semibold">
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
                        <div className="text-xs tracking-[0.18em] text-on-surface-variant uppercase font-semibold">
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
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-12 stagger-in" style={{ animationDelay: "0.1s" }}>
              <div className="max-w-2xl text-left">
                <h3 className="font-display text-headline-xl text-primary mb-4">Strategic Business Reports</h3>
                <p className="font-body-lg text-on-surface-variant font-light">
                  Review generated AI recommendations, revenue forecasts, sentiment analysis keywords, and customer segmentation metrics.
                </p>
              </div>

              {analysis ? (
                <div className="text-left">
                  <AnalysisResultsPreview analysis={analysis} />
                </div>
              ) : (
                <div className="premium-card rounded-xl p-12 text-center max-w-xl mx-auto">
                  <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">folder_open</span>
                  <h4 className="font-display text-2xl text-primary mb-2">No active analysis reports</h4>
                  <p className="text-on-surface-variant mb-6">Go to the Upload tab and process a CSV dataset to view dynamic report visualizations here.</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-6 py-2.5 bg-secondary-container text-on-secondary-fixed rounded-lg font-bold hover:scale-[0.98] transition-transform accent-glow cursor-pointer"
                  >
                    Go to Upload
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-12 stagger-in" style={{ animationDelay: "0.1s" }}>
              <div className="max-w-2xl text-left">
                <h3 className="font-display text-headline-xl text-primary mb-4">System Configuration</h3>
                <p className="font-body-lg text-on-surface-variant font-light">
                  Configure subscription details, system user profile, API credentials, and models choice.
                </p>
              </div>

              <div className="premium-card rounded-xl p-8 max-w-2xl text-left space-y-6">
                <div>
                  <h4 className="font-bold text-lg text-primary mb-1">Model Choice</h4>
                  <p className="text-sm text-on-surface-variant mb-3">Select the artificial intelligence model for report generating.</p>
                  <select className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-2.5 w-64 text-sm focus:border-secondary focus:ring-0 outline-none">
                    <option>Gemini 3.5 Flash (Default)</option>
                    <option>Gemini 3.5 Pro (Precision)</option>
                  </select>
                </div>
                
                <div className="border-t border-outline-variant pt-6">
                  <h4 className="font-bold text-lg text-primary mb-1">User Profile</h4>
                  <p className="text-sm text-on-surface-variant mb-3">Your details retrieved from the authentication context.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant block mb-1">First Name</label>
                      <input className="bg-surface-container border border-outline-variant rounded-lg px-4 py-2 w-full text-sm text-on-surface-variant outline-none" type="text" readOnly value={user?.first_name || "Divy"} />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant block mb-1">Last Name</label>
                      <input className="bg-surface-container border border-outline-variant rounded-lg px-4 py-2 w-full text-sm text-on-surface-variant outline-none" type="text" readOnly value={user?.last_name || ""} />
                    </div>
                    <div className="col-span-2">
                      <label className="text-xs uppercase tracking-wider font-semibold text-on-surface-variant block mb-1">Email Address</label>
                      <input className="bg-surface-container border border-outline-variant rounded-lg px-4 py-2 w-full text-sm text-on-surface-variant outline-none" type="text" readOnly value={user?.email || "divy@lumina.ai"} />
                    </div>
                  </div>
                </div>

                <div className="border-t border-outline-variant pt-6 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-lg text-primary mb-1">Subscription Status</h4>
                    <p className="text-xs text-on-secondary-container font-semibold uppercase bg-secondary-container/30 px-2 py-0.5 rounded inline-block">Premium Plan</p>
                  </div>
                  <button className="px-6 py-2.5 border border-outline-variant hover:border-primary text-on-surface rounded-lg font-bold hover:scale-[0.98] transition-transform cursor-pointer">
                    Upgrade Subscription
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer className="mt-20 flex flex-col md:flex-row justify-between items-center py-10 border-t border-outline-variant stagger-in w-full" style={{ animationDelay: "0.6s" }}>
          <p className="font-body-md text-on-surface-variant text-sm">© 2024 Lumina AI. Engineered for Executive Excellence.</p>
          <div className="flex gap-8 mt-6 md:mt-0">
            <a className="font-label-sm text-label-sm text-xs text-on-surface-variant hover:text-secondary transition-colors uppercase tracking-widest" href="#">Privacy Policy</a>
            <a className="font-label-sm text-label-sm text-xs text-on-surface-variant hover:text-secondary transition-colors uppercase tracking-widest" href="#">Terms of Service</a>
            <a className="font-label-sm text-label-sm text-xs text-on-surface-variant hover:text-secondary transition-colors uppercase tracking-widest" href="#">Security</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
