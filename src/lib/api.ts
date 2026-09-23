import type { Product } from "@/types";

/** Backend API base URL (client + SSR). Set NEXT_PUBLIC_API_URL in production. */
export function getApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  if (typeof window !== "undefined") {
    const { hostname, protocol } = window.location;
    const isLocal =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      /^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) ||
      /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname);

    if (isLocal) {
      return `${protocol}//${hostname}:3001`;
    }
  }

  return "http://localhost:3001";
}

/** Static assets shipped with the Next.js app (bratherHoodFront/public/images/). */
const FRONTEND_STATIC_IMAGES = new Set([
  "/images/logo-bh.png",
  "/images/logo-full.png",
  "/images/product-front.png",
  "/images/product-back.png",
  "/images/team-1.jpg",
  "/images/team-2.jpg",
  "/images/team-3.jpg",
]);

function isFrontendStaticImage(path: string): boolean {
  return FRONTEND_STATIC_IMAGES.has(path.toLowerCase());
}

/**
 * Resolve a product photo path to a browser-loadable URL.
 * - Static catalog files → served by Next.js (/images/…)
 * - Admin uploads (multer) → served by Express backend (NEXT_PUBLIC_API_URL/images/…)
 */
export function getImageUrl(photoPath: string | null | undefined): string {
  if (!photoPath) return "";
  if (photoPath.startsWith("http://") || photoPath.startsWith("https://")) {
    return photoPath;
  }

  const path = photoPath.startsWith("/") ? photoPath : `/${photoPath}`;

  if (!path.startsWith("/images/")) {
    return "";
  }

  if (isFrontendStaticImage(path)) {
    return path;
  }

  return `${getApiBaseUrl()}${path}`;
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

async function parseJson<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const text = await res.text();
    console.error("API returned non-JSON response:", text);
    throw new Error(`Erreur API: Réponse non-JSON reçue (${res.status})`);
  }
  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      typeof data.message === "string" ? data.message : "Request failed"
    );
  }
  return data as T;
}

export async function fetchArticles(): Promise<Article[]> {
  const res = await fetch(`${getApiBaseUrl()}/article/getAll`, {
    method: "POST",
    cache: "no-store",
  });
  const data = await parseJson<Article[]>(res);
  return data.map(normalizeArticle);
}

export async function fetchArticleById(id: number): Promise<Article | null> {
  const res = await fetch(`${getApiBaseUrl()}/article/getById`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
    cache: "no-store",
  });

  if (res.status === 404) return null;
  const data = await parseJson<Article>(res);
  return normalizeArticle(data);
}

export async function fetchProducts(): Promise<Product[]> {
  const articles = await fetchArticles();
  return articles.map((article, index) => articleToProduct(article, index < 3));
}

export async function createArticle(formData: FormData): Promise<void> {
  const res = await fetch(`${getApiBaseUrl()}/article/ajouter`, {
    method: "POST",
    body: formData,
  });
  await parseJson(res);
}

export async function updateArticle(formData: FormData): Promise<void> {
  const res = await fetch(`${getApiBaseUrl()}/article/update`, {
    method: "POST",
    body: formData,
  });
  await parseJson(res);
}

/** JSON update (same pattern as /comonde/update) — no new photo file */
export async function updateArticleJson(payload: {
  id: number;
  prix: string | number;
  description: string;
  photo?: string;
}): Promise<void> {
  const res = await fetch(`${getApiBaseUrl()}/article/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: payload.id,
      prix: payload.prix,
      description: payload.description,
      existingPhoto: payload.photo,
    }),
  });
  await parseJson(res);
}

export async function deleteArticle(id: number): Promise<void> {
  const res = await fetch(`${getApiBaseUrl()}/article/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  await parseJson(res);
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
  const baseUrl = getApiBaseUrl();

  const fetchCount = async (path: string): Promise<number> => {
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return typeof data.count === "number" ? data.count : Number(data.count || 0);
    } catch (error) {
      console.error(`Error fetching from ${path}:`, error);
      return 0;
    }
  };

  const [pending, confirmed, delivered, cancelled, totalRevenue] = await Promise.all([
    fetchCount("/comonde/comondeCount/enattente"),
    fetchCount("/comonde/comondeCount/confirmee"),
    fetchCount("/comonde/comondeCount/livree"),
    fetchCount("/comonde/CountComondeAnnulee"),
    fetchCount("/comonde/prixTotal"),
  ]);

  const totalCommandes = pending + confirmed + delivered + cancelled;

  return {
    pending,
    confirmed,
    delivered,
    cancelled,
    totalRevenue,
    totalCommandes,
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
  const baseUrl = getApiBaseUrl();

  const fetchList = async (path: string): Promise<ComondeBackend[]> => {
    try {
      const res = await fetch(`${baseUrl}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      if (res.status === 404) return [];
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error(`Error fetching list from ${path}:`, error);
      return [];
    }
  };

  const [enAttente, confirmees, livrees, annulees] = await Promise.all([
    fetchList("/comonde/getComondeEnAttente"),
    fetchList("/comonde/getComondeConfirmee"),
    fetchList("/comonde/getComondeLivree"),
    fetchList("/comonde/getComondeAnnulee"),
  ]);

  const combined = [...enAttente, ...confirmees, ...livrees, ...annulees];
  return combined.sort((a, b) => b.id - a.id);
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

/** Public checkout — notifies Telegram via Next.js API (no Express backend). */
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

export async function fetchComondeById(id: number): Promise<ComondeBackend | null> {
  const res = await fetch(`${getApiBaseUrl()}/comonde/getById`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
    cache: "no-store",
  });

  if (res.status === 404) return null;
  return parseJson<ComondeBackend>(res);
}

export async function updateComonde(payload: {
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
  const res = await fetch(`${getApiBaseUrl()}/comonde/update`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await parseJson<{ comonde: ComondeBackend }>(res);
  return data.comonde;
}

export async function deleteComonde(id: number): Promise<void> {
  const res = await fetch(`${getApiBaseUrl()}/comonde/delete`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  await parseJson(res);
}

