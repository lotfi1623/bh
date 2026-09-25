/**
 * Prints Telegram chat IDs from recent messages to your bot.
 * 1. Set TELEGRAM_BOT_TOKEN in .env.local
 * 2. Open @lotfimerah_bot (or your bot) in Telegram and send any message
 * 3. Run: npm run telegram:chat-id
 * 4. Copy the chat id into TELEGRAM_CHAT_ID in .env.local and restart `npm run dev`
 */

import { readFileSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  try {
    const raw = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* .env.local optional */
  }
}

loadEnvLocal();

const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
if (!token) {
  console.error("Missing TELEGRAM_BOT_TOKEN in .env.local");
  process.exit(1);
}

const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
const data = await res.json();

if (!data.ok) {
  console.error("Telegram API error:", data.description ?? data);
  process.exit(1);
}

const chats = new Map();
for (const update of data.result ?? []) {
  const msg = update.message ?? update.edited_message;
  if (!msg?.chat) continue;
  const { id, type, username, first_name, last_name, title } = msg.chat;
  chats.set(id, {
    id,
    type,
    label: title ?? [first_name, last_name].filter(Boolean).join(" ") ?? username ?? String(id),
    username: username ? `@${username}` : "",
  });
}

if (chats.size === 0) {
  console.log("No messages yet.");
  console.log("Open your bot in Telegram, tap Start, send « hello », then run this script again.");
  process.exit(0);
}

console.log("Use one of these as TELEGRAM_CHAT_ID in .env.local:\n");
for (const chat of chats.values()) {
  console.log(`  ${chat.id}  (${chat.type}${chat.username ? ` ${chat.username}` : ""} — ${chat.label})`);
}
