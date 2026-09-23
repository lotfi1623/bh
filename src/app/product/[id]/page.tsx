import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductClient } from "@/components/product/ProductClient";
import {
  articleToProduct,
  fetchArticleById,
  fetchArticles,
  getImageUrl,
  getArticleDescription,
} from "@/lib/api";

type Props = { params: Promise<{ id: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const article = await fetchArticleById(Number(id));
  if (!article) return { title: "Product" };

  const name =
    getArticleDescription(article).split("\n")[0]?.trim().slice(0, 60) ||
    `Brother Hood #${article.id}`;

  return {
    title: name,
    description: getArticleDescription(article),
    openGraph: {
      title: name,
      description: getArticleDescription(article),
      images: article.photo ? [{ url: getImageUrl(article.photo) }] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const article = await fetchArticleById(Number(id));

  if (!article) notFound();

  const product = articleToProduct(article);
  const allArticles = await fetchArticles();
  const related = allArticles
    .filter((item) => item.id !== article.id)
    .slice(0, 4)
    .map((item) => articleToProduct(item));

  return <ProductClient product={product} related={related} />;
}
