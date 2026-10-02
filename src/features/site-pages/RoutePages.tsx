import { notFound } from "next/navigation";
import { connection } from "next/server";

import { productsWithManaged } from "@/data/products";
import AboutPage from "@/features/about/AboutPage";
import ActivitiesPage from "@/features/activities/ActivitiesPage";
import ContactPage from "@/features/contact/ContactPage";
import HomeActivities from "@/features/home/activities/Activities";
import AboutSection from "@/features/home/about/AboutSection";
import ContactCTA from "@/features/home/contact/ContactCTA";
import { HomeContentProvider } from "@/features/home/content/HomeContent";
import { readHomeSections } from "@/features/home/content/read";
import Hero from "@/features/home/hero/Hero";
import Products from "@/features/home/products/Products";
import Production from "@/features/home/production/Production";
import ProductionStatementSection from "@/features/home/section/ProductionStatementSection";
import ProductDetail from "@/features/product-detail/ProductDetail";
import { readFeaturedProductIds, readManagedProducts, readProductCategories } from "@/features/products/read";
import { canonicalProductSlug } from "@/lib/site-routing";

export async function HomeRoutePage() {
  await connection();
  const sections = await readHomeSections();
  const [managedProducts, featuredProductIds] = await Promise.all([readManagedProducts(), readFeaturedProductIds()]);

  return (
    <HomeContentProvider sections={sections}>
      <main>
        <Hero />
        <AboutSection />
        <Production />
        <HomeActivities />
        <Products managedProducts={managedProducts} featuredProductIds={featuredProductIds} />
        <ContactCTA />
        <ProductionStatementSection />
      </main>
    </HomeContentProvider>
  );
}

export async function AboutRoutePage() {
  const sections = await readHomeSections();
  return (
    <HomeContentProvider sections={sections}>
      <AboutPage content={sections.find((section) => section.pageKey === "aboutPage")!} />
    </HomeContentProvider>
  );
}

export async function ActivitiesRoutePage() {
  const sections = await readHomeSections();
  const [managedProducts, categories] = await Promise.all([readManagedProducts(), readProductCategories(sections)]);
  return (
    <HomeContentProvider sections={sections}>
      <ActivitiesPage managedProducts={managedProducts} categories={categories} />
    </HomeContentProvider>
  );
}

export async function ContactRoutePage() {
  const sections = await readHomeSections();
  return <ContactPage content={sections.find((section) => section.pageKey === "contact")!} />;
}

export async function ProductRoutePage({ slug }: { slug: string }) {
  const canonicalSlug = canonicalProductSlug(slug);
  const sections = await readHomeSections();
  const [managedProducts, categories] = await Promise.all([readManagedProducts(), readProductCategories(sections)]);
  const product = productsWithManaged(managedProducts).find(item => item.managed
    ? item.managed.slug.tr === slug || item.managed.slug.en === slug
    : item.slug === canonicalSlug);
  if (!product) notFound();

  const category = categories.find(item => item.id === product.category);
  return (
    <HomeContentProvider sections={sections}>
      <ProductDetail product={product} categoryName={category?.name ?? { tr: "Ürün", en: "Product" }} />
    </HomeContentProvider>
  );
}
