import React from "react";
import { createRoot } from "react-dom/client";
import useBasket from "./useBasket";
import { ProductCollection } from "../../../lib/enums/product.enum";
import { CartItem } from "../../../lib/types/search";

// React 18.3 exports act; the installed @types/react (18.2) does not list it
// yet, and the react-dom/test-utils version is deprecated.
const { act } = React as unknown as { act: (callback: () => void) => void };

// Tells React 18 that updates are wrapped in act() on purpose.
(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;

type Basket = ReturnType<typeof useBasket>;

/**
 * Renders the hook in a throwaway component and exposes its latest value.
 * Uses createRoot directly: the installed Testing Library (v9) still calls the
 * React 17 ReactDOM.render API.
 */
const renderBasket = () => {
  const result = {} as { current: Basket };
  const Harness = () => {
    result.current = useBasket();
    return null;
  };
  act(() => {
    createRoot(document.createElement("div")).render(<Harness />);
  });
  return result;
};

const dog: CartItem = {
  _id: "dog",
  name: "Bichon",
  image: "",
  price: 100000,
  quantity: 1,
  productCollection: ProductCollection.DOG,
};
const toy: CartItem = {
  _id: "toy",
  name: "Ball",
  image: "",
  price: 5000,
  quantity: 1,
  productCollection: ProductCollection.ACCESSORY,
};

const stored = () => JSON.parse(localStorage.getItem("cartData") ?? "null");

beforeEach(() => localStorage.clear());

describe("useBasket", () => {
  it("starts from the basket saved in localStorage", () => {
    localStorage.setItem("cartData", JSON.stringify([toy]));
    const basket = renderBasket();
    expect(basket.current.cartItems).toEqual([toy]);
  });

  it("adds an item and saves the basket", () => {
    const basket = renderBasket();
    act(() => basket.current.onAdd(toy));
    expect(basket.current.cartItems).toEqual([toy]);
    expect(stored()).toEqual([toy]);
  });

  it("never holds two of the same pet", () => {
    const basket = renderBasket();
    act(() => basket.current.onAdd(dog));
    act(() => basket.current.onAdd(dog));
    expect(basket.current.cartItems).toEqual([dog]);
  });

  it("increases the quantity of an accessory added again", () => {
    const basket = renderBasket();
    act(() => basket.current.onAdd(toy));
    act(() => basket.current.onAdd(toy));
    expect(basket.current.cartItems[0].quantity).toBe(2);
  });

  it("decreases the quantity, then removes the line at one", () => {
    const basket = renderBasket();
    act(() => basket.current.onAdd(toy));
    act(() => basket.current.onAdd(toy));
    act(() => basket.current.onRemove(toy));
    expect(basket.current.cartItems[0].quantity).toBe(1);

    act(() => basket.current.onRemove(toy));
    expect(basket.current.cartItems).toEqual([]);
  });

  it("deletes one line, or everything", () => {
    const basket = renderBasket();
    act(() => basket.current.onAdd(dog));
    act(() => basket.current.onAdd(toy));

    act(() => basket.current.onDelete(dog));
    expect(basket.current.cartItems).toEqual([toy]);

    act(() => basket.current.onDeleteAll());
    expect(basket.current.cartItems).toEqual([]);
    expect(stored()).toBeNull();
  });
});
