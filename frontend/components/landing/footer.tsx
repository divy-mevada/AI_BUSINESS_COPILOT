import Link from "next/link";
import { LandingShell } from "./landing-shell";

const footerLinks = [
  { label: "About us", href: "#about" },
  { label: "How it works", href: "#features" },
  { label: "Pricing", href: "#pricing" },
];

export function Footer() {
  return (
    <footer className="w-full border-t border-neutral-100 bg-white">
      <LandingShell className="flex min-h-[250px] flex-col justify-between gap-10 py-10">
        <nav className="flex flex-wrap gap-8">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[var(--landing-text)] transition-colors hover:text-[var(--landing-olive)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-neutral-100 pt-8 sm:flex-row sm:items-center">
          <Link
            href="/landing"
            className="text-xs font-bold tracking-[0.2em] text-[var(--landing-text)] uppercase"
          >
            AI Copilot
          </Link>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--landing-text-muted)]">
            <span>© {new Date().getFullYear()} AI Business Copilot</span>
            <Link href="#" className="hover:text-[var(--landing-text)]">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-[var(--landing-text)]">
              Terms of Service
            </Link>
          </div>
        </div>
      </LandingShell>
    </footer>
  );
}
