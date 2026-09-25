import { products as catalogProducts } from "@/data/products";
import type { Product } from "@/types";

/** Resolve a product photo path to a browser-loadable URL (Next.js /public/images only). */
export function getImageUrl(photoPath: string | null | undefined): string {
  if (!photoPath) return "";
  if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) {
    return photoPath;
  }
  const path = photoPath.startsWith("/") ? photoPath : `/${photoPath}`;
  return path.startsWith("/images/") ? path : "";
}

export type Article = {
  id: number;
  idArticle?: number;
  photo: string;
  prix: number | string;
  descroption?: string;
  description?: string;
};

export function getArticleId(article: Article): number {
  return Number(article.idArticle ?? article.id ?? 0);
}

function normalizeArticle(article: Article): Article {
  const id = getArticleId(article);
  return { ...article, id, idArticle: id };
}

function productToArticle(product: Product): Article {
  return normalizeArticle({
    id: Number(product.id),
    photo: product.images[0] ?? "",
    prix: product.price,
    description: product.description,
  });
}

const DEFAULT_SIZES = ["S", "M", "L", "XL", "XXL"] as const;
const DEFAULT_COLORS = [{ name: "Noir", hex: "#0a0a0a" }];
const DEFAULT_SPECS = {
  material: "100% Coton peigné",
  weight: "220 GSM",
  fit: "Coupe Confort Relâchée",
  printing: "Sérigraphie Haute Densité",
};

export function getArticleDescription(article: Article): string {
  return article.description ?? article.descroption ?? "";
}

export function articleToProduct(article: Article, featured = false): Product {
  const description = getArticleDescription(article);
  const name =
    description.split("\n")[0]?.trim().slice(0, 60) ||
    `Brother Hood #${article.id}`;

  return {
    id: String(article.id),
    slug: String(article.id),
    name,
    description,
    price: Number(article.prix),
    category: "tees",
    sizes: [...DEFAULT_SIZES],
    colors: DEFAULT_COLORS,
    images: article.photo ? [getImageUrl(article.photo)] : [],
    tags: featured ? ["new"] : [],
    featured,
    specs: DEFAULT_SPECS,
  };
}

const CATALOG_READONLY =
  "Le catalogue est statique. Modifiez src/data/products.ts (plus de serveur backend).";

export async function fetchArticles(): Promise<Article[]> {
  return catalogProducts.map(productToArticle);
}

export async function fetchArticleById(id: number): Promise<Article | null> {
  const product = catalogProducts.find((p) => p.id === String(id));
  return product ? productToArticle(product) : null;
}

export async function fetchProducts(): Promise<Product[]> {
  return [...catalogProducts];
}

export async function createArticle(_formData: FormData): Promise<void> {
  throw new Error(CATALOG_READONLY);
}

export async function updateArticle(_formData: FormData): Promise<void> {
  throw new Error(CATALOG_READONLY);
}

export async function updateArticleJson(_payload: {
  id: number;
  prix: string | number;
  description: string;
  photo?: string;
}): Promise<void> {
  throw new Error(CATALOG_READONLY);
}

export async function deleteArticle(_id: number): Promise<void> {
  throw new Error(CATALOG_READONLY);
}

export function isCatalogImage(src: string): boolean {
  return src.includes("/images/") || src.startsWith("http");
}

export type ComondeStats = {
  pending: number;
  confirmed: number;
  delivered: number;
  cancelled: number;
  totalRevenue: number;
  totalCommandes: number;
};

export async function fetchComondeStats(): Promise<ComondeStats> {
  return {
    pending: 0,
    confirmed: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    totalCommandes: 0,
  };
}

export type ComondeBackend = {
  id: number;
  idArticle: number;
  nom: string;
  numero: number;
  taille: "S" | "M" | "L" | "XL" | "XXL";
  quantite: number;
  wilaya: string;
  baladia: string;
  etat: "en attente" | "confirmee" | "livree" | "annulee";
  created_at: string;
};

export async function fetchAllComondes(): Promise<ComondeBackend[]> {
  return [];
}

export type CustomerOrderPayload = {
  name: string;
  phone: string;
  wilaya: string;
  baladia: string;
  deliveryType: "home" | "desk";
  items: {
    productId: string;
    productName: string;
    size: string;
    color?: string;
    quantity: number;
    unitPrice: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
};

/** Public checkout — notifies Telegram via Next.js API route. */
export async function submitCustomerOrder(
  payload: CustomerOrderPayload
): Promise<{ reference: string }> {
  const res = await fetch("/api/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as {
    success?: boolean;
    reference?: string;
    error?: string;
  };

  if (!res.ok || !data.success || !data.reference) {
    throw new Error(data.error ?? "Impossible d'envoyer la commande.");
  }

  return { reference: data.reference };
}

export async function fetchComondeById(_id: number): Promise<ComondeBackend | null> {
  return null;
}

export async function updateComonde(_payload: {
  id: number;
  idArticle: number;
  nom: string;
  numero: string | number;
  taille: ComondeBackend["taille"];
  quantite: number;
  wilaya: string;
  baladia: string;
  etat: ComondeBackend["etat"];
}): Promise<ComondeBackend> {
  throw new Error("Gestion des commandes indisponible sans backend.");
}

export async function deleteComonde(_id: number): Promise<void> {
  throw new Error("Gestion des commandes indisponible sans backend.");
}
