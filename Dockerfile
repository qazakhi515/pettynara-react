# ---------- 1-bosqich: React'ni build qilish ----------
FROM node:20-alpine AS build
WORKDIR /app

# Bu loyiha yarn ishlatadi (yarn.lock bor, package-lock.json yo'q).
# Lock faylini alohida ko'chiramiz: kod o'zgarganda ham bog'liqliklar
# qayta yuklanmaydi, Docker keshdan oladi.
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
# .env.production shu yerda o'qiladi -> REACT_APP_API_URL bundle ichiga kiradi
RUN yarn build

# ---------- 2-bosqich: statik fayllarni tarqatish ----------
# Node kerak emas — React build oddiy html/css/js. Kichik nginx yetarli.
FROM nginx:1.27-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY deploy/nginx-spa.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
