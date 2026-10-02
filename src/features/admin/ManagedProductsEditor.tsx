"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImageIcon, LoaderCircle, Plus, Save, Trash2, Upload } from "lucide-react";

import { plainText, type HomeSection, type RichText } from "@/features/home/content/model";
import type { ManagedProduct, ManagedProductCopy, ProductCategory, ProductLocale } from "@/features/products/model";

const builtInProducts = [
  { id: "barley", slug: { tr: "arpa", en: "barley" }, index: 1 },
  { id: "wheat", slug: { tr: "bugday", en: "wheat" }, index: 2 },
  { id: "corn", slug: { tr: "misir", en: "corn" }, index: 3 },
  { id: "sunflower", slug: { tr: "aycicegi", en: "sunflower" }, index: 4 },
] as const;

function runs(value: string): RichText { return [{ text: value }]; }

function legacyProductFromSection(section: HomeSection, definition: (typeof builtInProducts)[number]): ManagedProduct {
  const prefix = `detail_product_${definition.index}`;
  const copyFor = (locale: ProductLocale): ManagedProductCopy => ({
    name: plainText(section.content[locale][`product_${definition.index}_name`]),
    description: plainText(section.content[locale][`product_${definition.index}_description`]),
    kicker: plainText(section.content[locale][`${prefix}_kicker`]), eyebrow: plainText(section.content[locale][`${prefix}_eyebrow`]),
    sectionLabel: plainText(section.content[locale][`${prefix}_section_label`]), sectionTitle: plainText(section.content[locale][`${prefix}_section_title`]), sectionText: plainText(section.content[locale][`${prefix}_section_text`]),
    whiteTitle: plainText(section.content[locale][`${prefix}_white_title`]), whiteText: plainText(section.content[locale][`${prefix}_white_text`]),
    usageValue: plainText(section.content[locale][`${prefix}_usage_value`]), usageDescription: plainText(section.content[locale][`${prefix}_usage_description`]),
    sowingValue: plainText(section.content[locale][`${prefix}_sowing_value`]), sowingDescription: plainText(section.content[locale][`${prefix}_sowing_description`]),
    harvestValue: plainText(section.content[locale][`${prefix}_harvest_value`]), harvestDescription: plainText(section.content[locale][`${prefix}_harvest_description`]),
    characterValue: plainText(section.content[locale][`${prefix}_character_value`]), characterDescription: plainText(section.content[locale][`${prefix}_character_description`]),
    highlights: [1, 2, 3, 4].map(index => plainText(section.content[locale][`${prefix}_highlight_${index}`])),
  });
  return { id: definition.id, categoryId: definition.id, slug: definition.slug, copy: { tr: copyFor("tr"), en: copyFor("en") }, media: { cardUrl: section.media?.[`product${definition.index}`]?.externalUrl ?? null, detailUrl: section.media?.[`detailProduct${definition.index}`]?.externalUrl ?? null }, order: definition.index - 1, createdAt: "", updatedAt: "" };
}

function writeLegacyProduct(section: HomeSection, definition: (typeof builtInProducts)[number], product: ManagedProduct) {
  const prefix = `detail_product_${definition.index}`;
  for (const locale of ["tr", "en"] as ProductLocale[]) {
    const copy = product.copy[locale];
    const values: Record<string, string> = {
      [`product_${definition.index}_name`]: copy.name, [`product_${definition.index}_description`]: copy.description,
      [`${prefix}_kicker`]: copy.kicker, [`${prefix}_eyebrow`]: copy.eyebrow, [`${prefix}_section_label`]: copy.sectionLabel,
      [`${prefix}_section_title`]: copy.sectionTitle, [`${prefix}_section_text`]: copy.sectionText, [`${prefix}_white_title`]: copy.whiteTitle,
      [`${prefix}_white_text`]: copy.whiteText, [`${prefix}_usage_value`]: copy.usageValue, [`${prefix}_usage_description`]: copy.usageDescription,
      [`${prefix}_sowing_value`]: copy.sowingValue, [`${prefix}_sowing_description`]: copy.sowingDescription, [`${prefix}_harvest_value`]: copy.harvestValue,
      [`${prefix}_harvest_description`]: copy.harvestDescription, [`${prefix}_character_value`]: copy.characterValue, [`${prefix}_character_description`]: copy.characterDescription,
      ...Object.fromEntries(copy.highlights.map((value, index) => [`${prefix}_highlight_${index + 1}`, value])),
    };
    for (const [field, value] of Object.entries(values)) section.content[locale][field] = runs(value);
  }
  if (section.media) {
    section.media[`product${definition.index}`].externalUrl = product.media.cardUrl;
    section.media[`detailProduct${definition.index}`].externalUrl = product.media.detailUrl;
  }
}

