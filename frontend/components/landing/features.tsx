import Image from "next/image";
import { BarChart3, LineChart, PieChart, TrendingUp } from "lucide-react";
import { LandingShell, SerifHeading } from "./landing-shell";

const features = [
  {
    icon: LineChart,
    title: "Real-time Data",
    description:
      "Monitor your business metrics as they happen with live dashboards and instant alerts.",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description:
      "AI-powered insights surface trends and opportunities you might otherwise miss.",
  },
  {
    icon: PieChart,
    title: "Visual Reports",
    description:
      "Beautiful, intuitive charts make complex data easy to understand at a glance.",
  },
  {
    icon: TrendingUp,
    title: "Growth Tracking",
    description:
      "Set goals, track progress, and celebrate milestones with clear performance views.",
  },
];

export function Features() {
  return (
    <section id="features" className="w-full bg-white py-20">
      <LandingShell className="flex flex-col items-center gap-12">
        <div className="max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium tracking-wide text-[var(--landing-text-muted)] uppercase">
            Features
          </p>
          <SerifHeading className="mb-4 text-4xl sm:text-5xl">
            We&apos;ve cracked the code.
          </SerifHeading>
          <p className="text-base leading-relaxed text-[var(--landing-text-muted)]">
            Everything you need to understand, optimize, and grow your business
            — in one intelligent platform built for modern teams.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex flex-col gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[var(--landing-sage-muted)]">
                <Icon className="size-5 text-[var(--landing-olive)]" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-semibold text-[var(--landing-text)]">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--landing-text-muted)]">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="relative aspect-[16/7] w-full overflow-hidden rounded-[var(--landing-radius)]">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80"
            alt="Mountain landscape"
            fill
            className="object-cover"
            sizes="1200px"
          />
        </div>
      </LandingShell>
    </section>
  );
}
