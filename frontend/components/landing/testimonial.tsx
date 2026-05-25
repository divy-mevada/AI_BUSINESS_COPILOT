import Image from "next/image";
import { LandingShell, SerifHeading } from "./landing-shell";

export function Testimonial() {
  return (
    <section id="services" className="w-full bg-white py-20">
      <LandingShell className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-[var(--landing-radius)] lg:max-w-none">
          <Image
            src="https://images.unsplash.com/photo-1509319117852-50f472a26612?auto=format&fit=crop&w=800&q=80"
            alt="Balanced stone spheres"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 560px"
          />
        </div>

        <blockquote className="flex flex-col gap-8">
          <SerifHeading
            as="h3"
            className="text-2xl leading-snug italic sm:text-3xl lg:text-4xl"
          >
            &ldquo;I was skeptical, but AI Copilot has completely transformed
            the way I manage my business. The data visualization is so clear
            and intuitive, and the platform is so easy to use. I can&apos;t
            imagine running my company without it.&rdquo;
          </SerifHeading>
          <footer>
            <p className="text-sm font-semibold text-[var(--landing-text)]">
              Sarah Mitchell
            </p>
            <p className="text-sm text-[var(--landing-text-muted)]">
              CEO, Horizon Ventures
            </p>
          </footer>
        </blockquote>
      </LandingShell>
    </section>
  );
}
