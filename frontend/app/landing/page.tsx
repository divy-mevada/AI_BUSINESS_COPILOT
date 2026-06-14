"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Navbar Scroll Transition Effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Reveal-on-Scroll Intersection Observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-active");
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal");
    revealElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, []);

  // Smooth Scrolling for Anchors
  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body selection:bg-secondary-container selection:text-primary bg-background text-on-background">
      
      {/* Navigation Header */}
      <nav
        id="main-nav"
        className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-margin-mobile md:px-margin-desktop ${
          isScrolled ? "py-4" : "py-6"
        }`}
      >
        <div
          id="nav-container"
          className={`max-w-container-max mx-auto flex justify-between items-center transition-all duration-500 rounded-full px-8 py-3 ${
            isScrolled ? "glass-nav" : "bg-transparent"
          }`}
        >
          {/* Brand Logo */}
          <Link href="/landing" className="font-display text-2xl font-bold tracking-tight text-primary">
            Lumina AI
          </Link>
          
          {/* Main Navigation Links */}
          <div className="hidden md:flex items-center gap-10">
            <a
              className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              onClick={(e) => handleAnchorClick(e, "features")}
              href="#features"
            >
              Features
            </a>
            <a
              className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              onClick={(e) => handleAnchorClick(e, "solutions")}
              href="#solutions"
            >
              Solutions
            </a>
            <a
              className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              onClick={(e) => handleAnchorClick(e, "pricing")}
              href="#pricing"
            >
              Pricing
            </a>
            <Link
              className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors"
              href="/upload"
            >
              Dashboard
            </Link>
          </div>
          
          {/* Auth Actions */}
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-medium text-on-surface-variant hover:text-primary transition-all"
            >
              Login
            </Link>
            
            <Link
              href="/signup"
              className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-opacity-90 transition-all mirror-shine shadow-lg shadow-primary/10"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {/* Hero Section */}
        <section className="relative pt-44 pb-32 overflow-hidden">
          <div className="texture-bg absolute inset-0 pointer-events-none"></div>
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-secondary-container/20 rounded-full blur-[120px] -z-10"></div>
          
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop relative">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              
              {/* Left Column: Title & Intro */}
              <div className="w-full lg:w-1/2 space-y-10 reveal active">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-secondary-container/30 border border-secondary-container/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse"></span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">
                    Intelligent Growth
                  </span>
                </div>
                
                <h1 className="font-display text-6xl md:text-8xl leading-[1.05] text-primary tracking-tighter">
                  GROW <br /> <span className="italic font-normal">WITH</span> US!
                </h1>
                
                <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-xl font-light">
                  Harness the power of Editorial Intelligence to transform your data into visionary strategies. A platform where technology meets sophisticated design.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-5">
                  <Link
                    href="/signup"
                    className="bg-primary text-on-primary px-10 py-5 rounded-full font-semibold text-base hover:shadow-2xl hover:shadow-primary/20 transition-all mirror-shine text-center"
                  >
                    Start Your Journey
                  </Link>
                  
                  <Link
                    href="/signup"
                    className="flex items-center justify-center gap-3 px-10 py-5 rounded-full font-semibold text-base border border-outline hover:bg-white transition-all text-primary"
                  >
                    <span className="material-symbols-outlined text-xl">play_circle</span>
                    View Demo
                  </Link>
                </div>
              </div>
              
              {/* Right Column: Layered Dashboard Graphic */}
              <div className="w-full lg:w-1/2 relative reveal active transition-delay-200">
                <div className="relative z-10 p-4 bg-white/40 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-surface-container-high relative">
                    <img
                      alt="Dashboard Preview"
                      className="w-full h-full object-cover mix-blend-multiply opacity-90"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwn4lG52LeNzB7wxsjcc7iVq0-QGezNy5gmm6cQSGrXexerIuDm4bfg5RkTOvePaFH6KTxg5veyHdv-WKr8AXq2IxHId_FrqoKWb_DpFlMhwlPM_tKDZEmScu1rHr6LQRjjv95K5GzQd9lbSbGBhQcKg9V_Qsj6duW-0te9hQcKfZynmK_A0FrUYVw7nJJ08lNqx9pMeTE2g5_fpGjDd9iQvfV3xk-jugqeW_-_52SUBOSZruzIkyXqpfO81pcg3x9BakgT6qg7IbN"
                    />
                    {/* Abstract Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent"></div>
                  </div>
                </div>
                
                {/* Floating Accents */}
                <div
                  className="absolute -top-10 -right-10 bg-secondary-container text-on-secondary-container px-6 py-8 rounded-2xl shadow-xl z-20 animate-bounce"
                  style={{ animationDuration: "4s" }}
                >
                  <span className="material-symbols-outlined block mb-2 text-3xl">trending_up</span>
                  <div className="text-3xl font-display">+124%</div>
                  <div className="text-[10px] uppercase font-bold tracking-widest opacity-60">Growth Rate</div>
                </div>
                
                <div className="absolute -bottom-6 -left-10 bg-primary text-white p-8 rounded-2xl shadow-2xl z-20 hidden md:block">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-display">89ms</div>
                    <div className="text-[10px] uppercase font-bold tracking-widest opacity-70 leading-tight">
                      Latency
                      <br />
                      Response
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Features / Solutions Section */}
        <section id="features" className="py-40 bg-surface relative">
          <div id="solutions" className="absolute top-0 left-0 w-full h-1/2 pointer-events-none" />
          
          <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
              
              {/* Left Sticky Header */}
              <div className="lg:col-span-4 lg:sticky lg:top-32 space-y-8 reveal">
                <h2 className="font-display text-5xl md:text-6xl text-primary leading-tight">
                  Powerful Insights, <span className="italic font-normal">Simplified.</span>
                </h2>
                <p className="text-on-surface-variant text-lg font-light leading-relaxed">
                  We&apos;ve cracked the code on enterprise intelligence. Our tools provide clarity where there&apos;s complexity, allowing you to focus on the vision.
                </p>
                <div className="pt-4">
                  <Link
                    href="/signup"
                    className="inline-flex items-center gap-2 font-semibold text-primary group"
                  >
                    Explore all features
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
              
              {/* Right Scrollable Feature List */}
              <div className="lg:col-span-7 lg:col-start-6 flex flex-col gap-32">
                
                {/* Feature 1 */}
                <div className="reveal group">
                  <div className="flex flex-col md:flex-row gap-12 items-start">
                    <div className="font-display text-8xl text-primary/5 select-none leading-none">01</div>
                    <div className="space-y-6">
                      <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-3xl">sensors</span>
                      </div>
                      <h3 className="font-display text-3xl text-primary">Real-time Data Stream</h3>
                      <p className="text-on-surface-variant leading-relaxed font-light text-lg">
                        Continuous streams of intelligence, processed instantly to give you the competitive edge in every micro-moment. No more waiting for end-of-day reports.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Feature 2 */}
                <div className="reveal group transition-delay-100">
                  <div className="flex flex-col md:flex-row gap-12 items-start">
                    <div className="font-display text-8xl text-primary/5 select-none leading-none">02</div>
                    <div className="space-y-6">
                      <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-3xl">psychology</span>
                      </div>
                      <h3 className="font-display text-3xl text-primary">Predictive Neural Analytics</h3>
                      <p className="text-on-surface-variant leading-relaxed font-light text-lg">
                        AI-driven patterns that reveal the hidden narratives within your metrics, transforming noise into strategic clarity and forward-looking action.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Feature 3 */}
                <div className="reveal group transition-delay-200">
                  <div className="flex flex-col md:flex-row gap-12 items-start">
                    <div className="font-display text-8xl text-primary/5 select-none leading-none">03</div>
                    <div className="space-y-6">
                      <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary border border-outline-variant">
                        <span className="material-symbols-outlined text-3xl">auto_graph</span>
                      </div>
                      <h3 className="font-display text-3xl text-primary">Editorial Reporting</h3>
                      <p className="text-on-surface-variant leading-relaxed font-light text-lg">
                        Grade-A reporting that prioritizes white space and legibility. Beautiful, intuitive charts that make complex data easy to digest and share with stakeholders.
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Pricing Section (Immersive CTA) */}
        <section id="pricing" className="py-20 px-margin-mobile md:px-margin-desktop reveal">
          <div className="max-w-container-max mx-auto relative group overflow-hidden rounded-3xl md:rounded-[4rem] bg-primary-container text-white py-32 px-10 md:px-20 text-center">
            
            {/* Background Decoration */}
            <div className="absolute inset-0 texture-bg opacity-10"></div>
            <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-secondary-container/10 blur-[150px] rounded-full"></div>
            
            <div className="relative z-10 space-y-12 max-w-4xl mx-auto">
              <h2 className="font-display text-5xl md:text-7xl leading-tight">
                Ready to scale your <span className="italic font-normal">intelligence?</span>
              </h2>
              <p className="text-on-primary-container text-xl md:text-2xl font-light max-w-2xl mx-auto opacity-80">
                Join 5,000+ forward-thinking teams using Lumina to power their next chapter of growth.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <Link
                  href="/signup"
                  className="bg-secondary-fixed text-on-secondary-fixed px-12 py-6 rounded-full font-bold text-lg hover:bg-secondary-container transition-all mirror-shine shadow-2xl shadow-black/20 text-center"
                >
                  Get Started Free
                </Link>
                
                <Link
                  href="/signup"
                  className="bg-white/5 border border-white/20 backdrop-blur-sm text-white px-12 py-6 rounded-full font-bold text-lg hover:bg-white/10 transition-all text-center"
                >
                  Schedule a Demo
                </Link>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low border-t border-outline-variant py-24 px-margin-mobile md:px-margin-desktop mt-20">
        <div className="max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8">
            
            {/* Branding Column */}
            <div className="col-span-1 md:col-span-2 space-y-8">
              <div className="font-display text-4xl font-bold text-primary">Lumina AI</div>
              <p className="text-on-surface-variant text-lg font-light max-w-md">
                The intersection of editorial design and artificial intelligence. We build the future of sophisticated data visualization.
              </p>
              <div className="flex gap-4">
                <a
                  className="w-10 h-10 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:text-white transition-all text-primary"
                  href="#"
                >
                  <span className="material-symbols-outlined text-sm">public</span>
                </a>
                <a
                  className="w-10 h-10 rounded-full border border-outline flex items-center justify-center hover:bg-primary hover:text-white transition-all text-primary"
                  href="#"
                >
                  <span className="material-symbols-outlined text-sm">mail</span>
                </a>
              </div>
            </div>
            
            {/* Resources Column */}
            <div className="space-y-6">
              <h4 className="font-semibold text-primary uppercase tracking-widest text-xs">Resources</h4>
              <ul className="space-y-4 text-on-surface-variant font-light">
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary transition-colors">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Platform Column */}
            <div className="space-y-6">
              <h4 className="font-semibold text-primary uppercase tracking-widest text-xs">Platform</h4>
              <ul className="space-y-4 text-on-surface-variant font-light">
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    API Documentation
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Changelog
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary transition-colors" href="#">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>

          </div>
          
          {/* Copyright & Subtitle */}
          <div className="mt-20 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-on-surface-variant font-light">
            <p>© {new Date().getFullYear()} Lumina Intelligence. All rights reserved.</p>
            <p>Designed with Precision & Clarity.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
