"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  Lightbulb,
  TrendingUp,
  Users,
  Compass,
  FileText
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

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

const mockKpis = [
  {
    label: "Revenue growth",
    value: "+18.4%",
    detail: "Month-over-month improvement",
    icon: TrendingUp,
  },
  {
    label: "Top demand region",
    value: "South Zone",
    detail: "32% of current order volume",
    icon: ArrowUpRight,
  },
  {
    label: "Inventory turnover",
    value: "7.2x",
    detail: "Above benchmark for this category",
    icon: Boxes,
  },
];

const mockRecommendations = [
  {
    title: "Shift inventory toward fast-moving SKUs",
    body: "Demand concentration suggests redistributing stock from slower urban stores into South Zone branches before the next replenishment cycle.",
  },
  {
    title: "Launch a repeat-buyer email sequence",
    body: "Customer order cadence indicates a strong 28-day repurchase window that can be nudged with targeted promotions.",
  },
];

const mockAlerts = [
  "Coffee beans will fall below safety stock in 4 days.",
  "Packaging costs rose 9% against the previous cycle.",
  "Two high-margin items show declining conversion despite healthy traffic.",
];

export function AnalysisResultsPreview({ analysis }: { analysis: AnalysisResult | null }) {
  const s = analysis?.sales_insights;
  const inv = analysis?.inventory_insights;
  const cust = analysis?.customer_insights;

  const kpis = analysis
    ? [
        {
          label: "Total Revenue",
          value: s?.total_revenue != null ? `$${s.total_revenue.toLocaleString()}` : "—",
          detail: `${s?.total_quantity_sold ?? 0} units sold`,
          icon: TrendingUp,
        },
        {
          label: "Best Selling Product",
          value: s?.best_selling_product ?? "—",
          detail: `Avg rating: ${s?.average_rating ?? "—"}`,
          icon: ArrowUpRight,
        },
        {
          label: "Low Stock Items",
          value: String(inv?.low_stock_products.length ?? 0),
          detail: `${inv?.fast_moving_products.length ?? 0} fast-moving products`,
          icon: Boxes,
        },
      ]
    : mockKpis;

  const alerts = analysis
    ? Array.from(new Set(inv?.low_stock_products ?? [])).map((p) => `${p} is low on stock.`)
    : mockAlerts;

  // Transform sales forecast data for Recharts
  const chartData = useMemo(() => {
    if (!analysis?.sales_forecast) return [];
    const f = analysis.sales_forecast;
    if (f.error) return [];
    
    const data: any[] = [];
    const hDates = f.historical_dates || [];
    const hValues = f.historical_values || [];
    const fDates = f.forecast_dates || [];
    const fValues = f.forecast_values || [];

    // Historical points
    for (let i = 0; i < hDates.length; i++) {
      data.push({
        date: hDates[i],
        Revenue: hValues[i],
        Forecast: null,
      });
    }

    // Connect forecast to last historical point if it exists
    if (data.length > 0 && fValues.length > 0) {
      data[data.length - 1].Forecast = data[data.length - 1].Revenue;
    }

    // Forecast points
    for (let i = 0; i < fDates.length; i++) {
      data.push({
        date: fDates[i],
        Revenue: null,
        Forecast: fValues[i],
      });
    }

    return data;
  }, [analysis]);

  return (
    <section className="space-y-6 w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col gap-3"
      >
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-secondary/20 bg-secondary/10 px-3 py-1 text-xs tracking-[0.18em] text-secondary uppercase font-semibold">
          <Lightbulb className="size-3.5" />
          Results preview
        </div>
        <h2 className="font-display text-3xl tracking-tight text-primary sm:text-4xl">
          {analysis ? "Your AI Business Analysis" : "Reusable analytics modules, ready for live data"}
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-on-surface-variant sm:text-base">
          {analysis
            ? "Live insights generated from your uploaded CSV data."
            : "These cards use mock business data now, but the structure is already prepared for KPI summaries, AI recommendations, inventory alerts, and richer chart components later."}
        </p>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid gap-4 lg:grid-cols-3">
        {kpis.map(({ label, value, detail, icon: Icon }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: index * 0.08, ease: "easeOut" }}
            className="rounded-3xl border border-outline-variant bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-on-surface-variant">{label}</p>
                <p className="mt-3 text-3xl font-bold text-primary">{value}</p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container">
                <Icon className="size-5" strokeWidth={1.6} />
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-on-surface-variant">{detail}</p>
          </motion.div>
        ))}
      </div>

      {/* Customer Sentiment Insights */}
      {analysis && cust && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="grid gap-4 sm:grid-cols-3"
        >
          <div className="rounded-3xl border border-outline-variant bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-on-surface-variant font-semibold">Positive Reviews</p>
            <p className="mt-3 text-3xl font-bold text-emerald-600">{cust.positive_reviews ?? 0}</p>
            {cust.top_positive_keywords && cust.top_positive_keywords.length > 0 && (
              <p className="mt-2 text-xs text-on-surface-variant">Keywords: {cust.top_positive_keywords.slice(0, 3).join(", ")}</p>
            )}
          </div>
          <div className="rounded-3xl border border-outline-variant bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-on-surface-variant font-semibold">Negative Reviews</p>
            <p className="mt-3 text-3xl font-bold text-rose-600">{cust.negative_reviews ?? 0}</p>
            {cust.top_negative_keywords && cust.top_negative_keywords.length > 0 && (
              <p className="mt-2 text-xs text-on-surface-variant">Keywords: {cust.top_negative_keywords.slice(0, 3).join(", ")}</p>
            )}
          </div>
          <div className="rounded-3xl border border-outline-variant bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-on-surface-variant font-semibold">Overall Sentiment Score</p>
            <p className="mt-3 text-3xl font-bold text-primary">{(cust.overall_sentiment ?? 0).toFixed(2)}</p>
            <p className="mt-2 text-xs text-on-surface-variant">Range from -1.0 (negative) to +1.0 (positive)</p>
          </div>
        </motion.div>
      )}

      {/* Chart Section */}
      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-3xl border border-outline-variant bg-white p-6 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-xl font-semibold text-primary font-display flex items-center gap-2">
                <TrendingUp className="size-5 text-secondary" />
                Sales Trend & AI Forecast
              </h3>
              <p className="mt-1 text-sm text-on-surface-variant">
                Historical sales and machine learning predictive 7-day revenue trend.
              </p>
            </div>
            <div className="rounded-full border border-outline-variant bg-surface px-3 py-1 text-xs tracking-[0.18em] text-on-surface-variant uppercase font-semibold">
              {analysis?.sales_forecast ? "Live Forecast Model" : "Mock Data"}
            </div>
          </div>

          <div className="h-72 w-full min-w-0">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary, #01261f)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--color-primary, #01261f)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-secondary, #2a9d8f)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="var(--color-secondary, #2a9d8f)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFF",
                      borderRadius: "12px",
                      border: "1px solid #E5E7EB",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area
                    name="Historical Sales ($)"
                    type="monotone"
                    dataKey="Revenue"
                    stroke="var(--color-primary, #01261f)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                  <Area
                    name="AI Predicted Sales ($)"
                    type="monotone"
                    dataKey="Forecast"
                    stroke="var(--color-secondary, #2a9d8f)"
                    strokeDasharray="5 5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorForecast)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              // Fallback / Mock Chart
              <div className="h-full flex items-end gap-3 rounded-2xl border border-outline-variant bg-surface p-4">
                {[36, 48, 44, 68, 74, 88, 82, 96].map((height, idx) => (
                  <div
                    key={idx}
                    className="flex-1 rounded-t-lg bg-gradient-to-t from-primary/80 to-primary/60"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Inventory & Alerts */}
        <div className="grid gap-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
            className="rounded-3xl border border-outline-variant bg-white p-6 shadow-sm"
          >
            <h3 className="text-xl font-semibold text-primary font-display flex items-center gap-2">
              <FileText className="size-5 text-secondary" />
              Operational Recommendations
            </h3>
            <div className="mt-5 space-y-4">
              {analysis ? (
                <div className="rounded-2xl border border-outline-variant bg-surface p-4 max-h-56 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm leading-6 text-on-surface-variant font-body">
                    {analysis.recommendations}
                  </pre>
                </div>
              ) : (
                mockRecommendations.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-outline-variant bg-surface p-4"
                  >
                    <p className="font-semibold text-primary">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                      {item.body}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
            className="rounded-3xl border border-outline-variant bg-white p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <AlertTriangle className="size-5" strokeWidth={1.6} />
              </div>
              <h3 className="text-xl font-semibold text-primary font-display">
                Inventory Alerts
              </h3>
            </div>
            <div className="mt-5 space-y-3">
              {alerts.length > 0 ? (
                alerts.map((alert, idx) => (
                  <div
                    key={`${alert}-${idx}`}
                    className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm leading-6 text-orange-800 font-medium"
                  >
                    {alert}
                  </div>
                ))
              ) : (
                <p className="text-sm text-on-surface-variant">All items are at stable inventory levels.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Customer Segmentation Cohorts */}
      {analysis && analysis.customer_segmentation && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="space-y-4 w-full"
        >
          <div className="flex items-center gap-3">
            <Users className="size-5 text-secondary" />
            <h3 className="text-xl font-semibold text-primary font-display">
              Machine Learning Customer Cohorts (K-Means Clustering)
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {Object.entries(analysis.customer_segmentation).map(([key, cohort]) => (
              <div key={key} className="rounded-3xl border border-outline-variant bg-white p-5 shadow-sm">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary mb-3">
                  {cohort.name}
                </span>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Size:</span>
                    <span className="font-semibold text-primary">{cohort.size} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Avg Spend / Rev:</span>
                    <span className="font-semibold text-primary">${cohort.avg_spent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Avg Purchase Freq:</span>
                    <span className="font-semibold text-primary">{cohort.avg_freq.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Avg Rating:</span>
                    <span className="font-semibold text-primary">{cohort.avg_rating.toFixed(2)} ★</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* CMO Growth Strategy Section */}
      {analysis && analysis.marketing_strategy && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-3xl border border-outline-variant bg-white p-6 shadow-sm w-full"
        >
          <div className="flex items-center gap-3 mb-4">
            <Compass className="size-5 text-secondary" />
            <h3 className="text-xl font-semibold text-primary font-display">
              AI Growth & Marketing Strategy (CMO Insights)
            </h3>
          </div>
          <div className="prose prose-sm max-w-none text-on-surface-variant">
            <div className="whitespace-pre-wrap text-sm leading-7 text-on-surface-variant font-body">
              {analysis.marketing_strategy}
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
}
