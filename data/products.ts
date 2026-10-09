import type { Locale } from "@/lib/i18n";

export type AvailabilityStatus = "available" | "unavailable" | "unknown";

export type LocalizedField = Readonly<{
  fr: string;
  ar?: string;
}>;

export interface ProductImage {
  id: string;
  src: string;
  width?: number;
  height?: number;
}

export interface SizeOption {
  id: string;
  label: LocalizedField;
}

export interface ColourVariant {
  id: string;
  name: LocalizedField;
  images: readonly ProductImage[];
  availabilityBySize: Readonly<Record<string, AvailabilityStatus>>;
}

export interface MeasurementSpec {
  label: LocalizedField;
  value: LocalizedField;
}

export interface ProductDetails {
  shortDescription?: LocalizedField;
  top?: LocalizedField;
  bottom?: LocalizedField;
  material?: LocalizedField;
  measurements?: readonly MeasurementSpec[];
  style?: LocalizedField;
  collar?: LocalizedField;
  sleeves?: LocalizedField;
  fit?: LocalizedField;
}

export interface Product {
  id: string;
  name: LocalizedField;
  price: {
    amount: number;
    currency: LocalizedField;
  };
  sizes: readonly SizeOption[];
  colourVariants: readonly ColourVariant[];
  details?: ProductDetails;
  tagline?: LocalizedField;
}

// -------------------------------------------------------------
// MODEL 01: L'Allure Fondatrice
// -------------------------------------------------------------
export const model01Sizes: readonly SizeOption[] = [
  { id: "S", label: { fr: "S", ar: "S" } },
  { id: "M", label: { fr: "M", ar: "M" } },
  { id: "L", label: { fr: "L", ar: "L" } },
  { id: "XL", label: { fr: "XL", ar: "XL" } },
];

const model01Availability = (): Readonly<Record<string, AvailabilityStatus>> => ({
  S: "unknown",
  M: "unknown",
  L: "unknown",
  XL: "unknown",
});

export const model01: Product = {
  id: "model-01",
  name: { fr: "Ensemble Sport", ar: "طقم سبور" },
  price: {
    amount: 249,
    currency: { fr: "DH", ar: "درهم" },
  },
  tagline: {
    fr: "L'Allure Fondatrice",
    ar: "الإطلالة التأسيسية",
  },
  sizes: model01Sizes,
  colourVariants: [
    {
      id: "burgundy",
      name: { fr: "Bordeaux", ar: "بورغندي" },
      images: [
        { id: "model-01-burgundy-01", src: "/products/model-01/burgundy-01.png", width: 928, height: 1695 },
        { id: "model-01-burgundy-02", src: "/products/model-01/burgundy-02.png", width: 1000, height: 1573 },
        { id: "model-01-burgundy-03", src: "/products/model-01/burgundy-03.png", width: 964, height: 1632 },
      ],
      availabilityBySize: model01Availability(),
    },
    {
      id: "black",
      name: { fr: "Noir", ar: "أسود" },
      images: [
        { id: "model-01-black-01", src: "/products/model-01/black-01.png", width: 966, height: 1629 },
      ],
      availabilityBySize: model01Availability(),
    },
    {
      id: "dark-green",
      name: { fr: "Vert foncé", ar: "أخضر داكن" },
      images: [
        { id: "model-01-dark-green-01", src: "/products/model-01/dark-green-01.png", width: 967, height: 1627 },
      ],
      availabilityBySize: model01Availability(),
    },
    {
      id: "white",
      name: { fr: "Blanc", ar: "أبيض" },
      images: [
        { id: "model-01-white-01", src: "/products/model-01/white-01.png", width: 1087, height: 1447 },
      ],
      availabilityBySize: model01Availability(),
    },
  ],
};

// -------------------------------------------------------------
// MODEL 02: Ensemble Capuche
// -------------------------------------------------------------
export const model02Sizes: readonly SizeOption[] = [
  {
    id: "taille-1",
    label: {
      fr: "Taille 1 — S / M",
      ar: "المقاس 1 — S / M",
    },
  },
  {
    id: "taille-2",
    label: {
      fr: "Taille 2 — L / XL",
      ar: "المقاس 2 — L / XL",
    },
  },
  {
    id: "taille-3",
    label: {
      fr: "Taille 3 — XXL / XXXL",
      ar: "المقاس 3 — XXL / XXXL",
    },
  },
];

