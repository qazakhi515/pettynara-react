/**
 * Favorite store — shared like/favorite state.
 * Persists to localStorage and syncs every FavoriteButton via a custom event.
 * Structured so the persist step can later call a backend API without
 * changing the button UI.
 */

const KEY = "pettynara_favorites";
const EVT = "pettynara-fav-change";

export function getFavorites(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id);
}

/** Persist the new state. Returns the resulting favorite flag. */
export function persistFavorite(id: string, fav: boolean): boolean {
  const list = getFavorites();
  const next = fav ? Array.from(new Set([...list, id])) : list.filter((x) => x !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVT));
  return fav;
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
export function favToast(message: string, type: "success" | "error" = "success") {
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
