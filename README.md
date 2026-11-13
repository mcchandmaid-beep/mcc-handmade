# MCC Handmade — Model 01 Storefront

A premium modest-fashion e-commerce storefront built with Next.js (App Router), React 19, TypeScript, and Vanilla CSS.

## Model 01 Specifications

Model 01 is currently configured with four bilingual colour variants and variable-length image galleries:

- **Bordeaux / بورغندي**: 3 images (`burgundy-01.png`, `burgundy-02.png`, `burgundy-03.png`)
- **Noir / أسود**: 1 image (`black-01.png`)
- **Vert foncé / أخضر داكن**: 1 image (`dark-green-01.png`)
- **Blanc / أبيض**: 1 image (`white-01.png`)
- **Sizes**: S / M / L / XL

The product data, schema types, and dimensions are maintained in `data/products.ts`.

## Architecture & Features

- **Bilingual & Directional Support**: Full French (LTR) and Arabic (RTL) routing under `/[locale]` (`/fr` and `/ar`). Supported by cookie persistence (`mcc-locale`) in `middleware.ts` and UI toggle in `components/language-switcher.tsx`.
- **Typography & Aesthetics**: Warm luxury palette (`#fcfaf7`, `#231f20`, `#ddd6d0`) paired with Cormorant Garamond & Manrope for French, and Noto Naskh Arabic & IBM Plex Sans Arabic for Arabic.
- **Image Performance**: Product visuals and thumbnails use Next.js `Image` with responsive `sizes`, intrinsic aspect ratios, and priority loading on the active view.
- **Pending Commerce**: Price, editorial descriptions, composition details, real-time stock quantities, and shipping policies are intentionally pending awaiting client confirmation.

