## Skill 7: pettynara-frontend-home-accessories-section

Goal:
Create Accessories section below Popular Pets.

Data:

- Use `ProductService.getProducts`.
- Query `productCollection=ACCESSORY`.
- Order by `createdAt` or `productViews`.

Visible card content:

- item image
- item name
- price
- short category/type
- add to cart button if existing cart logic supports it

Design direction:

- Similar to reference preview `Pet Items` row.
- Clean small product cards, soft border, rounded corners.

Rules:

- Use `ACCESSORY`, not `OTHER`.
- Do not create separate Pet Items navbar link yet.
- Keep cart logic working.

Frontend tasks:

- Convert old `NewDishes` or create new section as `Accessories`.
- Replace restaurant text like `Fresh Menu`.
- Use existing product images from backend.
- Add empty state: `Accessories are not available yet`.

Verification:

- Accessories section renders below Popular Pets.
- Query uses `ACCESSORY`.
- Add to cart still works if included.

---