const model02Availability = (): Readonly<Record<string, AvailabilityStatus>> => ({
  "taille-1": "unknown",
  "taille-2": "unknown",
  "taille-3": "unknown",
});

export const model02: Product = {
  id: "model-02",
  name: {
    fr: "Ensemble Capuche",
    ar: "طقم بقبعة",
  },
  price: {
    amount: 299,
    currency: { fr: "DH", ar: "درهم" },
  },
  tagline: {
    fr: "Coupe Ample & Asymétrique",
    ar: "قصة واسعة وانسيابية",
  },
  sizes: model02Sizes,
  colourVariants: [
    {
      id: "bordeaux",
      name: { fr: "Bordeaux", ar: "بورغندي" },
      images: [
        { id: "model-02-bordeaux-01", src: "/products/model-02/bordeaux-01.png", width: 964, height: 1632 },
        { id: "model-02-bordeaux-02", src: "/products/model-02/bordeaux-02.png", width: 1049, height: 1500 },
      ],
      availabilityBySize: model02Availability(),
    },
    {
      id: "vert-kaki",
      name: { fr: "Vert kaki", ar: "أخضر كاكي" },
      images: [
        { id: "model-02-vert-kaki-01", src: "/products/model-02/vert-kaki-01.png", width: 972, height: 1618 },
        { id: "model-02-vert-kaki-02", src: "/products/model-02/vert-kaki-02.png", width: 1086, height: 1448 },
      ],
      availabilityBySize: model02Availability(),
    },
    {
      id: "noir",
      name: { fr: "Noir", ar: "أسود" },
      images: [
        { id: "model-02-noir-01", src: "/products/model-02/noir-01.png", width: 970, height: 1621 },
      ],
      availabilityBySize: model02Availability(),
    },
    {
      id: "blanc-ecru",
      name: { fr: "Blanc / Écru", ar: "أبيض / أوف وايت" },
      images: [
        { id: "model-02-blanc-ecru-01", src: "/products/model-02/blanc-ecru-01.png", width: 1013, height: 1553 },
        { id: "model-02-blanc-ecru-02", src: "/products/model-02/blanc-ecru-02.png", width: 997, height: 1577 },
      ],
      availabilityBySize: model02Availability(),
    },
  ],
  details: {
    shortDescription: {
      fr: "Ensemble féminin à la coupe ample, confortable et élégante, conçu pour offrir une grande liberté de mouvement tout en assurant une belle couvrance.",
      ar: "طقم نسائي بقصة واسعة ومريحة وأنيقة، صُمم لمنح حرية كبيرة في الحركة مع الحفاظ على تغطية مناسبة.",
    },
    top: {
      fr: "Coupe ample et fluide sur le haut du corps. Le modèle est plus court sur le devant et plus long au dos, avec une longueur permettant de couvrir les fesses. Cette asymétrie apporte une touche moderne et élégante à la silhouette.",
      ar: "يتميز الجزء العلوي بقصة واسعة وانسيابية على مستوى الجزء العلوي من الجسم. يأتي التصميم أقصر من الأمام وأطول من الخلف، بطول يسمح بتغطية الأرداف. وتمنح هذه اللامساواة في الطول لمسة عصرية وأنيقة للإطلالة.",
    },
    bottom: {
      fr: "Coupe confortable avec taille élastiquée pour un meilleur ajustement. Le pantalon est doté de poches pratiques et présente une coupe large et fluide au niveau des jambes et du bas.",
      ar: "يتميز البنطال بقصة مريحة وخصر مطاطي لملاءمة أفضل. كما يتوفر على جيوب عملية وقصة واسعة وانسيابية على مستوى الساقين وأسفل البنطال.",
    },
    material: {
      fr: "Tissu Scopa, avec un tombé souple et confortable, adapté à une tenue décontractée et élégante.",
      ar: "قماش Scopa بانسدال ناعم ومريح، مناسب لإطلالة عملية وأنيقة.",
    },
    measurements: [
      {
        label: {
          fr: "Longueur devant du haut",
          ar: "طول الجزء العلوي من الأمام",
        },
        value: {
          fr: "75 cm",
          ar: "75 سم",
        },
      },
      {
        label: {
          fr: "Longueur dos du haut",
          ar: "طول الجزء العلوي من الخلف",
        },
        value: {
          fr: "85 cm",
          ar: "85 سم",
        },
      },
      {
        label: {
          fr: "Longueur totale du pantalon",
          ar: "الطول الإجمالي للبنطال",
        },
        value: {
          fr: "97 à 100 cm",
          ar: "97–100 سم",
        },
      },
    ],
  },
};

