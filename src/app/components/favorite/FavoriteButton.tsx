import { useEffect, useRef, useState } from "react";
import { isFavorite, subscribeFavorites, toggleFavorite } from "./favStore";
import {
  sweetTopSmallSuccessAlert,
  sweetFailureProvider,
} from "../../../lib/sweetAlert";
import { Messages } from "../../../lib/config";
import { useGlobals } from "../hooks/useGlobals";
import "../../../css/pettynara-favorite.css";

interface FavoriteButtonProps {
  id: string;
  /** extra class for positioning inside a card (e.g. "pet-fav") */
  className?: string;
  onToggle?: (fav: boolean) => void;
}

export default function FavoriteButton({
  id,
  className = "",
  onToggle,
}: FavoriteButtonProps) {
  const { authMember } = useGlobals();
  const [fav, setFav] = useState<boolean>(() => isFavorite(id));
  const [busy, setBusy] = useState<boolean>(false);
  const [pop, setPop] = useState<boolean>(false);
  const lockRef = useRef<boolean>(false);

  // keep in sync across all buttons / tabs
  useEffect(() => {
    setFav(isFavorite(id));
    return subscribeFavorites(() => setFav(isFavorite(id)));
  }, [id]);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // A like belongs to an account. The server rejects anonymous calls too —
    // this only saves the round trip and explains why nothing happened.
    if (!authMember) {
      sweetFailureProvider(Messages.error2, true);
      return;
    }

    // spam / double-click guard
    if (lockRef.current || busy) return;
    lockRef.current = true;
    setBusy(true);

    const prev = fav;
    const next = !prev;

    // instant optimistic feedback + pop animation
    setFav(next);
    setPop(true);
    window.setTimeout(() => setPop(false), 300);

    try {
      const settled = await toggleFavorite(id);
      setFav(settled);
      onToggle?.(settled);
      sweetTopSmallSuccessAlert(
        settled ? "Added to favorites ❤️" : "Removed from favorites",
        1200,
      );
    } catch (err) {
      // rollback on error — the server state never changed
      setFav(prev);
      sweetFailureProvider("Couldn't update favorites — try again");
    } finally {
      window.setTimeout(() => {
        setBusy(false);
        lockRef.current = false;
      }, 350);
    }
  };

  return (
    <button
      type="button"
      className={`fav-btn ${className} ${fav ? "on" : ""} ${pop ? "pop" : ""}`}
      onClick={handleClick}
      disabled={busy}
      aria-pressed={fav}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
    >
      {fav ? "❤️" : "🤍"}
    </button>
  );
}
