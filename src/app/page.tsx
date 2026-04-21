import { Shell } from "@/components/layout/Shell";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { SpecsSection } from "@/components/sections/SpecsSection";
import { StorytellingSection } from "@/components/sections/StorytellingSection";

export default function Home() {
  return (
    <Shell>
      <Navbar />
      <HeroSection />
      <StorytellingSection />
      <SpecsSection />
      <Footer />
    </Shell>
  );
}
