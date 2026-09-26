import type { Product } from "@/types";

/** Main tee — home CTAs go here instead of /shop */
export const PRIMARY_PRODUCT_PATH = "/product/1";

export const products: Product[] = [
  {
    id: "1",
    slug: "bh-heavyweight-tee-black",
    name: "BH Heavyweight Tee",
    description:
      "Conçu pour les barres, fait pour la rue. Coton heavyweight 220 GSM avec un tombé structuré. Marque BH distressed sur le cœur. Full lockup Brother Hood dans le dos. Le tee qui a lancé la Brotherhood.",
    price: 2500,
    category: "tees",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Noir", hex: "#0a0a0a" }],
    images: [
      "/images/brotherhood-tee-mockup.png",
      "/images/brotherhood-tee-worn.png",
    ],
    tags: ["bestseller", "new"],
    featured: true,
    specs: {
      material: "100% Coton peigné",
      weight: "220 GSM",
      fit: "Coupe Confort Relâchée",
      printing: "Sérigraphie Haute Densité",
    },
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getRelatedProducts(slug: string, limit = 4): Product[] {
  return products.filter((p) => p.slug !== slug).slice(0, limit);
}

export const sizeChart = [
  { size: "S", height: "69", width: "51" },
  { size: "M", height: "71", width: "54" },
  { size: "L", height: "74", width: "57" },
  { size: "XL", height: "76", width: "60" },
  { size: "XXL", height: "78", width: "63" },
];

export const NAV_LINKS = [
  { href: "/", labelKey: "home" as const },
  { href: "/shop", labelKey: "shop" as const },
  { href: "/#story", labelKey: "story" as const },
  { href: "/#packaging", labelKey: "packaging" as const },
];
