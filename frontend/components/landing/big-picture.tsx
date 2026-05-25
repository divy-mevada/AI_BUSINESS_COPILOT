import Image from "next/image";
import { Check } from "lucide-react";
import { LandingButton } from "./landing-buttons";
import { LandingShell, SerifHeading } from "./landing-shell";

const checklist = [
  "Unified view of all your business data",
  "AI-generated insights and recommendations",
  "Customizable dashboards for every team",
  "Export and share reports effortlessly",
];

export function BigPicture() {
  return (
    <section id="about" className="w-full bg-white py-20">
      <LandingShell className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          <SerifHeading className="text-4xl sm:text-5xl">
            See the Big Picture
          </SerifHeading>
          <p className="text-base leading-relaxed text-[var(--landing-text-muted)]">
            Stop juggling spreadsheets and disconnected tools. AI Business
            Copilot brings your entire operation into focus so you can make
            smarter decisions, faster.
          </p>
          <ul className="flex flex-col gap-4">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--landing-sage)]">
                  <Check className="size-3 text-[var(--landing-olive)]" strokeWidth={2.5} />
                </span>
                <span className="text-sm text-[var(--landing-text)]">{item}</span>
              </li>
            ))}
          </ul>
          <div>
            <LandingButton href="#features" variant="secondary" size="sm">
              Learn more
            </LandingButton>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--landing-radius)] bg-[var(--landing-tan)]">
          <Image
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80"
            alt="Abstract minimal shapes"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 560px"
          />
        </div>
      </LandingShell>
    </section>
  );
}
