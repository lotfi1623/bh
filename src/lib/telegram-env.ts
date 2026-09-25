/**
 * Telegram credentials for order notifications (server-only).
 * Override on the host with TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID when possible.
 * .env.local is local-only and is not deployed with git.
 */
export function getTelegramEnv(): { token: string; chatId: string } {
  const token =
    process.env.TELEGRAM_BOT_TOKEN?.trim() ||
    process.env.BOT_TOKEN?.trim() ||
    process.env.TELEGRAM_TOKEN?.trim() ||
    "8889800631:AAFNYmp9H1TrW1m1J0Yyn0J_XRZk60i1b4A";

  const chatId =
    process.env.TELEGRAM_CHAT_ID?.trim() ||
    process.env.CHAT_ID?.trim() ||
    process.env.TELEGRAM_CHAT?.trim() ||
    "6083516676";

  return { token, chatId };
}
