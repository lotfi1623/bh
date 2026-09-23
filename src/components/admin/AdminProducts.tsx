"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, ImagePlus, Loader2, Pencil, Trash2, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import {
  type Article,
  createArticle,
  deleteArticle,
  fetchArticleById,
  fetchArticles,
  getArticleDescription,
  getArticleId,
  getImageUrl,
  updateArticle,
  updateArticleJson,
} from "@/lib/api";
import { cn, formatPrice } from "@/lib/utils";

type FormState = {
  prix: string;
  description: string;
};

const emptyForm: FormState = { prix: "", description: "" };

export function AdminProducts() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [editing, setEditing] = useState<Article | null>(null);
  const [viewing, setViewing] = useState<Article | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchArticles();
      setArticles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  useEffect(() => {
    return () => {
      if (photoPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [photoPreview]);

  const resetForm = () => {
    setForm(emptyForm);
    setPhotoFile(null);
    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(null);
    setEditing(null);
  };

  const handlePhotoChange = (file: File | null) => {
    if (photoPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoFile(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleView = async (article: Article) => {
    const articleId = getArticleId(article);
    setViewLoading(true);
    setError(null);
    try {
      const fresh = await fetchArticleById(articleId);
      setViewing(fresh ?? article);
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load product");
      setViewing(article);
    } finally {
      setViewLoading(false);
    }
  };

  const handleEdit = (article: Article) => {
    setViewing(null);
    setEditing(article);
    setForm({
      prix: String(article.prix),
      description: getArticleDescription(article),
    });
    setPhotoFile(null);
    setPhotoPreview(article.photo ? getImageUrl(article.photo) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (editing) {
        const articleId = getArticleId(editing);

        if (photoFile) {
          const formData = new FormData();
          formData.append("id", String(articleId));
          formData.append("prix", form.prix);
          formData.append("description", form.description);
          if (editing.photo) formData.append("existingPhoto", editing.photo);
          formData.append("photo", photoFile);
          await updateArticle(formData);
        } else {
          await updateArticleJson({
            id: articleId,
            prix: form.prix,
            description: form.description,
            photo: editing.photo,
          });
        }
      } else {
        if (!photoFile) {
          throw new Error("Veuillez choisir une photo");
        }
        const formData = new FormData();
        formData.append("prix", form.prix);
        formData.append("description", form.description);
        formData.append("photo", photoFile);
        await createArticle(formData);
      }

      resetForm();
      setViewing(null);
      await loadArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (article: Article) => {
    if (!window.confirm("Supprimer ce produit ?")) return;

    const articleId = getArticleId(article);
    setError(null);
    try {
      await deleteArticle(articleId);
      if (editing && getArticleId(editing) === articleId) resetForm();
      if (viewing && getArticleId(viewing) === articleId) setViewing(null);
      await loadArticles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  return (
    <AdminShell title="Produits">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        <section className="xl:col-span-4 rounded-xl border border-white/8 bg-[#111111] p-5 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl tracking-wide text-white">
              {editing ? "Modifier le produit" : "Ajouter un produit"}
            </h2>
            {editing && (
              <button
                type="button"
                onClick={resetForm}
                className="text-muted hover:text-white transition-colors"
                aria-label="Annuler"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs tracking-[0.2em] uppercase text-muted mb-2">
                Photo
              </label>
              <label className="flex flex-col items-center justify-center gap-3 border border-dashed border-white/15 rounded-lg p-6 cursor-pointer hover:border-white/30 transition-colors">
                {photoPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoPreview}
                    alt="Aperçu"
                    className="h-40 w-full object-contain rounded"
                  />
                ) : (
                  <>
                    <ImagePlus className="h-8 w-8 text-muted" />
                    <span className="text-xs text-muted text-center">
                      Cliquez pour choisir une image
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  className="hidden"
                  onChange={(e) =>
                    handlePhotoChange(e.target.files?.[0] ?? null)
                  }
                />
              </label>
              {!editing && (
                <p className="mt-2 text-[11px] text-muted">
                  JPG, PNG, GIF ou WEBP — max 5 Mo
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="prix"
                className="block text-xs tracking-[0.2em] uppercase text-muted mb-2"
              >
                Prix (DZD)
              </label>
              <input
                id="prix"
                type="number"
                min="0"
                step="1"
                required
                value={form.prix}
                onChange={(e) => setForm((f) => ({ ...f, prix: e.target.value }))}
                className="w-full border border-white/8 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-white/25"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-xs tracking-[0.2em] uppercase text-muted mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                required
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                className="w-full border border-white/8 bg-[#0a0a0a] px-4 py-3 text-sm text-white outline-none focus:border-white/25 resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 text-xs tracking-[0.2em] uppercase font-medium hover:bg-white/90 disabled:opacity-50 transition-colors"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {editing ? "Enregistrer" : "Ajouter le produit"}
            </button>
          </form>
        </section>

        <div className="xl:col-span-8 space-y-6">
          {viewing && (
            <section className="rounded-xl border border-white/8 bg-[#111111] overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                <h2 className="font-display text-xl tracking-wide text-white">
                  Détail du produit
                </h2>
                <button
                  type="button"
                  onClick={() => setViewing(null)}
                  className="text-muted hover:text-white transition-colors"
                  aria-label="Fermer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {viewLoading ? (
                <div className="flex items-center justify-center py-16 text-muted">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : (
                <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-black">
                    {viewing.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={getImageUrl(viewing.photo)}
                        alt="Produit"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="h-full w-full bg-white/5" />
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1">
                        ID
                      </p>
                      <p className="text-white font-medium">{getArticleId(viewing)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-1">
                        Prix
                      </p>
                      <p className="text-2xl text-white font-display tracking-wide">
                        {formatPrice(Number(viewing.prix), "fr")}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] tracking-[0.25em] uppercase text-muted mb-2">
                        Description
                      </p>
                      <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap">
                        {getArticleDescription(viewing) || "—"}
                      </p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(viewing)}
                        className="inline-flex items-center gap-2 border border-white/15 px-4 py-2 text-xs tracking-[0.15em] uppercase text-white hover:bg-white/5"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(viewing)}
                        className="inline-flex items-center gap-2 border border-red-500/30 px-4 py-2 text-xs tracking-[0.15em] uppercase text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}

          <section className="rounded-xl border border-white/8 bg-[#111111] overflow-hidden">
            <div className="px-5 py-4 border-b border-white/8">
              <h2 className="font-display text-xl tracking-wide text-white">
                Catalogue
              </h2>
              <p className="mt-1 text-xs text-muted">
                {articles.length} produit{articles.length !== 1 ? "s" : ""} — cliquez
                sur une ligne pour voir le détail
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20 text-muted">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : articles.length === 0 ? (
              <p className="py-20 text-center text-sm text-muted">
                Aucun produit. Ajoutez le premier via le formulaire.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/8 text-xs text-muted uppercase tracking-wider">
                      <th className="px-5 py-3 font-medium">Photo</th>
                      <th className="px-5 py-3 font-medium">Description</th>
                      <th className="px-5 py-3 font-medium">Prix</th>
                      <th className="px-5 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {articles.map((article) => {
                      const articleId = getArticleId(article);
                      const isActive =
                        viewing !== null && getArticleId(viewing) === articleId;

                      return (
                        <tr
                          key={articleId}
                          onClick={() => handleView(article)}
                          className={cn(
                            "border-b border-white/5 cursor-pointer transition-colors",
                            isActive
                              ? "bg-white/[0.06]"
                              : "hover:bg-white/[0.02]"
                          )}
                        >
                          <td className="px-5 py-3">
                            {article.photo ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={getImageUrl(article.photo)}
                                alt=""
                                className="h-14 w-14 object-cover rounded border border-white/10 bg-black"
                              />
                            ) : (
                              <div className="h-14 w-14 rounded border border-white/10 bg-black/50" />
                            )}
                          </td>
                          <td className="px-5 py-3 text-white max-w-xs truncate">
                            {getArticleDescription(article)}
                          </td>
                          <td className="px-5 py-3 text-white tabular-nums">
                            {formatPrice(Number(article.prix), "fr")}
                          </td>
                          <td className="px-5 py-3">
                            <div
                              className="flex items-center justify-end gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => handleView(article)}
                                className="p-2 text-muted hover:text-white transition-colors"
                                aria-label="Voir"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEdit(article)}
                                className="p-2 text-muted hover:text-white transition-colors"
                                aria-label="Modifier"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(article)}
                                className="p-2 text-muted hover:text-red-400 transition-colors"
                                aria-label="Supprimer"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminShell>
  );
}
