import { cn } from "@/lib/utils";

type LandingShellProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "header" | "main" | "footer" | "section";
  id?: string;
};

export function LandingShell({
  children,
  className,
  as: Tag = "div",
  id,
}: LandingShellProps) {
  return (
    <Tag
      id={id}
      className={cn("mx-auto w-full max-w-[1200px] px-6 lg:px-8", className)}
    >
      {children}
    </Tag>
  );
}

export function SerifHeading({
  children,
  className,
  as: Tag = "h2",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <Tag
      className={cn(
        "font-[family-name:var(--font-playfair)] font-normal tracking-tight text-[var(--landing-text)]",
        className
      )}
    >
      {children}
    </Tag>
  );
}
