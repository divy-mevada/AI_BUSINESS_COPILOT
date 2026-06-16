"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

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
        { label: "Total Revenue", value: s?.total_revenue != null ? `$${s.total_revenue.toLocaleString()}` : "—", detail: `${s?.total_quantity_sold ?? 0} units sold`, icon: TrendingUp },
        { label: "Best Selling Product", value: s?.best_selling_product ?? "—", detail: `Avg rating: ${s?.average_rating ?? "—"}`, icon: ArrowUpRight },
        { label: "Low Stock Items", value: String(inv?.low_stock_products.length ?? 0), detail: `${inv?.fast_moving_products.length ?? 0} fast-moving products`, icon: Boxes },
      ]
    : mockKpis;

  const alerts = analysis
    ? (inv?.low_stock_products ?? []).map((p) => `${p} is low on stock.`)
    : mockAlerts;

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

      {analysis && cust && (
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="grid gap-4 sm:grid-cols-3"
        >
          <div className="rounded-3xl border border-outline-variant bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-on-surface-variant">Positive Reviews</p>
            <p className="mt-3 text-3xl font-bold text-primary">{cust.positive_reviews ?? 0}</p>
          </div>
          <div className="rounded-3xl border border-outline-variant bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-on-surface-variant">Negative Reviews</p>
            <p className="mt-3 text-3xl font-bold text-primary">{cust.negative_reviews ?? 0}</p>
          </div>
          <div className="rounded-3xl border border-outline-variant bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-on-surface-variant">Overall Sentiment</p>
            <p className="mt-3 text-3xl font-bold text-primary">{cust.overall_sentiment ?? 0}</p>
            {cust.top_positive_keywords && cust.top_positive_keywords.length > 0 && (
              <p className="mt-2 text-xs text-on-surface-variant">{cust.top_positive_keywords.join(", ")}</p>
            )}
          </div>
        </motion.div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-3xl border border-outline-variant bg-white p-6 shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-primary font-display">
                Chart placeholders
              </h3>
              <p className="mt-1 text-sm text-on-surface-variant">
                Revenue trend, category split, and demand signals.
              </p>
            </div>
            <div className="rounded-full border border-outline-variant bg-surface px-3 py-1 text-xs tracking-[0.18em] text-on-surface-variant uppercase font-semibold">
              Mock data
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-outline-variant bg-surface p-4">
              <div className="flex h-56 items-end gap-3">
                {[36, 48, 44, 68, 74, 88, 82, 96].map((height) => (
                  <div
                    key={height}
                    className="flex-1 rounded-t-lg bg-gradient-to-t from-primary/80 to-primary/60"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-outline-variant bg-surface p-4 flex flex-col items-center justify-center">
              <div className="relative mx-auto mt-2 size-44 rounded-full border-4 border-surface bg-conic-gradient" style={{ background: "conic-gradient(#01261f 0% 68%, #c5eadf 68% 100%)" }}>
                <div className="absolute inset-5 rounded-full bg-surface" />
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div>
                    <p className="text-2xl font-bold text-primary">68%</p>
                    <p className="text-xs tracking-[0.18em] text-on-surface-variant uppercase font-semibold">
                      Top category
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid gap-4">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.45, delay: 0.05, ease: "easeOut" }}
            className="rounded-3xl border border-outline-variant bg-white p-6 shadow-sm"
          >
            <h3 className="text-xl font-semibold text-primary font-display">
              Recommendation cards
            </h3>
            <div className="mt-5 space-y-4">
              {analysis ? (
                <div className="rounded-2xl border border-outline-variant bg-surface p-4">
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
                Inventory alerts
              </h3>
            </div>
            <div className="mt-5 space-y-3">
              {alerts.length > 0 ? alerts.map((alert) => (
                <div
                  key={alert}
                  className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm leading-6 text-orange-800 font-medium"
                >
                  {alert}
                </div>
              )) : (
                <p className="text-sm text-on-surface-variant">No low stock alerts.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
