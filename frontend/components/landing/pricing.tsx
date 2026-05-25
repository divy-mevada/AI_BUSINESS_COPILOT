import { Check } from "lucide-react";
import { LandingButton } from "./landing-buttons";
import { LandingShell, SerifHeading } from "./landing-shell";

const plans = [
  {
    name: "Basic",
    features: [
      "Up to 3 dashboards",
      "Monthly reports",
      "Email support",
      "Core analytics",
      "1 team member",
    ],
  },
  {
    name: "Advanced",
    features: [
      "Unlimited dashboards",
      "Real-time data sync",
      "Priority support",
      "AI insights",
      "Up to 10 team members",
      "Custom integrations",
    ],
  },
  {
    name: "Enterprise",
    features: [
      "Everything in Advanced",
      "Dedicated account manager",
      "Custom AI models",
      "SSO & advanced security",
      "Unlimited team members",
      "SLA guarantee",
    ],
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="w-full bg-white py-20">
      <LandingShell className="flex flex-col items-center gap-12">
        <div className="max-w-xl text-center">
          <p className="mb-3 text-sm font-medium tracking-wide text-[var(--landing-text-muted)] uppercase">
            Benefits
          </p>
          <SerifHeading className="mb-4 text-4xl sm:text-5xl">
            Why Choose AI Copilot?
          </SerifHeading>
          <p className="mb-6 text-base leading-relaxed text-[var(--landing-text-muted)]">
            Flexible plans that grow with your business. Start free and upgrade
            when you&apos;re ready.
          </p>
          <LandingButton href="#connect" variant="secondary" size="sm">
            Get started
          </LandingButton>
        </div>

        <div className="grid w-full grid-cols-1 gap-0 border-t border-[var(--landing-sage)] md:grid-cols-3">
          {plans.map((plan, planIndex) => (
            <div
              key={plan.name}
              className={`flex flex-col gap-0 ${planIndex > 0 ? "md:border-l md:border-[var(--landing-sage)]" : ""}`}
            >
              <div className="border-b border-[var(--landing-sage)] py-5 text-center">
                <h3 className="text-sm font-semibold tracking-wide text-[var(--landing-text)] uppercase">
                  {plan.name}
                </h3>
              </div>
              {plan.features.map((feature, i) => (
                <div
                  key={feature}
                  className={`flex items-center gap-3 border-b border-[var(--landing-sage)] px-6 py-4 ${i === plan.features.length - 1 ? "border-b-0 md:border-b" : ""}`}
                >
                  <Check className="size-4 shrink-0 text-[var(--landing-olive)]" strokeWidth={2} />
                  <span className="text-sm text-[var(--landing-text-muted)]">{feature}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </LandingShell>
    </section>
  );
}
