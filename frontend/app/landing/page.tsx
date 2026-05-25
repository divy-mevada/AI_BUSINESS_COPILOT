import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { BigPicture } from "@/components/landing/big-picture";
import { Pricing } from "@/components/landing/pricing";
import { Testimonial } from "@/components/landing/testimonial";
import { MapSuccess } from "@/components/landing/map-success";
import { Connect } from "@/components/landing/connect";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <main className="min-h-[6000px]">
        <Features />
        <BigPicture />
        <Pricing />
        <Testimonial />
        <MapSuccess />
        <Connect />
      </main>
      <Footer />
    </div>
  );
}
