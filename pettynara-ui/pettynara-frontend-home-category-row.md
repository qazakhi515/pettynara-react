## Skill 4: pettynara-frontend-home-category-row

Goal:
Create the homepage animal/accessories category row below the hero.

Categories:

- Dogs -> `/products?collection=DOG`
- Cats -> `/products?collection=CAT`
- Birds -> `/products?collection=BIRD`
- Fish -> `/products?collection=FISH`
- Rabbits -> `/products?collection=RABBIT`
- Accessories -> `/products?collection=ACCESSORY`

Design direction:

- One row at 1300px desktop.
- Rounded pastel cards.
- Real pet/item image plus small cute doodle/icon style.
- Similar to the reference preview category cards.

Rules:

- Do not add a right sidebar.
- Do not add extra promo card beside categories.
- Do not map Rabbits to `OTHER`.
- Do not show `OTHER`.

Frontend tasks:

- Add category row component or update existing home section.
- Add click navigation using `history.push` or `Link/NavLink`.
- Product page should read query collection if possible.
- Keep layout responsive: one row desktop, wrap/scroll on smaller screens.

Verification:

- Each category navigates to the correct product collection.
- Category row fits in one line at 1300px.

---
