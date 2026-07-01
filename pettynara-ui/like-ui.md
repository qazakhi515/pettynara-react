# Pet Favorite Lottie Skill

## Objective

Add professional like/favorite feedback for pet cards and pet detail page.

When user clicks heart:

- update favorite state instantly
- animate heart
- save/remove favorite in backend
- show Lottie success toast
- rollback state on error

## Packages

```bash
yarn add lottie-react react-hot-toast motion

```

# FavoriteButton Rules

Reusable bo'lsin
Pet card va detail page’da ishlasin
Page reload bo‘lmasin
Double click spam oldi olinsin
Loading vaqtida button disabled bo‘lsin
Heart bosilganda scale/pop animation bo‘lsin
Success bo‘lsa cute Lottie toast chiqsin
Error bo‘lsa oldingi holatga qaytsin

# LottieToast Rules

Success: heart/paw animation
Error: cute sad pet animation
Duration: 1.5–2 seconds
Mobile friendly
Fixed top-right yoki bottom-center
Pettynara green/cream style bilan mos bo‘lsin

# UX

Like bosilganda foydalanuvchi darhol feedback ko‘rsin
Toast juda katta bo‘lmasin
Animatsiya premium, lekin ortiqcha chalg‘itmasin
Same logic barcha pet cardlarda ishlasin
