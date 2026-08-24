import { Location } from "history";
import { ProductCollection } from "../enums/product.enum";

/**
 * NavLink decides "active" from the pathname alone — the query string is not
 * part of the match. Dogs and Cats both point at /products, so both lit up at
 * once. This narrows it to the collection actually being shown.
 *
 * Usage:  isActive={collectionIsActive(ProductCollection.DOG)}
 */
export const collectionIsActive =
  (collection: ProductCollection) =>
  (_match: unknown, location: Location): boolean =>
    location.pathname === "/products" &&
    new URLSearchParams(location.search).get("collection") === collection;
