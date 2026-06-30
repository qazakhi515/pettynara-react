## Skill 1: pettynara-product-collections-enum-migration

Goal:
Replace restaurant product collection categories with Pettynara pet marketplace categories.

New ProductCollection enum values:

```ts
DOG = "DOG";
CAT = "CAT";
BIRD = "BIRD";
FISH = "FISH";
RABBIT = "RABBIT";
ACCESSORY = "ACCESSORY";
```

Rules:

- Remove old visible product category logic: `DISH`, `SALAD`, `DESSERT`, `DRINK`, `OTHER`.
- Do not keep `OTHER` as a visible category.
- Do not map Rabbits to `OTHER`.
- Use `RABBIT` as its own collection.
- Use `ACCESSORY` for pet items/accessories.
- Keep existing API route shape if possible.
- Do not redesign UI in this skill.
- Do not add Community or Safety pages.

Backend tasks:

- Update backend `ProductCollection` enum.
- Update product schema enum validation.
- Update admin create/edit product collection options.
- Update old default collection values to `DOG` or another explicit new value.
- Search backend for old collection values and replace only product collection usage.
- Do not change unrelated member/order/status enums.

Frontend tasks:

- Update frontend `ProductCollection` enum.
- Update product listing filters to use `DOG`, `CAT`, `BIRD`, `FISH`, `RABBIT`, `ACCESSORY`.
- Update visible labels:
  - `DOG` -> `Dogs`
  - `CAT` -> `Cats`
  - `BIRD` -> `Birds`
  - `FISH` -> `Fish`
  - `RABBIT` -> `Rabbits`
  - `ACCESSORY` -> `Accessories`
- Update old default `DISH` to `DOG`.
- Do not redesign product cards yet.

Verification:

- Run TypeScript/build check if available.
- Confirm product list can request `/product/all?productCollection=DOG`.
- Confirm no old product collection values remain in product collection logic.

---
