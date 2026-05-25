import Image from "next/image";
import { LandingShell, SerifHeading } from "./landing-shell";

export function Hero() {
  return (
    <section className="w-full bg-white pb-16">
      <LandingShell className="flex min-h-[745px] flex-col items-center justify-center gap-10 pt-8">
        <SerifHeading
          as="h1"
          className="text-center text-5xl uppercase leading-tight sm:text-6xl lg:text-7xl"
        >
          Grow with us!
        </SerifHeading>

        <div className="relative w-full">
          <div
            className="relative mx-auto flex min-h-[420px] w-full items-center justify-center rounded-[var(--landing-radius)] bg-[var(--landing-sage)] px-6 py-12 sm:min-h-[480px]"
          >
            <div className="relative w-full max-w-[640px]">
              <div className="overflow-hidden rounded-2xl border-[10px] border-neutral-800 bg-neutral-900 shadow-2xl">
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
                    alt="Analytics dashboard preview"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, 640px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-white/90 p-3 backdrop-blur-sm">
                    <div className="flex h-16 items-end gap-1">
                      {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                        <div
                          key={i}
                          className="flex-1 rounded-sm bg-[var(--landing-olive)]"
                          style={{ height: `${h}%` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LandingShell>
    </section>
  );
}
