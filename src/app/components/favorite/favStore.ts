/**
 * Favorite store — shared like state, backed by the server.
 *
 * Likes belong to the member account, so the source of truth is the API. The
 * ids are mirrored into an in-memory Set that is loaded once per session:
 * `isFavorite` stays synchronous that way, which is what every FavoriteButton
 * already relies on, without each one having to fetch or await.
 *
 * localStorage is no longer where likes live. It is only read once, to hand
 * over anything a visitor collected before signing in (see `pendingGuestIds`).
 */

import { Product } from "../../../lib/types/product";
import LikeService from "../../services/LikeService";

const GUEST_KEY = "pettynara_favorites";
const EVT = "pettynara-fav-change";

/** Ids liked by the member currently signed in. Empty while logged out. */
let liked = new Set<string>();
let loaded = false;

const notify = () => window.dispatchEvent(new CustomEvent(EVT));

/* ------------------------------------------------------------------ *
 * Reads — synchronous, served from the cache
 * ------------------------------------------------------------------ */

export function getFavorites(): string[] {
  return Array.from(liked);
}

export function isFavorite(id: string): boolean {
  return liked.has(id);
}

export function favoritesLoaded(): boolean {
  return loaded;
}

/* ------------------------------------------------------------------ *
 * Session lifecycle
 * ------------------------------------------------------------------ */

/** Pull the member's likes into the cache. Called once after login/refresh. */
export async function loadFavorites(): Promise<void> {
  try {
    const products = await new LikeService().getMyLikes();
    liked = new Set(products.map((p: Product) => p._id));
    loaded = true;
    notify();
  } catch (err) {
    // A failed load must not look like "nothing is liked" forever — leave the
    // cache empty but unloaded so a later call can retry.
    console.log("loadFavorites failed:", err);
    loaded = false;
  }
}

export function clearFavorites(): void {
  liked = new Set();
  loaded = false;
  notify();
}

/* ------------------------------------------------------------------ *
 * Guest hand-over
 * ------------------------------------------------------------------ */

/** Ids this browser liked before anyone signed in, if any. */
export function pendingGuestIds(): string[] {
  try {
    const raw = localStorage.getItem(GUEST_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed)
      ? parsed.filter((x) => typeof x === "string")
      : [];
  } catch (e) {
    return [];
  }
}

/**
 * Move any guest likes onto the account, then load the merged list.
 * Safe to call on every login — it is a no-op when there is nothing pending.
 */
export async function adoptGuestFavorites(): Promise<void> {
  const ids = pendingGuestIds();
  try {
    if (ids.length) {
      const products = await new LikeService().syncLikes(ids);
      liked = new Set(products.map((p: Product) => p._id));
      loaded = true;
      localStorage.removeItem(GUEST_KEY);
      notify();
      return;
    }
  } catch (err) {
    // Keep the guest ids so the next login can try again.
    console.log("adoptGuestFavorites failed:", err);
  }
  await loadFavorites();
}

/* ------------------------------------------------------------------ *
 * Write
 * ------------------------------------------------------------------ */

/**
 * Toggle on the server and settle the cache from its answer.
 * Throws on failure so the caller can roll its optimistic state back.
 */
export async function toggleFavorite(id: string): Promise<boolean> {
  const { liked: nowLiked } = await new LikeService().toggleLike(id);
  if (nowLiked) liked.add(id);
  else liked.delete(id);
  notify();
  return nowLiked;
}

export function subscribeFavorites(cb: () => void): () => void {
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** Lightweight on-brand toast (no external deps). */
export function favToast(
  message: string,
  type: "success" | "error" = "success",
) {
  let host = document.getElementById("fav-toast-host");
  if (!host) {
    host = document.createElement("div");
    host.id = "fav-toast-host";
    host.className = "fav-toast-host";
    document.body.appendChild(host);
  }
  const el = document.createElement("div");
  el.className = `fav-toast ${type}`;
  const emoji = type === "success" ? "❤️" : "🐾";
  el.innerHTML = `<span class="ft-emoji">${emoji}</span><span class="ft-msg"></span>`;
  const msgEl = el.querySelector(".ft-msg");
  if (msgEl) msgEl.textContent = message;
  host.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  window.setTimeout(() => {
    el.classList.remove("show");
    window.setTimeout(() => el.remove(), 300);
  }, 1600);
}
