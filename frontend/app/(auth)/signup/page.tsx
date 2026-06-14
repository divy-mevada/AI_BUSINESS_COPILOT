"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Registering with:", { email, password });
    // Authentication signup flow logic can be integrated here
    router.push("/upload");
  };

  return (
    <section className="flex-1 flex flex-col justify-center bg-surface px-margin-mobile md:px-margin-desktop py-12">
      <div className="max-w-md w-full mx-auto animate-fade-in-up">
        
        {/* Mobile Logo (Visible only on mobile screens) */}
        <div className="md:hidden mb-12">
          <Link
            href="/landing"
            className="font-[family-name:var(--font-libre-caslon)] text-[32px] leading-[40px] text-primary hover:opacity-90 transition-opacity"
          >
            Lumina AI
          </Link>
        </div>
        
        {/* Welcome Header */}
        <div className="mb-10">
          <h2 className="font-[family-name:var(--font-libre-caslon)] text-[48px] leading-[56px] text-primary mb-2">
            Start your journey
          </h2>
          <p className="text-[16px] leading-[24px] text-on-surface-variant">
            Join Lumina AI to experience intellectual copilotry.
          </p>
        </div>

        {/* Auth Form */}
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Email input field */}
          <div className="space-y-2">
            <label
              className="text-[12px] leading-[16px] font-semibold text-on-surface-variant block uppercase tracking-wider"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-[16px] leading-[24px]"
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {/* Password input field */}
          <div className="space-y-2">
            <label
              className="text-[12px] leading-[16px] font-semibold text-on-surface-variant block uppercase tracking-wider"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-[16px] leading-[24px]"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button
            className="w-full bg-primary text-on-primary py-4 rounded-lg font-semibold hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            type="submit"
          >
            Create Account
          </button>
        </form>

        {/* Divider */}
        <div className="my-10 flex items-center gap-4">
          <div className="h-[1px] flex-grow bg-outline-variant"></div>
          <span className="text-[12px] leading-[16px] font-semibold text-on-surface-variant">
            OR CONTINUE WITH
          </span>
          <div className="h-[1px] flex-grow bg-outline-variant"></div>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button className="flex items-center justify-center gap-2 border border-outline-variant bg-surface-container-lowest py-3 rounded-lg hover:bg-surface-container-low transition-colors group cursor-pointer text-on-surface">
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              ></path>
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              ></path>
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              ></path>
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              ></path>
            </svg>
            <span className="text-[16px] leading-[24px]">Google</span>
          </button>
          
          <button className="flex items-center justify-center gap-2 border border-outline-variant bg-surface-container-lowest py-3 rounded-lg hover:bg-surface-container-low transition-colors group cursor-pointer text-on-surface">
            <svg
              className="w-5 h-5 group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
            >
              <path
                d="M17.073 10.704c.007 2.453 1.996 3.27 2.016 3.28-.016.052-.314 1.077-1.037 2.132-.624.912-1.274 1.823-2.288 1.841-1.001.018-1.32-.593-2.46-.593-1.144 0-1.5.575-2.443.61-.986.037-1.74-.985-2.368-1.897-1.285-1.868-2.268-5.275-.94-7.585.659-1.146 1.834-1.873 3.102-1.891 1.01-.019 1.96.685 2.576.685.617 0 1.766-.867 2.97-.743.504.021 1.921.203 2.83 1.535-.073.045-1.688.983-1.67 2.926M13.01 4.31c.54-.657.904-1.57.804-2.483-.784.032-1.733.522-2.296 1.18-.504.582-.944 1.514-.824 2.408.875.067 1.776-.448 2.316-1.105"
                fill="currentColor"
              ></path>
            </svg>
            <span className="text-[16px] leading-[24px]">Apple</span>
          </button>
        </div>

        {/* Footer Toggle Text */}
        <div className="text-center">
          <p className="text-[16px] leading-[24px] text-on-surface-variant">
            <span>Already have an account?</span>
            <Link
              className="text-secondary font-semibold hover:text-primary transition-colors ml-1"
              href="/login"
            >
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </section>
  );
}
