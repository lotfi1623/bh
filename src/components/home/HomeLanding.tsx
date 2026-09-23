import { Hero } from "@/components/home/Hero";
import { Features } from "@/components/home/Features";
import { Story, FinalCTA } from "@/components/home/Story";
import { ProductShowcase } from "@/components/home/ProductShowcase";
import { Quality } from "@/components/home/Quality";
import { SizeGuide } from "@/components/home/SizeGuide";
import { ProductDetails } from "@/components/home/ProductDetails";
import { Community } from "@/components/home/Community";
import { InstagramSection } from "@/components/home/Instagram";

/** Shared landing content for / and /dashboard */
export function HomeLanding() {
  return (
    <>
      <Hero />
      <Features />
      <Story />
      <ProductShowcase />
      <Quality />
      <SizeGuide />
      <ProductDetails />
      <Community />
      <InstagramSection />
      <FinalCTA />
    </>
  );
}
