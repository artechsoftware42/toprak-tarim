import type { ManagedProduct } from "@/features/products/model";

export type ProductFilter = string;

export const productFilters: ProductFilter[] = ["Tümü", "Arpa", "Buğday", "Mısır", "Ayçiçeği"];

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductFilter;
  image: string;
  detailImage: string;
  cardDescription: string;
  managed?: ManagedProduct;
};

export const products: Product[] = [
  {
    id: "barley",
    slug: "arpa",
    name: "Arpa",
    category: "Arpa" as ProductFilter,
    image: "/arpa.png",
    detailImage: "/barley-field.png",
    cardDescription: "Hayvancılık ve yem sanayisi için besleyici değeri yüksek, özenle seçilmiş arpa ürünleri.",
  },
  {
    id: "wheat",
    slug: "bugday",
    name: "Buğday",
    category: "Buğday" as ProductFilter,
    image: "/bugday.png",
    detailImage: "/wheat-field.png",
    cardDescription: "Kalite standartları gözetilerek seçilen, farklı kullanım alanlarına uygun buğday ürünleri.",
  },
  {
    id: "corn",
    slug: "misir",
    name: "Mısır",
    category: "Mısır" as ProductFilter,
    image: "/misir.png",
    detailImage: "/corn-field.png",
    cardDescription: "Gıda ve yem sektörünün ihtiyaçlarına yönelik yüksek kaliteli mısır ürünleri.",
  },
  {
    id: "sunflower",
    slug: "aycicegi",
    name: "Ayçiçeği",
    category: "Ayçiçeği" as ProductFilter,
    image: "/aycicegi.png",
    detailImage: "/sunflower-field.png",
    cardDescription: "Yağ ve gıda sanayisinin ihtiyaçlarına uygun, özenle seçilmiş ayçiçeği ürünleri.",
  },
];

export function productsWithManaged(managedProducts: ManagedProduct[]): Product[] {
  return [
    ...products,
    ...managedProducts.map(product => ({
      id: product.id,
      slug: product.slug.tr,
      name: product.copy.tr.name,
      category: product.copy.tr.name,
      image: product.media.cardUrl || "/product-placeholder.svg",
      detailImage: product.media.detailUrl || product.media.cardUrl || "/product-placeholder.svg",
      cardDescription: product.copy.tr.description,
      managed: product,
    })),
  ];
}
