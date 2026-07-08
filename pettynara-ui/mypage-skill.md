---
name: pettynara-my-page-redesign
description: Redesign Pettynara My Page/profile screens into a modern pet-commerce profile UI that matches the project's green, mint, clean, trustworthy brand style.
---

# Pettynara My Page Redesign

Use this skill when redesigning Pettynara user profile / My Page screens.

## Goal

Convert the old purple/basic profile page into a modern Pettynara profile settings page.

The UI should feel:

- clean
- friendly
- trustworthy
- pet-focused
- consistent with the Pettynara project

## Brand Style

Use Pettynara’s modern theme:

```css
--green: #066b4d;
--green-light: #0b8b63;
--mint: #eef9f3;
--cream: #fffaf1;
--border: #e8eee9;
--text: #16231f;
--muted: #68756f;
--accent: #ff9b64;

Rules:
Remove old purple profile styling.
Use white cards, soft borders, subtle shadows.
Use paw, user, camera, phone, location, heart, dog/cat icons.
Keep the layout spacious but not empty.
Match the existing Pettynara navbar and overall project UI.

Page Header
Title: My Profile
Subtitle example:
Manage your Pettynara profile and pet preferences.
Optional small status chips:
Dog lover
Cat friendly
Verified contact
Profile Settings Card
Include:
avatar upload area
upload button
accepted formats text: JPG, JPEG, PNG
display name
phone number
email
address
favorite pet selector
home type / lifestyle selector
about me textarea
Save Changes primary button
Cancel secondary button
Profile Preview Card
Show:
soft mint header
circular avatar
small paw/user badge
user name
role: Pettynara Member
address/location
social icons
short description
stats:Orders
Saved Pets
Reviews

pet preference icons:dog
cat
home
heart

Trust Strip
Add compact trust/profile items:
Profile Completion
Safe Account
Verified Contact
UX Rules
Do not make a landing page.
First screen must be the actual profile management UI.
Keep form labels short and clear.
Make the preview look like a real user card.
Avoid clutter and long text.
Use green for active, save, verified, and trust states.
Ensure mobile layout has no overlapping text.
Keep visual style aligned with Pettynara order/payment pages.
Component Suggestions
For React/Vue, split into:
ProfileHeader
AvatarUpload
ProfileForm
ProfilePreview
PreferenceChips
TrustStrip
Final Check
Before finishing, verify:
old purple UI is gone
Pettynara navbar matches the project
form and preview feel connected
colors match green/mint brand
layout works on desktop and mobile
```
