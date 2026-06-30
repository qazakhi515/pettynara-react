## Skill 5: pettynara-frontend-home-helpers-section

Goal:
Add Pet Helpers section below the category row.

Content:

- Show helper cards with:
  - helper photo/avatar
  - name
  - animals they help
  - experience years
  - short message
  - verified badge style
  - rating or review count if available

Design direction:

- Match the preview: real person + pet image, clean white card, mint verified badge.
- Friendly and trustworthy, not too formal.

Rules:

- If backend PetHelper API is not ready, use local mock data only in this component.
- Keep mock data isolated so it can be replaced by service call later.
- Do not create Community/Safety pages.

Frontend tasks:

- Create `PetHelpers` home section.
- Place it immediately after category row.
- Add CTA button: `View helpers` or Korean equivalent.
- If `/helpers` route does not exist yet, link can be prepared but page creation should be separate.

Verification:

- Section appears below categories.
- Cards do not overflow at desktop.
- Mock data can be removed later without touching layout.

---

## Skill 6: pettynara-frontend-home-popular-pets-section

Goal:
Convert old `PopularDishes` home section into `Popular Pets`.

Data:

- Use existing `ProductService.getProducts`.
- Order by `productViews`.
- Default collection can be `DOG` first, or include mixed local cards until backend supports mixed collections.

Visible card content:

- pet image
- pet name
- collection/species
- location
- age or size if available
- views
- favorite icon style
- badge such as `Free` or `Verified` if available/mock only

Rules:

- Keep backend API shape unless already changed.
- Do not rename unrelated service functions unless needed.
- Do not break product detail navigation.
- Do not show restaurant wording.

Frontend tasks:

- Rename UI title from `PopularDishes` to `Popular Pets`.
- Replace food text with pet marketplace labels.
- Use Pettynara card style from reference.
- Keep existing Redux slice if renaming creates too much churn; UI text can change first.

Verification:

- Popular pets render from current product data.
- Empty state says pet listings are not available, not dishes/products.

---
