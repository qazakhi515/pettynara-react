## Skill 3: pettynara-frontend-hero-smart-search

Goal:
Create the Pettynara hero section with normal search and Korean Smart Search inside the hero.

Design direction:

- Use the attached preview style as reference.
- Hero background should feel bright, soft, warm, and pet-focused.
- Use real dog/cat image style with cute Korean emoticon/cartoon decorations.
- Smart Search card should be inside hero, not below as a plain section.

Hero content:

- Brand feeling: Pettynara, pet marketplace and helper platform.
- Include normal search input for pets, helpers, and items.
- Include search tabs or chips: `Pets`, `Items`, `Helpers`.
- Include location chip such as `Seoul`.
- Include a clear `Smart Match` / `Smart Search` CTA.

Korean Smart Search copy:

```text
나에게 맞는 반려동물 찾기
어떤 집에 살고 있나요?
반려동물 경험이 있나요?
하루에 돌볼 수 있는 시간은?
알레르기가 있나요?
스마트 매칭 시작
```

Answer chips:

```text
아파트
단독주택
처음이에요
경험 있어요
조용한 친구
활발한 친구
```

Rules:

- Do not add backend logic in this skill unless already available.
- Smart Search can be UI-only/local state for now.
- Do not create Community or Safety page.
- Do not add side promo cards.

Frontend tasks:

- Create or update home hero component.
- Move old restaurant hero copy out.
- Use Pettynara visual language.
- Keep search input accessible and responsive.
- If no image asset exists, use local placeholder first and leave TODO for downloading real pet images later.

Verification:

- Hero renders on `/`.
- No layout overlap at 1300px.
- Smart Search card is visible inside hero.

---