const textFields: Array<{ key: Exclude<keyof ManagedProductCopy, "highlights">; label: string; multiline?: boolean }> = [
  { key: "name", label: "Ürün adı" }, { key: "description", label: "Ürün kartı açıklaması", multiline: true },
  { key: "kicker", label: "Detay sayfası kısa üst başlığı" },
  { key: "eyebrow", label: "Detay sayfası üst etiketi" }, { key: "sectionLabel", label: "Ürün hakkında bölüm etiketi" },
  { key: "sectionTitle", label: "Ürün hakkında başlığı", multiline: true }, { key: "sectionText", label: "Ürün hakkında açıklaması", multiline: true },
  { key: "whiteTitle", label: "Üretim yaklaşımı başlığı", multiline: true }, { key: "whiteText", label: "Üretim yaklaşımı açıklaması", multiline: true },
  { key: "usageValue", label: "Kullanım bilgisi" }, { key: "usageDescription", label: "Kullanım açıklaması", multiline: true },
  { key: "sowingValue", label: "Ekim bilgisi" }, { key: "sowingDescription", label: "Ekim açıklaması", multiline: true },
  { key: "harvestValue", label: "Hasat bilgisi" }, { key: "harvestDescription", label: "Hasat açıklaması", multiline: true },
  { key: "characterValue", label: "Öne çıkan özellik" }, { key: "characterDescription", label: "Özellik açıklaması", multiline: true },
];

function slugify(value: string, fallback: string) {
  const result = value.toLocaleLowerCase("tr").normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ı/g, "i").replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);
  return result || fallback;
}

