---
name: pettynara-payment-ui
description: Use this skill to create modern Pettynara checkout, order, and payment pages with a clean pet-commerce style, green trust accents, compact forms, and reassuring order summary panels.
---

# Pettynara Payment UI

Create a polished pet-commerce checkout/payment page for Pettynara. Prioritize trust, clarity, and warmth over decoration.

## Visual Direction

- Brand: `Pettynara`, paw logo, friendly pet marketplace.
- Palette: deep green `#066B4D`, fresh green `#0B8B63`, mint `#EEF9F3`, cream `#FFFAF1`, soft border `#E8EEE9`, text `#16231F`, muted `#68756F`, small coral accents `#FF9B64`.
- Style: white cards, 8-18px radius, subtle shadows, lots of spacing, modern SaaS-like checkout with pet warmth.
- Use real pet imagery where possible, especially in order summary. Avoid generic gradients as the main visual.
- Icons should reinforce function: cart, shield, truck, card, phone, check, paw.

## Page Structure

Build the first screen as the actual checkout UI, not a landing page.

1. Header
   - Left: Pettynara logo.
   - Center: compact progress stepper: Cart, Checkout, Payment active, Done.
   - Right: secure payment pill.

2. Main layout
   - Two-column desktop layout: form left, order summary right.
   - Single-column mobile layout.

3. Left form card
   - Page title: `Complete Your Payment`.
   - Buyer Information: name, phone, email, delivery address.
   - Delivery Method: Delivery selected, Pickup option.
   - Safety guarantee strip with small pet mascot.
   - Payment Method tabs: Card Payment, KakaoPay, Bank Transfer.
   - Card details and a strong green `Pay Now` button.

4. Right summary card
   - Pet photo, name, gender/age chips, location, verified seller.
   - Price rows: pet price, delivery fee, service fee, total.
   - Benefit list: health checked, safe delivery, 14-day guarantee, 24/7 support.
   - Help card with phone number.

5. Bottom trust row
   - 3-4 compact benefit items, not a marketing hero.

## UX Rules

- Keep labels short and inputs easy to scan.
- Make the current step and selected delivery/payment options visually obvious.
- Total amount should be the strongest number on the page.
- Do not overload the UI with text; use short reassurance copy only where it reduces payment anxiety.
- Ensure no text overlaps on mobile. Use responsive grids and stable card sizing.

## Implementation Notes

- For plain HTML/CSS, keep everything in one file unless the user asks for a framework.
- For React/Vue, create reusable components: `Stepper`, `InfoForm`, `DeliveryMethod`, `PaymentTabs`, `OrderSummary`, `TrustBenefits`.
- Prefer CSS variables for theme colors.
- Use accessible labels, button states, and semantic sections.
- Verify at desktop and mobile widths before final delivery.
