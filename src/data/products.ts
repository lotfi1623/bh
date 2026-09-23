import type { Product } from "@/types";

export const products: Product[] = [
  {
    id: "1",
    slug: "bh-heavyweight-tee-black",
    name: "BH Heavyweight Tee",
    description:
      "Conçu pour les barres, fait pour la rue. Coton heavyweight 220 GSM avec un tombé structuré. Marque BH distressed sur le cœur. Full lockup Brother Hood dans le dos. Le tee qui a lancé la Brotherhood.",
    price: 3000,
    category: "tees",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Noir", hex: "#0a0a0a" }],
    images: [
      "/images/product-front.png",
      "/images/product-back.png",
      "/images/team-3.jpg",
      "/images/team-2.jpg",
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
  {
    id: "2",
    slug: "bh-oversized-tee",
    name: "BH Oversized Tee",
    description:
      "Silhouette oversized avec le monogramme BH. Doux dès le premier jour. Pour les athlètes qui s'entraînent dur et s'habillent encore plus fort.",
    price: 4200,
    category: "tees",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Noir", hex: "#0a0a0a" }],
    images: [
      "/images/product-front.png",
      "/images/product-back.png",
      "/images/team-1.jpg",
    ],
    tags: ["new"],
    featured: true,
    specs: {
      material: "100% Coton",
      weight: "200 GSM",
      fit: "Oversized",
      printing: "Sérigraphie Discharge",
    },
  },
  {
    id: "3",
    slug: "bh-discipline-hoodie",
    name: "Discipline Heavy Hoodie",
    description:
      "Intérieur molleton brossé. Poche kangourou renforcée. Construit pour les matins tôt et les sessions tardives. DISCIPLINE imprimé dans le dos.",
    price: 7500,
    category: "hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Noir", hex: "#0a0a0a" }],
    images: ["/images/team-2.jpg", "/images/product-back.png", "/images/team-3.jpg"],
    tags: ["bestseller"],
    featured: true,
    specs: {
      material: "80% Coton / 20% Polyester",
      weight: "380 GSM",
      fit: "Coupe Relâchée",
      printing: "Sérigraphie Puff",
    },
  },
  {
    id: "4",
    slug: "bh-training-shorts",
    name: "BH Training Shorts",
    description:
      "Entrejambe 7\". Tissu stretch. Poche zippée. Conçu pour les sessions de calisthénie qui ne s'arrêtent pas à la barre.",
    price: 3800,
    category: "shorts",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Noir", hex: "#0a0a0a" }],
    images: ["/images/team-1.jpg", "/images/team-3.jpg"],
    tags: ["new"],
    featured: false,
    specs: {
      material: "92% Polyester / 8% Élasthanne",
      weight: "160 GSM",
      fit: "Athletic Slim",
      printing: "Logo Heat Transfer",
    },
  },
  {
    id: "5",
    slug: "bh-cap-black",
    name: "BH Structured Cap",
    description:
      "Casquette 6 panneaux structurée avec broderie BH tonale. Boucle métallique ajustable. Portée par la Brotherhood.",
    price: 2500,
    category: "accessories",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Noir", hex: "#0a0a0a" }],
    images: ["/images/team-3.jpg", "/images/team-2.jpg"],
    tags: [],
    featured: false,
    specs: {
      material: "100% Coton Twill",
      weight: "—",
      fit: "Taille Unique Ajustable",
      printing: "Broderie Tone-on-Tone",
    },
  },
  {
    id: "6",
    slug: "bh-crewneck",
    name: "Brotherhood Crewneck",
    description:
      "Crew French terry midweight. BH brodé sur la poitrine. Intérieur doux. La pièce du quotidien qui reste digne du gym.",
    price: 6500,
    category: "hoodies",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [{ name: "Noir", hex: "#0a0a0a" }],
    images: ["/images/team-1.jpg", "/images/product-front.png"],
    tags: ["new"],
    featured: true,
    specs: {
      material: "100% Coton French Terry",
      weight: "320 GSM",
      fit: "Regular Fit",
      printing: "Logo Brodé",
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
  { href: "/#community", labelKey: "community" as const },
];
