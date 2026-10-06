import { calcTotals, SHIPPING_FEE } from "./price";
import { CartItem } from "../types/search";

const item = (price: number, quantity: number): CartItem => ({
  _id: `${price}-${quantity}`,
  name: "item",
  image: "",
  price,
  quantity,
});

describe("calcTotals", () => {
  it("adds shipping below the free-shipping threshold", () => {
    expect(calcTotals([item(30, 2)])).toEqual({
      itemsPrice: 60,
      shippingCost: SHIPPING_FEE,
      totalPrice: 60 + SHIPPING_FEE,
    });
  });

  it("ships for free from the threshold up", () => {
    expect(calcTotals([item(100000, 1), item(5000, 2)])).toEqual({
      itemsPrice: 110000,
      shippingCost: 0,
      totalPrice: 110000,
    });
  });

  it("charges only shipping for an empty basket", () => {
    expect(calcTotals([]).totalPrice).toBe(SHIPPING_FEE);
  });
});
