import Link from "next/link";
import { LandingButton } from "./landing-buttons";
import { LandingShell } from "./landing-shell";

const navLinks = [
  { label: "About us", href: "#about" },
  { label: "How it works", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Our services", href: "#services" },
];

export function Navbar() {
  return (
    <header className="w-full bg-white">
      <LandingShell
        as="div"
        className="flex h-[148px] items-center justify-between gap-6"
      >
        <Link
          href="/landing"
          className="shrink-0 text-sm font-bold tracking-[0.2em] text-[var(--landing-text)] uppercase"
        >
          AI Copilot
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--landing-text)] transition-colors hover:text-[var(--landing-olive)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <LandingButton href="#connect" size="sm" className="shrink-0">
          Get started
        </LandingButton>
      </LandingShell>
    </header>
  );
}
