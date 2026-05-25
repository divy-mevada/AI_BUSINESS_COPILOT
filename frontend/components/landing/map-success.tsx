import Image from "next/image";
import { LandingButton } from "./landing-buttons";
import { LandingShell, SerifHeading } from "./landing-shell";

const steps = [
  {
    number: "01",
    title: "Connect your data",
    description:
      "Link your existing tools and import spreadsheets in minutes — no engineering required.",
  },
  {
    number: "02",
    title: "Get AI insights",
    description:
      "Our copilot analyzes your data and surfaces actionable recommendations tailored to your goals.",
  },
  {
    number: "03",
    title: "Grow with confidence",
    description:
      "Track progress, share reports with your team, and make decisions backed by real data.",
  },
];

export function MapSuccess() {
  return (
    <section className="w-full bg-white py-20">
      <LandingShell className="flex flex-col gap-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <SerifHeading className="text-4xl sm:text-5xl">
            Map Your Success
          </SerifHeading>
          <LandingButton href="#connect" variant="secondary" size="sm">
            Get started
          </LandingButton>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col gap-4">
              <span className="font-[family-name:var(--font-playfair)] text-6xl text-neutral-200">
                {step.number}
              </span>
              <h3 className="text-base font-semibold text-[var(--landing-text)]">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--landing-text-muted)]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="relative aspect-[16/7] w-full overflow-hidden rounded-[var(--landing-radius)]">
          <Image
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80"
            alt="Aerial view of winding road through green hills"
            fill
            className="object-cover"
            sizes="1200px"
          />
        </div>
      </LandingShell>
    </section>
  );
}
