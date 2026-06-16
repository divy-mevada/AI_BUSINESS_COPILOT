import { Inter, Libre_Caslon_Text } from "next/font/google";
import "../landing/landing.css";

const libreCaslon = Libre_Caslon_Text({
  variable: "--font-libre-caslon",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export default function UploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${libreCaslon.variable} ${inter.variable} min-h-screen flex flex-col font-[family-name:var(--font-inter)] bg-surface text-on-surface`}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      {children}
    </div>
  );
}