// -------------------------------------------------------------
// MODEL 03: Robe-Tunique Longue Casual
// -------------------------------------------------------------
export const model03Sizes: readonly SizeOption[] = model01Sizes;

const model03Availability = (): Readonly<Record<string, AvailabilityStatus>> => ({
  S: "unknown",
  M: "unknown",
  L: "unknown",
  XL: "unknown",
});

export const model03: Product = {
  id: "model-03",
  name: {
    fr: "Robe-Tunique Longue Casual",
    ar: "فستان تونك طويل كاجوال",
  },
  price: {
    amount: 219,
    currency: { fr: "DH", ar: "درهم" },
  },
  tagline: {
    fr: "Modest Fashion / Casual Chic",
    ar: "أزياء محتشمة / كاجوال أنيق",
  },
  sizes: model03Sizes,
  colourVariants: [
    {
      id: "blanc-casse",
      name: { fr: "Blanc cassé", ar: "أوف وايت" },
      images: [
        { id: "model-03-blanc-casse-01", src: "/products/model-03/blanc-casse-01.png", width: 1039, height: 1513 },
      ],
      availabilityBySize: model03Availability(),
    },
    {
      id: "vert-kaki",
      name: { fr: "Vert kaki", ar: "أخضر كاكي" },
      images: [
        { id: "model-03-vert-kaki-01", src: "/products/model-03/vert-kaki-01.png", width: 875, height: 1798 },
      ],
      availabilityBySize: model03Availability(),
    },
    {
      id: "marron",
      name: { fr: "Marron", ar: "بني" },
      images: [
        { id: "model-03-marron-01", src: "/products/model-03/marron-01.png", width: 929, height: 1693 },
      ],
      availabilityBySize: model03Availability(),
    },
  ],
  details: {
    shortDescription: {
      fr: "Le look moderne, pudique et pratique par excellence. Cette robe longue est idéale pour composer un style minimaliste et soigné en un clin d’œil.",
      ar: "إطلالة عصرية ومحتشمة وعملية بامتياز. هذا الفستان الطويل مثالي للحصول على إطلالة بسيطة وأنيقة في وقت قصير.",
    },
    style: {
      fr: "Modest Fashion / Casual Chic",
      ar: "أزياء محتشمة / كاجوال أنيق",
    },
    collar: {
      fr: "Col montant avec double rangée de boutons.",
      ar: "ياقة مرتفعة مع صفّين من الأزرار.",
    },
    sleeves: {
      fr: "Manches ajustables (retroussables avec bouton).",
      ar: "أكمام قابلة للتعديل ويمكن رفعها وتثبيتها بواسطة زر.",
    },
    fit: {
      fr: "Coupe ample avec bas arrondi et poches latérales.",
      ar: "قصة واسعة مع حافة سفلية مستديرة وجيوب جانبية.",
    },
  },
};

// -------------------------------------------------------------
// Scalable Catalog Exports
// -------------------------------------------------------------
export const allProducts: readonly Product[] = [model01, model02, model03];

export function getProductById(id: string): Product | undefined {
  return allProducts.find((p) => p.id === id);
}

export function getLocalizedField(field: LocalizedField | undefined, locale: Locale): string {
  if (!field) return "";
  return field[locale] ?? field.fr ?? "";
}

export function formatPrice(product: Product, locale: Locale): string {
  const currencyStr = getLocalizedField(product.price.currency, locale);
  return `${product.price.amount} ${currencyStr}`;
}
