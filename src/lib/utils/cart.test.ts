import { isUniquePet } from "./cart";
import { ProductCollection } from "../enums/product.enum";
import { CartItem } from "../types/search";

const line = (productCollection?: ProductCollection): CartItem => ({
  _id: "1",
  name: "line",
  image: "",
  price: 1,
  quantity: 1,
  productCollection,
});

describe("isUniquePet", () => {
  it("treats live animals as unique", () => {
    expect(isUniquePet(line(ProductCollection.DOG))).toBe(true);
    expect(isUniquePet(line(ProductCollection.FISH))).toBe(true);
  });

  it("lets accessories have a quantity", () => {
    expect(isUniquePet(line(ProductCollection.ACCESSORY))).toBe(false);
  });

  it("treats legacy lines without a category as pets", () => {
    expect(isUniquePet(line(undefined))).toBe(true);
  });
});
