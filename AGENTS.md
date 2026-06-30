# Pettynara React Agent Guide

This file defines how agents should work inside the Pettynara React frontend project.
Follow these rules before editing code.

## Project Identity

Pettynara is a Korean-friendly pet marketplace platform.

Main domain:

- pets: dogs, cats, birds, fish, rabbits
- pet accessories/items
- pet helpers
- smart pet matching/search

Do not keep restaurant/Burak visual language in new UI work.

## Working Style

- Work step by step.
- One skill or one focused task per run.
- Do not perform large unrelated refactors.
- Preserve existing React, Redux Toolkit, React Router v5, MUI, and CSS patterns unless a task explicitly asks for a different approach.
- Keep API shapes stable unless the current skill explicitly requires backend/frontend contract changes.
- Run build/type checks after meaningful changes when available.

## Design Direction

Use the approved Pettynara homepage preview as the visual reference.

Keep this feeling:

- bright soft hero background
- real dog/cat imagery
- cute Korean emoticon/cartoon decorations
- mint green primary color
- coral accent
- warm cream background
- rounded premium cards
- cheerful but professional marketplace UI

Avoid:

- dark theme
- purple gradient style
- restaurant/food imagery
- Burak branding
- generic admin/dashboard look on the public frontend
- right-side promo/sidebar cards on the homepage

## Homepage Structure

The homepage must follow this order:

1. Navbar
2. Hero + normal search + Smart Search
3. Animal/Accessories category row
4. Pet Helpers
5. Popular Pets
6. Accessories
7. Footer

At 1300px desktop width:

- content should be centered
- category row should fit in one row
- no right sidebar/promo card area should appear

## Navbar Rules

Main navbar links must be:

- Home
- Dogs
- Cats
- Helpers
- Smart Search

Do not add:

- Community
- Safety
- Pets
- Pet Items

Navigation targets:

- Home -> `/`
- Dogs -> `/products?collection=DOG`
- Cats -> `/products?collection=CAT`
- Helpers -> `/helpers`
- Smart Search -> `/smart-search` or scroll to the homepage Smart Search block if the page does not exist yet

Keep login/logout/cart behavior working.

## Product Collections

Pettynara product collections are:

```ts
DOG = "DOG";
CAT = "CAT";
BIRD = "BIRD";
FISH = "FISH";
RABBIT = "RABBIT";
ACCESSORY = "ACCESSORY";
```

Rules:

- Do not keep `OTHER` as a visible category.
- Do not map Rabbits to `OTHER`.
- Use `RABBIT` for rabbits.
- Use `ACCESSORY` for accessories/pet items.
- Replace restaurant category wording such as dish, salad, dessert, drink, menu.

UI labels:

- `DOG` -> Dogs
- `CAT` -> Cats
- `BIRD` -> Birds
- `FISH` -> Fish
- `RABBIT` -> Rabbits
- `ACCESSORY` -> Accessories

## Hero + Smart Search

Hero must include:

- Pettynara brand message
- normal search input
- search chips/tabs for pets/items/helpers if useful
- Smart Search card inside the hero

Korean Smart Search copy:

```text
나에게 맞는 반려동물 찾기
어떤 집에 살고 있나요?
반려동물 경험이 있나요?
하루에 돌볼 수 있는 시간은?
알레르기가 있나요?
스마트 매칭 시작
```

Possible answer chips:

```text
아파트
단독주택
처음이에요
경험 있어요
조용한 친구
활발한 친구
```

Smart Search can start as UI-only/local state unless a task explicitly requests backend integration.

## Category Row

Homepage category row must include:

- Dogs -> `/products?collection=DOG`
- Cats -> `/products?collection=CAT`
- Birds -> `/products?collection=BIRD`
- Fish -> `/products?collection=FISH`
- Rabbits -> `/products?collection=RABBIT`
- Accessories -> `/products?collection=ACCESSORY`

Use rounded pastel cards with real pet/item imagery and small cute decorations.

## Pet Helpers

Pet Helpers section should appear below category row.

Helper cards should show:

- helper avatar/photo
- name
- animals they help
- experience
- short message
- verified badge
- rating/review count if available

If backend helper API is not ready, use isolated local mock data and make it easy to replace later.

## Popular Pets

Popular Pets section should appear below Pet Helpers.

Use existing product data if possible:

- order by `productViews`
- show pet image, name, category/species, location/age if available, views

Do not show old restaurant wording such as `PopularDishes`.

## Accessories

Accessories section should appear below Popular Pets.

Use:

- `productCollection=ACCESSORY`
- item image
- item name
- price
- add-to-cart if existing cart logic supports it

Do not use `OTHER` for accessories.

## Footer

Footer should include:

- Pettynara logo/name
- phone number
- Seoul/Korea style address
- support/service info

Do not add Community or Safety as footer routes.
Safety/trust may appear only as short text or badges, not as a page.

## Images

For final UI, use real or generated pet imagery where inspectable content matters:

- dogs
- cats
- birds
- fish
- rabbits
- accessories
- helpers

Do not use restaurant images.
If downloading images from the internet, save them locally under the project public/assets folder and reference local files.

## Files To Check First

Before frontend changes, inspect relevant files:

- `src/app/App.tsx`
- `src/app/components/headers/HomeNavbar.tsx`
- `src/app/components/headers/OtherNavbar.tsx`
- `src/app/components/footer/index.tsx`
- `src/app/screens/homePage/index.tsx`
- `src/app/screens/homePage/*`
- `src/app/screens/productPage/*`
- `src/app/services/ProductService.ts`
- `src/lib/enums/product.enum.ts`
- `src/lib/types/product.ts`
- `src/css/navbar.css`
- `src/css/home.css`
- `src/css/product.css`
- `src/css/footer.css`

## Known Existing Issue To Fix Carefully

In the old home page logic, `getTopUsers()` may be called outside `useEffect`.
When touching home data loading, move request logic into `useEffect` to avoid repeated requests on every render.

## Verification Checklist

After changes:

- run `npm run build` if available
- confirm navbar only shows Home, Dogs, Cats, Helpers, Smart Search
- confirm no Community/Safety links exist
- confirm no visible `OTHER` category exists
- confirm Rabbits use `RABBIT`
- confirm Accessories use `ACCESSORY`
- confirm homepage order matches the required structure
- confirm 1300px desktop layout has no right sidebar promo cards
- confirm login/logout/cart behavior is not broken
- confirm restaurant/Burak wording is removed from changed UI areas
