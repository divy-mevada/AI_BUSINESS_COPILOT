import { Inter, Libre_Caslon_Text } from "next/font/google";
import Link from "next/link";
import "./auth.css";
import { AtmosphericGradient } from "./atmospheric-gradient";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const libreCaslon = Libre_Caslon_Text({
  variable: "--font-libre-caslon",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${inter.variable} ${libreCaslon.variable} min-h-screen flex flex-col font-[family-name:var(--font-inter)] bg-surface text-on-background overflow-x-hidden`}
    >
      {/* Auth Shell Container */}
      <main className="flex-grow flex flex-col md:flex-row w-full max-w-container-max mx-auto md:min-h-screen overflow-hidden">
        
        {/* Left Section: Visual/Editorial */}
        <section className="hidden md:flex flex-1 relative bg-surface-container-low items-center justify-center p-margin-desktop overflow-hidden">
          {/* Atmospheric Pattern/Gradient component */}
          <AtmosphericGradient />
          
          <div className="relative z-10 max-w-md text-center">
            <div className="mb-12 inline-block">
              <Link
                href="/landing"
                className="font-[family-name:var(--font-libre-caslon)] text-[48px] leading-[56px] text-primary tracking-tight hover:opacity-90 transition-opacity"
              >
                Lumina AI
              </Link>
            </div>
            
            <h1 className="font-[family-name:var(--font-libre-caslon)] text-[72px] leading-[80px] text-primary mb-6 leading-tight tracking-[-0.02em]">
              Think deeper, act faster.
            </h1>
            
            <p className="text-[18px] leading-[28px] text-on-surface-variant mb-12">
              Experience the next generation of Editorial Intelligence. Our AI copilot refines your workflow with visionary clarity and sophisticated precision.
            </p>
            
            <div className="w-full h-80 relative rounded-xl overflow-hidden editorial-shadow">
              <img
                className="w-full h-full object-cover"
                alt="A sophisticated abstract 3D digital art piece with flowing organic shapes in shades of forest green, sage, and pale lime. The lighting is soft and ambient, creating a serene, intellectual atmosphere in a minimalist, high-key white space."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwn4lG52LeNzB7wxsjcc7iVq0-QGezNy5gmm6cQSGrXexerIuDm4bfg5RkTOvePaFH6KTxg5veyHdv-WKr8AXq2IxHId_FrqoKWb_DpFlMhwlPM_tKDZEmScu1rHr6LQRjjv95K5GzQd9lbSbGBhQcKg9V_Qsj6duW-0te9hQcKfZynmK_A0FrUYVw7nJJ08lNqx9pMeTE2g5_fpGjDd9iQvfV3xk-jugqeW_-_52SUBOSZruzIkyXqpfO81pcg3x9BakgT6qg7IbN"
              />
            </div>
          </div>
        </section>

        {/* Right Section: Auth Form Container (dynamic child routes) */}
        {children}
        
      </main>

      {/* Simple Micro-Footer */}
      <footer className="w-full bg-surface-container-low py-6 border-t border-outline-variant px-margin-mobile md:px-margin-desktop">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[12px] leading-[16px] font-semibold text-on-surface-variant uppercase tracking-wider">
            © 2024 Lumina Intelligence. All rights reserved.
          </span>
          <nav className="flex gap-6">
            <Link
              className="text-[12px] leading-[16px] font-semibold text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Privacy Policy
            </Link>
            <Link
              className="text-[12px] leading-[16px] font-semibold text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Terms of Service
            </Link>
            <Link
              className="text-[12px] leading-[16px] font-semibold text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Security
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
