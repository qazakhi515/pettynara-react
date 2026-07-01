import { useEffect, useRef, useState } from "react";
import { isFavorite, persistFavorite, subscribeFavorites } from "./favStore";
import {
  sweetTopSmallSuccessAlert,
  sweetFailureProvider,
} from "../../../lib/sweetAlert";
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
      // persist (localStorage today; swap for a backend call later)
      persistFavorite(id, next);
      onToggle?.(next);
      sweetTopSmallSuccessAlert(
        next ? "Added to favorites ❤️" : "Removed from favorites",
        1200
      );
    } catch (err) {
      // rollback on error
      setFav(prev);
      persistFavorite(id, prev);
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
