import Link from "next/link";
import { cn } from "@/lib/utils";

type LandingButtonProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
};

export function LandingButton({
  children,
  href = "#",
  className,
  variant = "primary",
  size = "md",
}: LandingButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full font-medium transition-colors";

  const variants = {
    primary:
      "bg-[var(--landing-olive)] text-white hover:bg-[var(--landing-olive-hover)]",
    secondary:
      "bg-[var(--landing-sage-light)] text-[var(--landing-text)] hover:bg-[var(--landing-sage)]",
  };

  const sizes = {
    sm: "px-5 py-2 text-sm",
    md: "px-6 py-2.5 text-sm",
    lg: "px-10 py-3.5 text-base",
  };

  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
    >
      {children}
    </Link>
  );
}
