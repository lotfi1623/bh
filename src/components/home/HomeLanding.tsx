import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { Story, FinalCTA } from "@/components/home/Story";
import { Packaging } from "@/components/home/Packaging";
import { InstagramSection } from "@/components/home/Instagram";

/** Shared landing content for / and /dashboard */
export function HomeLanding() {
  return (
    <>
      <Hero />
      <Features />
      <Story />
      <Packaging />
      <InstagramSection />
      <FinalCTA />
    </>
  );
}
