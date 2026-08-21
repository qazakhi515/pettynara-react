import { ProductCollection } from "../enums/product.enum";

export interface CartItem {
  _id: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  /** Which shelf the line came from. Optional because carts saved in
   *  localStorage before this field existed do not carry it — see
   *  `isUniquePet` in lib/utils/cart.ts for how those are treated. */
  productCollection?: ProductCollection;
}
