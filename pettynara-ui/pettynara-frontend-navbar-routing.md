Goal:
Update the frontend navbar for Pettynara and connect category navigation.

Navbar links:

- `Home` -> `/`
- `Dogs` -> `/products?collection=DOG`
- `Cats` -> `/products?collection=CAT`
- `Helpers` -> `/helpers`
- `Smart Search` -> `/smart-search` or scroll to hero smart-search block if page is not created yet

Rules:

- Do not include `Community`.
- Do not include `Safety`.
- Do not include `Pets` or `Pet Items` nav links.
- Keep auth/login/cart logic working.
- Keep existing `HomeNavbar` and `OtherNavbar` structure if possible.
- Use Pettynara logo/name instead of Burak branding.

Frontend tasks:

- Update `HomeNavbar.tsx`.
- Update `OtherNavbar.tsx`.
- Update navbar CSS to match Pettynara style.
- Make nav visually close to the reference preview: clean white top bar, rounded login/signup button, mint primary color.
- Make desktop navbar fit cleanly at 1300px.
- Mobile can stack or use existing responsive pattern if present.

Verification:

- Check links render correctly.
- Confirm Community/Safety do not appear.
- Confirm existing login/logout/cart still works.

---