function ProductImageEditor({ entityId, slot, label, value, fallback, legacySlot, onChange }: { entityId: string; slot: "cardUrl" | "detailUrl"; label: string; value: string | null; fallback?: string; legacySlot?: string; onChange: (value: string | null) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  async function upload(file?: File) {
    if (!file) return;
    setUploading(true); setMessage("");
    const body = new FormData(); body.set("file", file);
    if (legacySlot) { body.set("pageKey", "activityPage"); body.set("slot", legacySlot); }
    else { body.set("productId", entityId); body.set("slot", slot); }
    try {
      const response = await fetch(legacySlot ? "/api/admin/media" : "/api/admin/products/media", { method: "POST", body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      onChange(result.url); setMessage(result.message);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Görsel yüklenemedi."); }
    finally { setUploading(false); if (input.current) input.current.value = ""; }
  }
  return <div className="rounded-2xl border border-black/[0.07] bg-[#fafaf7] p-4">
    <div className="flex items-center gap-2 text-[11px] font-semibold"><ImageIcon size={14} className="text-[#24734d]" />{label}</div>
    <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-xl bg-[#e8e5da]">{value || fallback ? <Image src={value || fallback!} alt={`${label} önizlemesi`} fill unoptimized className="object-cover" /> : <div className="flex h-full items-center justify-center text-center text-[10px] leading-5 text-black/35">Henüz görsel yüklenmedi.<br />Kaydedilen ürün varsayılan alanla gösterilir.</div>}</div>
    <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" className="hidden" onChange={event => void upload(event.target.files?.[0])} />
    <div className="mt-3 grid grid-cols-2 gap-2"><button type="button" disabled={uploading} onClick={() => input.current?.click()} className="flex h-10 items-center justify-center gap-2 rounded-xl bg-[#173e2e] text-[10px] font-semibold text-white disabled:opacity-50">{uploading ? <LoaderCircle size={13} className="animate-spin" /> : <Upload size={13} />}{uploading ? "Yükleniyor" : "Görsel yükle"}</button><button type="button" disabled={!value || uploading} onClick={() => onChange(null)} className="h-10 rounded-xl border border-black/10 bg-white text-[10px] font-semibold text-black/45 disabled:opacity-35">Görseli kaldır</button></div>
    {message && <p className="mt-2 text-[9px] leading-4 text-black/45">{message}</p>}
  </div>;
}

export default function ManagedProductsEditor({ initialProducts, initialCategories, initialFeaturedProductIds, initialMode, initialActivitySection }: { initialProducts: ManagedProduct[]; initialCategories: ProductCategory[]; initialFeaturedProductIds: string[]; initialMode: "categories" | "products"; initialActivitySection: HomeSection }) {
  const [products, setProducts] = useState(initialProducts);
  const [legacySection, setLegacySection] = useState(() => structuredClone(initialActivitySection));
  const [categories, setCategories] = useState(initialCategories);
  const [featuredProductIds, setFeaturedProductIds] = useState(initialFeaturedProductIds);
  const mode = initialMode;
  const [selectedId, setSelectedId] = useState("barley");
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialCategories[0]?.id ?? "");
  const [locale, setLocale] = useState<ProductLocale>("tr");
  const [saving, setSaving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const builtInDefinition = builtInProducts.find(item => item.id === selectedId);
  const legacyProducts = builtInProducts.map(item => legacyProductFromSection(legacySection, item));
  const allEditableProducts = [...legacyProducts, ...products];
  const product = builtInDefinition ? legacyProductFromSection(legacySection, builtInDefinition) : products.find(item => item.id === selectedId);
  const category = categories.find(item => item.id === selectedCategoryId);

  function update(change: (draft: ManagedProduct) => void) {
    if (builtInDefinition && product) {
      const draft = structuredClone(product); change(draft);
      setLegacySection(current => { const next = structuredClone(current); writeLegacyProduct(next, builtInDefinition, draft); return next; });
    } else setProducts(current => current.map(item => { if (item.id !== selectedId) return item; const draft = structuredClone(item); change(draft); return draft; }));
    setNotice(null);
  }
  async function createProduct() {
    setCreating(true); setNotice(null);
    try {
      if (!categories.length) throw new Error("Ürün eklemeden önce bir kategori oluşturun.");
      const response = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ categoryId: selectedCategoryId || categories[0].id }) }); const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setProducts(current => [...current, result.product]); setSelectedId(result.product.id); setLocale("tr"); setNotice({ type: "success", text: result.message });
    } catch (error) { setNotice({ type: "error", text: error instanceof Error ? error.message : "Ürün oluşturulamadı." }); }
    finally { setCreating(false); }
  }
  async function save() {
    if (!product || saving) return;
    setSaving(true); setNotice(null);
    if (builtInDefinition) {
      try {
        const response = await fetch("/api/admin/content/activityPage", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(legacySection) }); const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        setLegacySection(result.section); setNotice({ type: "success", text: `${product.copy.tr.name} kaydedildi.` });
      } catch (error) { setNotice({ type: "error", text: error instanceof Error ? error.message : "Ürün kaydedilemedi." }); }
      finally { setSaving(false); }
      return;
    }
    const next = structuredClone(product);
    next.slug.tr = slugify(next.copy.tr.name, `urun-${next.id.slice(-6)}`);
    next.slug.en = slugify(next.copy.en.name, `product-${next.id.slice(-6)}`);
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) }); const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setProducts(current => current.map(item => item.id === product.id ? result.product : item)); setNotice({ type: "success", text: result.message });
    } catch (error) { setNotice({ type: "error", text: error instanceof Error ? error.message : "Ürün kaydedilemedi." }); }
    finally { setSaving(false); }
  }
  async function remove() {
    if (!product || builtInDefinition || !window.confirm(`${product.copy.tr.name} ürününü kaldırmak istediğinizden emin misiniz?`)) return;
    const response = await fetch(`/api/admin/products/${product.id}`, { method: "DELETE" }); const result = await response.json();
    if (!response.ok) { setNotice({ type: "error", text: result.message }); return; }
    const remaining = products.filter(item => item.id !== product.id); setProducts(remaining); setFeaturedProductIds(current => current.filter(id => id !== product.id)); setSelectedId(remaining[0]?.id ?? "barley"); setNotice({ type: "success", text: result.message });
  }

  function updateCategory(change: (draft: ProductCategory) => void) {
    setCategories(current => current.map(item => { if (item.id !== selectedCategoryId) return item; const draft = structuredClone(item); change(draft); return draft; }));
    setNotice(null);
  }
  async function createCategory() {
    setCreating(true); setNotice(null);
    try {
      const response = await fetch("/api/admin/product-categories", { method: "POST" }); const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setCategories(current => [...current, result.category]); setSelectedCategoryId(result.category.id); setLocale("tr"); setNotice({ type: "success", text: result.message });
    } catch (error) { setNotice({ type: "error", text: error instanceof Error ? error.message : "Kategori oluşturulamadı." }); }
    finally { setCreating(false); }
  }
  async function saveCategory() {
    if (!category || saving) return;
    setSaving(true); setNotice(null);
    try {
      const response = await fetch(`/api/admin/product-categories/${category.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(category) }); const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setCategories(current => current.map(item => item.id === category.id ? result.category : item)); setNotice({ type: "success", text: result.message });
    } catch (error) { setNotice({ type: "error", text: error instanceof Error ? error.message : "Kategori kaydedilemedi." }); }
    finally { setSaving(false); }
  }
  async function removeCategory() {
    if (!category || category.builtIn || !window.confirm(`${category.name.tr} kategorisini kaldırmak istediğinizden emin misiniz?`)) return;
    const response = await fetch(`/api/admin/product-categories/${category.id}`, { method: "DELETE" }); const result = await response.json();
    if (!response.ok) { setNotice({ type: "error", text: result.message }); return; }
    const remaining = categories.filter(item => item.id !== category.id); setCategories(remaining); setSelectedCategoryId(remaining[0]?.id ?? ""); setNotice({ type: "success", text: result.message });
  }
  async function saveFeaturedProducts() {
    setSaving(true); setNotice(null);
    try {
      const response = await fetch("/api/admin/product-selection", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productIds: featuredProductIds }) }); const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setFeaturedProductIds(result.productIds); setNotice({ type: "success", text: result.message });
    } catch (error) { setNotice({ type: "error", text: error instanceof Error ? error.message : "Ürün seçimi kaydedilemedi." }); }
    finally { setSaving(false); }
  }
  function toggleFeaturedProduct(id: string) {
    setFeaturedProductIds(current => current.includes(id) ? current.filter(item => item !== id) : current.length < 4 ? [...current, id] : current);
  }

  const languageButtons = <div className="flex rounded-xl bg-black/[0.045] p-1">{(["tr", "en"] as ProductLocale[]).map(language => <button key={language} type="button" onClick={() => setLocale(language)} className={`h-9 rounded-lg px-4 text-[11px] font-semibold ${locale === language ? "bg-white shadow-sm" : "text-black/35"}`}>{language === "tr" ? "Türkçe" : "English"}</button>)}</div>;
  const featuredOptions = allEditableProducts.map(item => ({ id: item.id, name: item.copy.tr.name }));

  return <section className="overflow-hidden rounded-[24px] border border-black/[0.07] bg-white">
    <div className="sticky top-[65px] z-20 flex flex-wrap items-center gap-3 border-b border-black/[0.07] bg-white/95 p-5 backdrop-blur-lg sm:p-6">
      <div className="mr-auto"><h2 className="text-[15px] font-semibold">Kategori ve ürün yönetimi</h2><p className="mt-1 text-[11px] text-black/40">Kategoriler filtreleri oluşturur; ürünler seçilen kategori altında listelenir.</p></div>
      {notice && <p className={`w-full rounded-xl px-3 py-2 text-[10px] sm:w-auto ${notice.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{notice.text}</p>}
      {mode === "products" && <label className="flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3"><span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-black/35">Kategori</span><select value={selectedCategoryId} onChange={event => setSelectedCategoryId(event.target.value)} className="h-10 bg-transparent text-[11px] font-semibold outline-none">{categories.map(item => <option key={item.id} value={item.id}>{item.name.tr}</option>)}</select></label>}
      <button type="button" disabled={creating} onClick={() => void (mode === "categories" ? createCategory() : createProduct())} className="flex h-10 items-center gap-2 rounded-xl bg-[#e86f12] px-4 text-[11px] font-semibold text-white disabled:opacity-50">{creating ? <LoaderCircle size={14} className="animate-spin" /> : <Plus size={14} />}{mode === "categories" ? "Yeni kategori" : "Yeni ürün"}</button>
    </div>
    {mode === "categories" ? <div className="grid min-h-[620px] lg:grid-cols-[230px_minmax(0,1fr)]">
      <aside className="border-b border-black/[0.07] bg-[#fafaf7] p-4 lg:border-b-0 lg:border-r"><p className="px-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-black/30">Kategoriler</p><div className="mt-3 flex gap-2 overflow-x-auto lg:flex-col">{categories.map(item => <button key={item.id} type="button" onClick={() => setSelectedCategoryId(item.id)} className={`min-w-[150px] rounded-xl px-3 py-3 text-left lg:min-w-0 ${item.id === selectedCategoryId ? "bg-[#173e2e] text-white" : "bg-white text-black/55"}`}><span className="block truncate text-[11px] font-semibold">{item.name.tr}</span><span className={`mt-1 block text-[9px] ${item.id === selectedCategoryId ? "text-white/45" : "text-black/30"}`}>Ürün filtresi</span></button>)}</div></aside>
      {category ? <div className="p-5 sm:p-6"><div className="flex flex-wrap items-center gap-3 border-b border-black/[0.07] pb-5">{languageButtons}<span className="mr-auto" />{!category.builtIn && <button type="button" onClick={() => void removeCategory()} className="flex h-10 items-center gap-2 rounded-xl border border-red-200 px-3 text-[10px] font-semibold text-red-600"><Trash2 size={13} />Kategoriyi kaldır</button>}<button type="button" disabled={saving} onClick={() => void saveCategory()} className="flex h-10 items-center gap-2 rounded-xl bg-[#173e2e] px-4 text-[11px] font-semibold text-white"><Save size={14} />Kategoriyi kaydet</button></div>
        <div className="mt-6 max-w-2xl"><label className="block rounded-2xl border border-black/[0.065] bg-[#fcfcfa] p-4"><span className="mb-2 block text-[11px] font-semibold">Kategori adı</span><input value={category.name[locale]} onChange={event => updateCategory(draft => { draft.name[locale] = event.target.value; })} className="h-11 w-full rounded-xl border border-black/[0.08] bg-white px-3 text-[13px] outline-none" /><span className="mt-2 block text-[10px] leading-5 text-black/35">Bu ad faaliyetler sayfasındaki üst filtre alanında gösterilir.</span></label></div>
      </div> : null}
    </div> : <div><div className="border-b border-black/[0.07] bg-[#f7f6f1] p-5 sm:p-6"><div className="flex flex-wrap items-center gap-3"><div className="mr-auto"><h3 className="text-[13px] font-semibold">Ana sayfada gösterilecek ürünler</h3><p className="mt-1 text-[10px] text-black/40">En fazla dört ürün seçin. Seçim sırası ana sayfadaki sıralamadır.</p></div><span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-semibold text-black/45">{featuredProductIds.length}/4 seçili</span><button type="button" disabled={saving || featuredProductIds.length < 1} onClick={() => void saveFeaturedProducts()} className="flex h-9 items-center gap-2 rounded-xl bg-[#24734d] px-4 text-[10px] font-semibold text-white disabled:opacity-40"><Save size={13} />Seçimi kaydet</button></div><div className="mt-4 flex flex-wrap gap-2">{featuredOptions.map(option => { const selected = featuredProductIds.includes(option.id); const disabled = !selected && featuredProductIds.length >= 4; return <button key={option.id} type="button" disabled={disabled} onClick={() => toggleFeaturedProduct(option.id)} className={`rounded-xl border px-3 py-2 text-[10px] font-semibold transition disabled:opacity-35 ${selected ? "border-[#24734d] bg-[#24734d] text-white" : "border-black/10 bg-white text-black/50"}`}>{selected ? "✓ " : ""}{option.name}</button>; })}</div></div><div className="grid min-h-[620px] lg:grid-cols-[230px_minmax(0,1fr)]">
      <aside className="border-b border-black/[0.07] bg-[#fafaf7] p-4 lg:border-b-0 lg:border-r"><p className="px-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-black/30">Tüm ürünler</p><div className="mt-3 flex gap-2 overflow-x-auto lg:flex-col">{allEditableProducts.map(item => <button key={item.id} type="button" onClick={() => { setSelectedId(item.id); setSelectedCategoryId(item.categoryId); }} className={`min-w-[150px] rounded-xl px-3 py-3 text-left lg:min-w-0 ${item.id === selectedId ? "bg-[#173e2e] text-white" : "bg-white text-black/55"}`}><span className="block truncate text-[11px] font-semibold">{item.copy.tr.name}</span><span className={`mt-1 block truncate text-[9px] ${item.id === selectedId ? "text-white/40" : "text-black/30"}`}>{categories.find(cat => cat.id === item.categoryId)?.name.tr ?? "Kategori seçilmedi"}</span></button>)}</div></aside>
      {product ? <div className="p-5 sm:p-6"><div className="flex flex-wrap items-center gap-3 border-b border-black/[0.07] pb-5">{languageButtons}<select value={product.categoryId} disabled={Boolean(builtInDefinition)} onChange={event => update(draft => { draft.categoryId = event.target.value; })} className="mr-auto h-10 rounded-xl border border-black/10 bg-white px-3 text-[11px] font-semibold disabled:bg-black/[0.04] disabled:text-black/40">{categories.map(item => <option key={item.id} value={item.id}>{item.name[locale]}</option>)}</select>{!builtInDefinition && <button type="button" onClick={() => void remove()} className="flex h-10 items-center gap-2 rounded-xl border border-red-200 px-3 text-[10px] font-semibold text-red-600"><Trash2 size={13} />Ürünü kaldır</button>}<button type="button" disabled={saving} onClick={() => void save()} className="flex h-10 items-center gap-2 rounded-xl bg-[#173e2e] px-4 text-[11px] font-semibold text-white"><Save size={14} />Ürünü kaydet</button></div>
        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]"><div className="space-y-4">{textFields.map(field => <label key={field.key} className="block rounded-2xl border border-black/[0.065] bg-[#fcfcfa] p-4"><span className="mb-2 block text-[11px] font-semibold">{field.label}</span>{field.multiline ? <textarea rows={3} value={product.copy[locale][field.key]} onChange={event => update(draft => { draft.copy[locale][field.key] = event.target.value; })} className="w-full resize-y rounded-xl border border-black/[0.08] bg-white p-3 text-[13px] leading-6 outline-none" /> : <input value={product.copy[locale][field.key]} onChange={event => update(draft => { draft.copy[locale][field.key] = event.target.value; })} className="h-11 w-full rounded-xl border border-black/[0.08] bg-white px-3 text-[13px] outline-none" />}</label>)}<div className="rounded-2xl border border-black/[0.065] bg-[#fcfcfa] p-4"><p className="text-[11px] font-semibold">Öne çıkan bilgiler</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{product.copy[locale].highlights.map((value, index) => <input key={index} value={value} onChange={event => update(draft => { draft.copy[locale].highlights[index] = event.target.value; })} className="h-11 rounded-xl border border-black/[0.08] bg-white px-3 text-[12px] outline-none" aria-label={`${index + 1}. öne çıkan bilgi`} />)}</div></div></div><aside className="space-y-4"><ProductImageEditor entityId={product.id} slot="cardUrl" label="Ürün kartı görseli" value={product.media.cardUrl} fallback={builtInDefinition ? legacySection.media?.[`product${builtInDefinition.index}`]?.localDefault : undefined} legacySlot={builtInDefinition ? `product${builtInDefinition.index}` : undefined} onChange={value => update(draft => { draft.media.cardUrl = value; })} /><ProductImageEditor entityId={product.id} slot="detailUrl" label="Ürün detay görseli" value={product.media.detailUrl} fallback={builtInDefinition ? legacySection.media?.[`detailProduct${builtInDefinition.index}`]?.localDefault : undefined} legacySlot={builtInDefinition ? `detailProduct${builtInDefinition.index}` : undefined} onChange={value => update(draft => { draft.media.detailUrl = value; })} /></aside></div>
      </div> : <div className="flex items-center justify-center p-10 text-center text-sm text-black/35">Yeni ürün ekleyerek başlayın.</div>}
    </div></div>}
  </section>;
}
