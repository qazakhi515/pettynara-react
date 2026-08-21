import { ProductCollection } from "../enums/product.enum";
import { CartItem } from "../types/search";

/** Live animals. Each listing is one individual pet, so a basket line for one
 *  can never be worth more than a single unit — unlike ACCESSORY stock. */
export const PET_COLLECTIONS: ProductCollection[] = [
  ProductCollection.DOG,
  ProductCollection.CAT,
  ProductCollection.BIRD,
  ProductCollection.FISH,
  ProductCollection.RABBIT,
];

/**
 * True when the line is a single, non-multipliable animal — the quantity
 * stepper is hidden for these and the quantity is pinned to 1.
 *
 * A line with no `productCollection` counts as a pet on purpose: those are
 * carts persisted before the field was added, and treating an unknown line as
 * an animal keeps the "never two of the same pet" rule intact. The cost is that
 * a legacy accessory line shows no stepper until it is re-added to the basket.
 */
export const isUniquePet = (item: CartItem): boolean =>
  item.productCollection === undefined ||
  PET_COLLECTIONS.includes(item.productCollection);
