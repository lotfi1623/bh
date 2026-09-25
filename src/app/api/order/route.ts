import { NextResponse } from "next/server";
import { getTelegramEnv } from "@/lib/telegram-env";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type OrderItemPayload = {
  productId: string;
  productName: string;
  size: string;
  color?: string;
  quantity: number;
  unitPrice: number;
};

type OrderPayload = {
  name: string;
  phone: string;
  wilaya: string;
  baladia: string;
  deliveryType: "home" | "desk";
  items: OrderItemPayload[];
  subtotal: number;
  shipping: number;
  total: number;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatOrderMessage(order: OrderPayload, reference: string): string {
  const deliveryLabel =
    order.deliveryType === "home" ? "Livraison à domicile" : "Stop Desk";

  const lines = order.items.map(
    (item, index) =>
      `${index + 1}. <b>${escapeHtml(item.productName)}</b>\n` +
      `   ID: ${escapeHtml(item.productId)} · Taille: ${escapeHtml(item.size)}` +
      (item.color ? ` · ${escapeHtml(item.color)}` : "") +
      `\n   Qté: ${item.quantity} × ${item.unitPrice} DA = ${item.quantity * item.unitPrice} DA`
  );

  return (
    `🛒 <b>Nouvelle commande BrotherHood</b>\n` +
    `Réf: <code>${escapeHtml(reference)}</code>\n\n` +
    `<b>Client</b>\n` +
    `Nom: ${escapeHtml(order.name)}\n` +
    `Tél: ${escapeHtml(order.phone)}\n` +
    `Wilaya: ${escapeHtml(order.wilaya)}\n` +
    `Commune: ${escapeHtml(order.baladia)}\n` +
    `Livraison: ${deliveryLabel}\n\n` +
    `<b>Articles</b>\n${lines.join("\n\n")}\n\n` +
    `Sous-total: ${order.subtotal} DA\n` +
    `Livraison: ${order.shipping} DA\n` +
    `<b>Total: ${order.total} DA</b>\n` +
    `Paiement: à la livraison (COD)`
  );
}

function isValidOrder(body: unknown): body is OrderPayload {
  if (!body || typeof body !== "object") return false;
  const o = body as Record<string, unknown>;
  if (typeof o.name !== "string" || o.name.trim().length < 2) return false;
  if (typeof o.phone !== "string" || o.phone.trim().length < 9) return false;
  if (typeof o.wilaya !== "string" || !o.wilaya.trim()) return false;
  if (typeof o.baladia !== "string" || !o.baladia.trim()) return false;
  if (o.deliveryType !== "home" && o.deliveryType !== "desk") return false;
  if (!Array.isArray(o.items) || o.items.length === 0) return false;
  if (typeof o.subtotal !== "number" || typeof o.shipping !== "number" || typeof o.total !== "number") {
    return false;
  }

  return o.items.every((item) => {
    if (!item || typeof item !== "object") return false;
    const i = item as Record<string, unknown>;
    return (
      typeof i.productId === "string" &&
      typeof i.productName === "string" &&
      typeof i.size === "string" &&
      typeof i.quantity === "number" &&
      i.quantity > 0 &&
      typeof i.unitPrice === "number"
    );
  });
}

export async function POST(request: Request) {
  try {
    const { token, chatId } = getTelegramEnv();

    const body: unknown = await request.json();
    if (!isValidOrder(body)) {
      return NextResponse.json(
        { success: false, error: "Invalid order payload." },
        { status: 400 }
      );
    }

    const reference = `BH-${Date.now().toString().slice(-8)}`;
    const text = formatOrderMessage(body, reference);

    const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });

    const telegramData = (await telegramRes.json()) as { ok?: boolean; description?: string };

    if (!telegramRes.ok || !telegramData.ok) {
      console.error("Telegram sendMessage failed:", telegramData);
      return NextResponse.json(
        {
          success: false,
          error: telegramData.description ?? "Failed to send order notification.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, reference });
  } catch (error) {
    console.error("POST /api/order error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
