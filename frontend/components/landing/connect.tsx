import { LandingButton } from "./landing-buttons";
import { LandingShell, SerifHeading } from "./landing-shell";

export function Connect() {
  return (
    <section id="connect" className="w-full bg-white py-24">
      <LandingShell className="flex flex-col items-center gap-6 text-center">
        <SerifHeading className="text-4xl sm:text-5xl">
          Connect with us
        </SerifHeading>
        <p className="max-w-md text-base leading-relaxed text-[var(--landing-text-muted)]">
          Ready to transform how you run your business? Join thousands of teams
          already growing with AI Business Copilot.
        </p>
        <LandingButton href="#" size="lg" className="mt-2 min-w-[200px]">
          Join us
        </LandingButton>
      </LandingShell>
    </section>
  );
}
