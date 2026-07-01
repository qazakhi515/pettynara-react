Use this pet matching logic to build the frontend Smart Search flow.

Build a 5-step pet matching UI:

1. Home type
2. Experience
3. Time
4. Allergies
5. Personality

Use hard filters first:

- severe allergies exclude high-allergy pets
- low daily time excludes high-time pets
- first-time owners exclude advanced-care pets
- apartment excludes house-only pets unless small/low-energy

Then score remaining pets:
+30 home fit
+25 time fit
+20 experience fit
+15 personality match
+10 activity fit
+10 budget fit
-20 mild allergy risk
-15 near-miss care requirement

Return top 3 matches with:

- pet name
- score 0-100
- match label
- reasons
- cautions

Frontend requirements:

- one question per screen
- progress tabs/icons
- back/edit support
- start matching button disabled until required answers exist
- result page explains why each pet matched
- keep UI clean, mobile-first, soft green pet-care style
