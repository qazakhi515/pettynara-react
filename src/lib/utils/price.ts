import { CartItem } from "../types/search";

export const FREE_SHIPPING_THRESHOLD = 100;
export const SHIPPING_FEE = 5;

export const calcTotals = (items: CartItem[]) => {
  const itemsPrice: number = items.reduce(
    (a: number, c: CartItem) => a + c.quantity * c.price,
    0,
  );
  const shippingCost = itemsPrice < FREE_SHIPPING_THRESHOLD ? SHIPPING_FEE : 0;
  return { itemsPrice, shippingCost, totalPrice: itemsPrice + shippingCost };
};
