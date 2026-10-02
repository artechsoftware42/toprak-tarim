"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Bold, Building2, Check, ChevronDown, ChevronRight, CircleAlert, ContactRound,
  ExternalLink, Film, Globe2, Home, ImageIcon, Italic, Languages, LoaderCircle, LogOut, Menu, Palette, RotateCcw, Save, Search, Type, Upload, Wheat, X,
} from "lucide-react";

import logo from "@/assets/logo.png";
import hero3 from "@/assets/hero3.png";
import hero4 from "@/assets/hero4.png";
import icon from "@/assets/icon.png";
import policy from "@/features/home/content/field-policy.json";
import { defaults, plainText, type HomeSection, type Locale, type MediaReference, type PageKey, type RichText, type TextRun } from "@/features/home/content/model";

const pageTints: Record<PageKey, string> = {
  hero: "#fff4ea",
  about: "#edf7f1",
  production: "#faf4e7",
  contactCTA: "#edf5fb",
  contact: "#edf7f1",
  aboutPage: "#f4f0fa",
  activityPage: "#fbf1e7",
};

const colorScale = ["#171a16", "#ffffff", "#24734d", "#69ad4d", "#d5e8c5", "#e86f12", "#f4a340", "#99712b", "#3971a8", "#7b61a8", "#b83d57", "#6b7280"];
const safeColor = /^(?:#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})|rgba\(\s*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,\s*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,\s*(?:25[0-5]|2[0-4]\d|1?\d?\d)\s*,\s*(?:0(?:\.\d+)?|1(?:\.0+)?)\s*\))$/;

const heroFieldOrder = [
  "slide2_eyebrow", "slide2_title", "slide2_description",
  "slide3_eyebrow", "slide3_title", "slide3_description",
  "slide1_eyebrow", "slide1_title", "slide1_description",
];

const hiddenAdminFields = new Set([
  "previous", "next", "pause", "play", "slideLabel", "product_aria_suffix",
]);

function isVisibleSiteContent(field: string) {
  return !hiddenAdminFields.has(field) && !field.endsWith("_aria") && !field.endsWith("_alt");
}

type AdminAreaKey = "home" | "corporate" | "activities" | "contact";
type AdminPanelSection = {
  id: string;
  label: string;
  description: string;
  group?: string;
  pageKey: PageKey;
  preview: string;
  matchesField: (field: string) => boolean;
  mediaSlots?: string[];
};

type AdminArea = {
  key: AdminAreaKey;
  label: string;
  description: string;
  color: string;
  icon: typeof Home;
  sections: AdminPanelSection[];
};

const aboutHeroFields = new Set(["breadcrumb_aria", "home_label", "about_label", "since_label", "hero_word", "hero_tagline", "hero_section_label"]);
const activityHeroFields = new Set(["breadcrumb_aria", "home_label", "activities_label"]);
const contactOfficeFields = new Set(["office_label", "office_address", "office_phone", "office_email"]);
const contactFactoryFields = new Set(["factory_label", "factory_address", "factory_phone", "factory_email"]);
const productListFields = new Set([
  "products_background", "products_label", "products_title_1", "products_title_2", "products_description",
  "products_filters_aria", "products_filter_1", "products_filter_2", "products_filter_3", "products_filter_hint",
  "products_brand", "product_cta", "inspect_label", "product_aria_suffix",
  "detail_products_button", "detail_products_button_hover", "detail_story_label", "detail_story_intro",
  "detail_back_label", "detail_brand", "detail_scroll_label", "detail_general_overview", "detail_production_approach",
  "detail_fact_usage_label", "detail_fact_sowing_label", "detail_fact_harvest_label", "detail_fact_character_label",
]);

function isProductField(field: string, productIndex: number) {
  return field === `product_${productIndex}_name`
    || field === `product_${productIndex}_description`
    || field.startsWith(`detail_product_${productIndex}_`);
}

const adminAreas: AdminArea[] = [
  {
    key: "home",
    label: "Ana Sayfa",
    description: "Ana sayfadaki bölümler",
    color: "#e86f12",
    icon: Home,
    sections: [
      { id: "home-welcome", label: "Karşılama Slaytları", description: "Ana sayfanın fotoğraf ve video kullanılan ilk bölümü", pageKey: "hero", preview: "/", matchesField: () => true, mediaSlots: ["slide2", "slide3", "slide1"] },
      { id: "home-about", label: "Hakkımızda Tanıtımı", description: "Ana sayfadaki kısa kurumsal tanıtım alanı", pageKey: "about", preview: "/", matchesField: () => true, mediaSlots: ["primary", "secondary", "seal"] },
      { id: "home-production", label: "Üretim Bölümü", description: "Ana sayfadaki etkileşimli üretim anlatımı", pageKey: "activityPage", preview: "/", matchesField: field => field.startsWith("home_production_") || /^product_\d+_name$/.test(field), mediaSlots: [] },
      { id: "home-activities", label: "Faaliyetler Bölümü", description: "Ana sayfadaki faaliyet kartları ve açıklamaları", pageKey: "activityPage", preview: "/", matchesField: field => field.startsWith("home_activities_") || field.startsWith("activity_step_") || ["activities_label", "intro_label", "inspect_label"].includes(field), mediaSlots: ["activityCard1", "activityCard2", "activityCard3", "activityCard4"] },
      { id: "home-products", label: "Ürünler Bölümü", description: "Ana sayfadaki ürün kartları ve yönlendirme metinleri", pageKey: "activityPage", preview: "/", matchesField: field => field.startsWith("home_products_") || /^product_\d+_(?:name|description)$/.test(field) || ["products_label", "detail_products_button", "detail_products_button_hover"].includes(field), mediaSlots: ["product1", "product2", "product3", "product4"] },
      { id: "home-contact", label: "İletişim Çağrısı", description: "Ana sayfanın iletişime yönlendiren kapanış alanı", pageKey: "contactCTA", preview: "/", matchesField: () => true, mediaSlots: ["background"] },
    ],
  },
  {
    key: "corporate",
    label: "Kurumsal",
    description: "Hakkımızda sayfası",
    color: "#6b5b95",
    icon: Building2,
    sections: [
      { id: "corporate-welcome", label: "Sayfa Girişi", description: "Kurumsal sayfanın karşılama alanı", pageKey: "aboutPage", preview: "/hakkimizda", matchesField: field => field.startsWith("hero_") || aboutHeroFields.has(field), mediaSlots: ["hero"] },
      { id: "corporate-about", label: "Hakkımızda ve Tarihçe", description: "Şirket anlatımı, tarihçe ve kapanış metinleri", pageKey: "aboutPage", preview: "/hakkimizda#biz-kimiz", matchesField: field => !(field.startsWith("hero_") || aboutHeroFields.has(field) || field.startsWith("vision_") || field.startsWith("mission_")), mediaSlots: [] },
      { id: "corporate-vision", label: "Vizyon", description: "Kurumsal sayfadaki vizyon alanı", pageKey: "aboutPage", preview: "/hakkimizda#vizyon", matchesField: field => field.startsWith("vision_"), mediaSlots: [] },
      { id: "corporate-mission", label: "Misyon", description: "Kurumsal sayfadaki misyon alanı", pageKey: "aboutPage", preview: "/hakkimizda#misyon", matchesField: field => field.startsWith("mission_"), mediaSlots: [] },
    ],
  },
  {
    key: "activities",
    label: "Faaliyetlerimiz",
    description: "Üretim ve ürün sayfaları",
    color: "#b56b2d",
    icon: Wheat,
    sections: [
      { id: "activities-welcome", label: "Sayfa Girişi", description: "Faaliyetler sayfasının karşılama ve giriş alanı", pageKey: "activityPage", preview: "/faaliyetler", matchesField: field => field.startsWith("hero_") || field.startsWith("intro_") || activityHeroFields.has(field), mediaSlots: ["hero"] },
      { id: "activities-production", label: "Üretim", description: "Üretim adımları ve üretim yolculuğu", pageKey: "activityPage", preview: "/faaliyetler#uretim", matchesField: field => field.startsWith("activity_step_") || field.startsWith("journey_"), mediaSlots: ["activityCard1", "activityCard2", "activityCard3", "activityCard4"] },
      { id: "activities-products", group: "Ürünler", label: "Ürün Listesi ve Ortak Metinler", description: "Ürünler bölümünün başlıkları, filtreleri ve tüm ürünlerde kullanılan ortak detay metinleri", pageKey: "activityPage", preview: "/faaliyetler#urunler", matchesField: field => productListFields.has(field) || /^detail_story_\d+_/.test(field), mediaSlots: [] },
      { id: "activities-product-barley", group: "Ürünler", label: "Arpa", description: "Arpa kartı, ürün detay sayfası ve görselleri", pageKey: "activityPage", preview: "/faaliyetler/arpa", matchesField: field => isProductField(field, 1), mediaSlots: ["product1", "detailProduct1"] },
      { id: "activities-product-wheat", group: "Ürünler", label: "Buğday", description: "Buğday kartı, ürün detay sayfası ve görselleri", pageKey: "activityPage", preview: "/faaliyetler/bugday", matchesField: field => isProductField(field, 2), mediaSlots: ["product2", "detailProduct2"] },
      { id: "activities-product-corn", group: "Ürünler", label: "Mısır", description: "Mısır kartı, ürün detay sayfası ve görselleri", pageKey: "activityPage", preview: "/faaliyetler/misir", matchesField: field => isProductField(field, 3), mediaSlots: ["product3", "detailProduct3"] },
      { id: "activities-product-sunflower", group: "Ürünler", label: "Ayçiçeği", description: "Ayçiçeği kartı, ürün detay sayfası ve görselleri", pageKey: "activityPage", preview: "/faaliyetler/aycicegi", matchesField: field => isProductField(field, 4), mediaSlots: ["product4", "detailProduct4"] },
    ],
  },
  {
    key: "contact",
    label: "İletişim",
    description: "Ofis, fabrika ve form",
    color: "#3971a8",
    icon: ContactRound,
    sections: [
      { id: "contact-welcome", label: "Sayfa Girişi", description: "İletişim sayfasının karşılama ve sosyal bağlantı alanı", pageKey: "contact", preview: "/iletisim", matchesField: field => field.startsWith("hero_") || ["form_cta", "facebook_label", "instagram_label"].includes(field), mediaSlots: [] },
      { id: "contact-office", label: "Merkez Ofis", description: "Merkez ofis adı, adresi, telefonu ve e-postası", pageKey: "contact", preview: "/iletisim", matchesField: field => contactOfficeFields.has(field) || ["address_label", "phone_label", "email_label", "directions_label", "map_reset_label"].includes(field), mediaSlots: [] },
      { id: "contact-factory", label: "Fabrika", description: "Fabrika adı, adresi, telefonu ve e-postası", pageKey: "contact", preview: "/iletisim", matchesField: field => contactFactoryFields.has(field), mediaSlots: [] },
      { id: "contact-form", label: "İletişim Formu ve E-posta", description: "Form başlıkları, alan adları ve gönderim mesajları", pageKey: "contact", preview: "/iletisim", matchesField: field => !(field.startsWith("hero_") || contactOfficeFields.has(field) || contactFactoryFields.has(field) || ["form_cta", "facebook_label", "instagram_label", "address_label", "phone_label", "email_label", "directions_label", "map_reset_label"].includes(field)), mediaSlots: [] },
    ],
  },
];

const panelSections = adminAreas.flatMap(area => area.sections);

function panelSectionSnapshot(section: HomeSection, panelSection: AdminPanelSection) {
  const content = Object.fromEntries((["tr", "en"] as Locale[]).map(language => [
    language,
    Object.fromEntries(Object.entries(section.content[language]).filter(([field]) => isVisibleSiteContent(field) && panelSection.matchesField(field))),
  ]));
  const media = Object.fromEntries(Object.entries(section.media ?? {}).filter(([slot]) => !panelSection.mediaSlots || panelSection.mediaSlots.includes(slot)));
  return { content, media };
}

const labels: Record<string, string> = {
  background_label: "Arka plan etiketi", section_label: "Bölüm etiketi", title_line_1: "Ana başlık · 1. satır", title_line_2: "Ana başlık · 2. satır", title_line_3: "Ana başlık · 3. satır",
  description: "Açıklama", transition_label: "Geçiş etiketi", explore_label: "Keşif etiketi", interactive_label: "Etkileşim etiketi", interaction_hint: "Etkileşim yönlendirmesi", cursor_label: "İmleç etiketi",
  image_description: "Görsel açıklaması", image_state_label: "Görsel durum etiketi", location_label: "Konum etiketi", caption: "Alt açıklama", phone: "Telefon", email: "E-posta", address: "Adres",
  previous: "Önceki slayt etiketi", next: "Sonraki slayt etiketi", pause: "Duraklat etiketi", play: "Oynat etiketi", slideLabel: "Slayt erişilebilirlik etiketi",
  hero_eyebrow: "Üst başlık", hero_title: "Sayfa başlığı", office_label: "Merkez ofis etiketi", office_address: "Merkez ofis adresi", office_phone: "Merkez ofis telefonu", office_email: "Merkez ofis e-postası",
  factory_label: "Fabrika etiketi", factory_address: "Fabrika adresi", factory_phone: "Fabrika telefonu", factory_email: "Fabrika e-postası", address_label: "Adres başlığı", phone_label: "Telefon başlığı", email_label: "E-posta başlığı",
  form_cta: "Forma geçiş butonu", facebook_label: "Facebook etiketi", instagram_label: "Instagram etiketi", form_eyebrow: "Form üst başlığı", form_title_line_1: "Form başlığı · 1. satır", form_title_line_2: "Form başlığı · 2. satır", form_description: "Form açıklaması",
  name_label: "Ad alanı etiketi", name_placeholder: "Ad alanı örneği", surname_label: "Soyad alanı etiketi", surname_placeholder: "Soyad alanı örneği", form_email_label: "Form e-posta etiketi", email_placeholder: "E-posta alanı örneği", subject_label: "Konu alanı etiketi", subject_placeholder: "Konu alanı örneği", message_label: "Mesaj alanı etiketi", message_placeholder: "Mesaj alanı örneği",
  kvkk_consent: "KVKK onay metni", submit_label: "Gönder butonu", submitting_label: "Gönderiliyor durumu", sending_message: "Gönderim durum mesajı", success_message: "Başarı mesajı", send_error: "Hata mesajı", map_reset_label: "Harita sıfırlama etiketi",
  slide1: "Karşılama videosu · 3. sıra", slide2: "Karşılama fotoğrafı 1 · 1. sıra", slide3: "Karşılama fotoğrafı 2 · 2. sıra",
  hero_aria: "Karşılama alanı erişilebilirlik etiketi", breadcrumb_aria: "Sayfa yolu erişilebilirlik etiketi", home_label: "Ana sayfa bağlantı metni", about_label: "Hakkımızda bağlantı metni", activities_label: "Faaliyetler bağlantı metni",
  primary: "Birinci tanıtım fotoğrafı", secondary: "İkinci tanıtım fotoğrafı", seal: "Kurumsal amblem", background: "Arka plan görseli", hero: "Karşılama görseli",
};

const fieldWords: Record<string, string> = {
  hero: "Karşılama", aria: "erişilebilirlik etiketi", breadcrumb: "sayfa yolu", eyebrow: "üst etiket", title: "başlık", accent: "vurgulu metin", description: "açıklama", label: "etiket", text: "metin", body: "paragraf", note: "not", caption: "alt açıklama", summary: "özet", intro: "giriş", story: "hikâye", statement: "vurgu", general: "genel bilgiler", period: "dönem", history: "tarihçe", vision: "vizyon", mission: "misyon", closing: "kapanış", slogan: "slogan", motto: "motto", button: "buton", hover: "üzerine gelme", scroll: "kaydırma", hint: "yönlendirme", products: "ürünler", product: "ürün", production: "üretim", activity: "faaliyet", journey: "üretim yolculuğu", step: "adım", filter: "filtre", brand: "marka", inspect: "inceleme", detail: "ürün detayı", usage: "kullanım", sowing: "ekim", harvest: "hasat", character: "özellik", highlight: "öne çıkan bilgi", office: "merkez ofis", factory: "fabrika", address: "adres", phone: "telefon", email: "e-posta", form: "form", placeholder: "örnek metin", message: "mesaj", submit: "gönder", sending: "gönderim", success: "başarı", error: "hata", map: "harita", reset: "sıfırlama", directions: "yol tarifi", kvkk: "KVKK", consent: "onay", link: "bağlantı", home: "ana sayfa", back: "geri dönüş", section: "bölüm", meta: "üst bilgi", index: "sıra numarası", word: "kelime", since: "kuruluş", start: "başlangıç", year: "yıl", final: "kapanış", progress: "ilerleme", skip: "atlama", system: "sistem", count: "sayı", values: "değerler", selection: "seçim", approach: "yaklaşım", fact: "bilgi", white: "açık alan", kicker: "kısa üst başlık",
};

function fieldLabel(field: string) {
  if (labels[field]) return labels[field];
  const activityMedia = field.match(/^activityCard(\d+)$/);
  if (activityMedia) return `Faaliyet görseli ${activityMedia[1]}`;
  const productMedia = field.match(/^product(\d+)$/);
  if (productMedia) return `Ürün görseli ${productMedia[1]}`;
  const detailMedia = field.match(/^detailProduct(\d+)$/);
  if (detailMedia) return `Ürün detay görseli ${detailMedia[1]}`;
  const heroSlide = field.match(/^slide([123])_(title|eyebrow|description)$/);
  if (heroSlide) {
    const presentation = { "1": [3, "Video"], "2": [1, "Fotoğraf 1"], "3": [2, "Fotoğraf 2"] } as const;
    const [position, media] = presentation[heroSlide[1] as "1" | "2" | "3"];
    const part = heroSlide[2] === "title" ? "Ana başlık" : heroSlide[2] === "eyebrow" ? "Üst etiket" : "Açıklama";
    return `${position}. slayt · ${media} · ${part}`;
  }
  const translated = field.split("_").map(token => {
    if (/^\d+$/.test(token)) return `${token}.`;
    return fieldWords[token] ?? token;
  }).join(" ");
  return translated.charAt(0).toLocaleUpperCase("tr") + translated.slice(1);
}

function cloneSections(sections: HomeSection[]) {
  return structuredClone(sections);
}

function runsToCharacters(runs: RichText) {
  return runs.flatMap(run => run.text.split("").map(char => ({ char, bold: run.bold, italic: run.italic, color: run.color })));
}

function charactersToRuns(chars: Array<{ char: string; bold?: boolean; italic?: boolean; color?: string }>): RichText {
  const result: TextRun[] = [];
  for (const char of chars) {
    const last = result.at(-1);
    if (last && last.bold === char.bold && last.italic === char.italic && last.color === char.color) last.text += char.char;
    else result.push({ text: char.char, ...(char.bold !== undefined ? { bold: char.bold } : {}), ...(char.italic !== undefined ? { italic: char.italic } : {}), ...(char.color ? { color: char.color } : {}) });
  }
  return result.length ? result : [{ text: "" }];
}

function RichTextEditor({ runs, defaultRuns, textEditable, onChange }: { runs: RichText; defaultRuns: RichText; textEditable: boolean; onChange: (runs: RichText) => void }) {
  const textarea = useRef<HTMLTextAreaElement>(null);
  const colorButton = useRef<HTMLButtonElement>(null);
  const text = plainText(runs);
  const activeColor = runs.find(run => run.color)?.color;
  const [colorOpen, setColorOpen] = useState(false);
  const [colorValue, setColorValue] = useState(activeColor ?? "#171a16");
  const [colorError, setColorError] = useState("");
  const [colorPosition, setColorPosition] = useState({ top: 0, left: 0, width: 360 });

  function toggleColorPanel() {
    setColorValue(activeColor ?? "#171a16");
    setColorError("");
    setColorOpen(open => {
      if (!open && colorButton.current) {
        const rect = colorButton.current.getBoundingClientRect();
        const width = Math.min(360, window.innerWidth - 24);
        setColorPosition({ top: Math.min(rect.bottom + 8, window.innerHeight - 300), left: Math.max(12, Math.min(rect.left, window.innerWidth - width - 12)), width });
      }
      return !open;
    });
  }

  function range() {
    const start = textarea.current?.selectionStart ?? 0;
    const end = textarea.current?.selectionEnd ?? start;
    return start === end ? [0, text.length] as const : [start, end] as const;
  }

  function toggle(kind: "bold" | "italic") {
    const chars = runsToCharacters(runs);
    const [start, end] = range();
    const enabled = chars.slice(start, end).length > 0 && chars.slice(start, end).every(char => char[kind] === true);
    for (let index = start; index < end; index++) chars[index][kind] = !enabled;
    onChange(charactersToRuns(chars));
  }

  function applyColor(color?: string) {
    const chars = runsToCharacters(runs);
    const [start, end] = range();
    for (let index = start; index < end; index++) chars[index].color = color;
    onChange(charactersToRuns(chars));
  }

  function submitColor() {
    const value = colorValue.trim();
    if (!safeColor.test(value)) {
      setColorError("#RGB, #RRGGBB, #RRGGBBAA veya rgba(0, 0, 0, 0.5) kullanın.");
      return;
    }
    applyColor(value);
    setColorError("");
    setColorOpen(false);
  }

  function resetColor() {
    const chars = runsToCharacters(runs);
    const baseline = runsToCharacters(defaultRuns);
    const fallback = defaultRuns.find(run => run.color)?.color;
    const [start, end] = range();
    for (let index = start; index < end; index++) chars[index].color = baseline[index]?.color ?? fallback;
    onChange(charactersToRuns(chars));
    setColorValue(fallback ?? "#171a16");
    setColorError("");
    setColorOpen(false);
  }

  function clearFormatting() {
    const chars = runsToCharacters(runs);
    const [start, end] = range();
    for (let index = start; index < end; index++) { chars[index].bold = undefined; chars[index].italic = undefined; chars[index].color = undefined; }
    onChange(charactersToRuns(chars));
  }

  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white transition focus-within:border-black/20 focus-within:shadow-[0_10px_30px_rgba(30,40,32,.06)]">
      <div className="flex flex-wrap items-center gap-1 border-b border-black/[0.07] bg-[#f8f8f5] px-3 py-2">
        <button type="button" onClick={() => toggle("bold")} className="rounded-lg p-2 text-black/50 transition hover:bg-white hover:text-black" title="Seçili metni kalın yap"><Bold size={15} /></button>
        <button type="button" onClick={() => toggle("italic")} className="rounded-lg p-2 text-black/50 transition hover:bg-white hover:text-black" title="Seçili metni italik yap"><Italic size={15} /></button>
        <button
          ref={colorButton}
          type="button"
          onMouseDown={event => event.preventDefault()}
          onClick={toggleColorPanel}
          className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] transition hover:bg-white ${colorOpen ? "bg-white text-black" : "text-black/45"}`}
          aria-expanded={colorOpen}
        >
          <span className="h-4 w-4 rounded-full border border-black/15" style={{ background: activeColor ?? "#171a16" }} />
          <Palette size={14} />Renk
        </button>
        <button type="button" onClick={clearFormatting} className="ml-auto rounded-lg px-2 py-1.5 text-[10px] font-medium text-black/35 transition hover:bg-white hover:text-black">Biçimi temizle</button>
        {colorOpen && typeof document !== "undefined" && createPortal(<><button type="button" aria-label="Renk menüsünü kapat" onClick={() => setColorOpen(false)} className="fixed inset-0 z-[80] cursor-default" /><div className="fixed z-[90] rounded-xl border border-black/[0.1] bg-white p-3 shadow-[0_18px_50px_rgba(22,46,36,.18)]" style={colorPosition}>
          <div className="flex items-center justify-between gap-3"><p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-black/35">Renk paleti</p><button type="button" onClick={resetColor} className="rounded-lg bg-black/[0.04] px-2.5 py-1.5 text-[10px] font-semibold text-black/50 transition hover:bg-black/[0.08] hover:text-black">Rengi sıfırla</button></div>
          <div className="mt-3 flex items-center gap-2"><label className="flex h-9 items-center gap-2 rounded-lg border border-black/10 px-2 text-[10px] font-semibold text-black/45"><input type="color" value={safeColor.test(colorValue) && colorValue.startsWith("#") && colorValue.length === 7 ? colorValue : "#24734d"} onChange={event => { setColorValue(event.target.value); applyColor(event.target.value); }} className="h-6 w-8 cursor-pointer border-0 bg-transparent p-0" />Seç</label><div className="grid flex-1 grid-cols-6 gap-2">{colorScale.map(color => <button key={color} type="button" onClick={() => { applyColor(color); setColorValue(color); setColorError(""); setColorOpen(false); }} className="h-7 rounded-lg border border-black/10 shadow-sm transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#24734d]/35" style={{ background: color }} title={color} aria-label={`${color} rengini uygula`} />)}</div></div>
          <div className="mt-3 flex gap-2"><input value={colorValue} onChange={event => { setColorValue(event.target.value); setColorError(""); }} onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); submitColor(); } }} placeholder="#24734d veya rgba(36, 115, 77, 0.8)" spellCheck={false} className="h-10 min-w-0 flex-1 rounded-xl border border-black/[0.09] bg-[#fafaf7] px-3 font-mono text-[11px] outline-none transition focus:border-[#24734d]/45" aria-label="HEX veya RGBA renk kodu" /><button type="button" onClick={submitColor} className="h-10 rounded-xl bg-[#173e2e] px-4 text-[11px] font-semibold text-white transition hover:bg-[#24734d]">Uygula</button></div>
          {colorError && <p className="mt-2 text-[10px] text-red-600" role="alert">{colorError}</p>}
        </div></>, document.body)}
      </div>
      <textarea
        ref={textarea}
        value={text}
        readOnly={!textEditable}
        onChange={event => onChange([{ text: event.target.value }])}
        rows={Math.min(7, Math.max(2, Math.ceil(text.length / 90)))}
        className={`admin-scrollbar block w-full resize-y bg-white px-4 py-3 text-[14px] leading-6 outline-none ${textEditable ? "text-[#19211b]" : "cursor-default bg-black/[0.018] text-black/55"}`}
      />
      <div className="border-t border-black/[0.06] px-4 py-3">
        <div className="mb-2 flex items-center justify-between gap-3"><p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-black/30">Biçim önizleme</p><span className="text-[9px] tabular-nums text-black/25">{text.length} karakter</span></div>
        <p className="min-h-6 text-[14px] leading-6 text-[#19211b]">
          {runs.map((run, index) => <span key={index} style={{ fontWeight: run.bold ? 700 : undefined, fontStyle: run.italic ? "italic" : undefined, color: run.color }}>{run.text}</span>)}
        </p>
      </div>
    </div>
  );
}

const assetPreviews: Record<string, string> = { "asset:hero3": hero3.src, "asset:hero4": hero4.src, "asset:icon": icon.src };

function MediaEditor({ pageKey, slot, media, onChange }: { pageKey: PageKey; slot: string; media: MediaReference; onChange: (url: string | null) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const isVideo = /\.(?:mp4|webm|mov)$/i.test(media.localDefault);
  const preview = media.externalUrl || assetPreviews[media.localDefault] || media.localDefault;
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function upload(file?: File) {
    if (!file || uploading) return;
    setUploading(true);
    setMessage(null);
    const form = new FormData();
    form.set("pageKey", pageKey);
    form.set("slot", slot);
    form.set("file", file);
    try {
      const response = await fetch("/api/admin/media", { method: "POST", body: form });
      const result = await response.json().catch(() => ({ message: "Sunucu yanıtı okunamadı." }));
      if (response.status === 401) { window.location.assign("/admin/login"); return; }
      if (!response.ok || typeof result.url !== "string") throw new Error(result.message || "Yükleme başarısız.");
      onChange(result.url);
      setMessage({ type: "success", text: result.message });
    } catch (error) {
      setMessage({ type: "error", text: error instanceof Error ? error.message : "Yükleme başarısız." });
    } finally {
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  }

  return (
    <div className="rounded-2xl border border-black/[0.07] bg-[#fafaf7] p-3">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-black/45">{isVideo ? <Film size={14} /> : <ImageIcon size={14} />}<p className="text-[10px] font-semibold uppercase tracking-[0.12em]">{fieldLabel(slot)}</p></div>
        <span className="rounded-full bg-black/[0.04] px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-black/35">{isVideo ? "Video" : "Görsel"}</span>
      </div>
      <div className="relative aspect-video overflow-hidden rounded-xl bg-[#e8e7e0]">
        {isVideo ? <video src={preview} muted playsInline controls className="h-full w-full object-cover" /> : <Image src={preview} alt={`${fieldLabel(slot)} önizlemesi`} fill unoptimized sizes="280px" className="object-cover" />}
      </div>
      <input ref={input} type="file" accept={isVideo ? "video/mp4,video/webm,video/quicktime" : "image/jpeg,image/png,image/webp,image/gif,image/avif"} onChange={event => upload(event.target.files?.[0])} className="hidden" />
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" disabled={uploading} onClick={() => input.current?.click()} className="flex h-9 items-center justify-center gap-2 rounded-xl bg-[#173e2e] px-3 text-[10px] font-semibold text-white transition hover:bg-[#24734d] disabled:cursor-wait disabled:opacity-60">{uploading ? <LoaderCircle size={13} className="animate-spin" /> : <Upload size={13} />}{uploading ? "Yükleniyor" : "Dosya yükle"}</button>
        <button type="button" disabled={!media.externalUrl || uploading} onClick={() => { onChange(null); setMessage({ type: "success", text: "Yerel varsayılan seçildi. Kaydet'e basın." }); }} className="flex h-9 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-3 text-[10px] font-semibold text-black/50 transition hover:text-black disabled:opacity-35"><RotateCcw size={13} />Varsayılana dön</button>
      </div>
      <label className="mt-3 block"><span className="mb-1.5 block text-[9px] font-semibold uppercase tracking-[0.12em] text-black/30">HTTPS medya adresi</span><input value={media.externalUrl ?? ""} onChange={event => { onChange(event.target.value.trim() || null); setMessage(null); }} placeholder="https://..." className="h-10 w-full rounded-xl border border-black/[0.08] bg-white px-3 text-[10px] outline-none focus:border-black/20" /></label>
      <p className="mt-2 truncate font-mono text-[8px] text-black/25" title={media.localDefault}>Varsayılan: {media.localDefault}</p>
      <p className="mt-1 text-[8px] leading-4 text-black/30">{isVideo ? "MP4, WebM, MOV · en fazla 150 MB" : "JPG, PNG, WebP, GIF, AVIF · en fazla 20 MB"}</p>
      {message && <p className={`mt-2 text-[9px] leading-4 ${message.type === "success" ? "text-emerald-700" : "text-red-600"}`} role="status">{message.text}</p>}
    </div>
  );
}

export default function AdminEditor({ initialSections }: { initialSections: HomeSection[] }) {
  const router = useRouter();
  const [saved, setSaved] = useState(() => cloneSections(initialSections));
  const [drafts, setDrafts] = useState(() => cloneSections(initialSections));
  const [activeKey, setActiveKey] = useState<PageKey>("hero");
  const [locale, setLocale] = useState<Locale>("tr");
  const [sidebarQuery, setSidebarQuery] = useState("");
  const [contentQuery, setContentQuery] = useState("");
  const [activeAreaKey, setActiveAreaKey] = useState<AdminAreaKey>("home");
  const [activePanelSectionId, setActivePanelSectionId] = useState("home-welcome");
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const section = drafts.find(item => item.pageKey === activeKey)!;
  const savedSection = saved.find(item => item.pageKey === activeKey)!;
  const activePanelSection = panelSections.find(item => item.id === activePanelSectionId)!;
  const dirty = JSON.stringify(panelSectionSnapshot(section, activePanelSection)) !== JSON.stringify(panelSectionSnapshot(savedSection, activePanelSection));
  const anyDirty = drafts.some(item => JSON.stringify(item) !== JSON.stringify(saved.find(savedItem => savedItem.pageKey === item.pageKey)));
  const dirtyCount = drafts.filter(item => JSON.stringify(item) !== JSON.stringify(saved.find(savedItem => savedItem.pageKey === item.pageKey))).length;
  const pageTint = pageTints[activeKey];
  const activeArea = adminAreas.find(area => area.key === activeAreaKey)!;
  const rules = policy[activeKey] as Record<string, { textEditable: boolean }>;

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => { if (anyDirty) event.preventDefault(); };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [anyDirty]);

  const sidebarSearch = sidebarQuery.toLocaleLowerCase("tr");
  const visibleAreas = adminAreas.map(area => ({
    ...area,
    sections: area.sections.filter(item => !sidebarSearch || area.label.toLocaleLowerCase("tr").includes(sidebarSearch) || item.label.toLocaleLowerCase("tr").includes(sidebarSearch) || item.description.toLocaleLowerCase("tr").includes(sidebarSearch) || item.group?.toLocaleLowerCase("tr").includes(sidebarSearch)),
  })).filter(area => !sidebarSearch || area.sections.length > 0);

  const activeFieldCounts = {
    tr: Object.keys(section.content.tr).filter(field => isVisibleSiteContent(field) && activePanelSection.matchesField(field)).length,
    en: Object.keys(section.content.en).filter(field => isVisibleSiteContent(field) && activePanelSection.matchesField(field)).length,
  };

  const fields = Object.entries(section.content[locale]).filter(([field, runs]) => {
    if (!isVisibleSiteContent(field) || !activePanelSection.matchesField(field)) return false;
    const query = contentQuery.toLocaleLowerCase(locale === "tr" ? "tr" : "en");
    return !query || fieldLabel(field).toLocaleLowerCase(locale === "tr" ? "tr" : "en").includes(query) || plainText(runs).toLocaleLowerCase(locale === "tr" ? "tr" : "en").includes(query) || field.toLowerCase().includes(query);
  }).sort(([left], [right]) => activeKey === "hero" ? heroFieldOrder.indexOf(left) - heroFieldOrder.indexOf(right) : 0);

  const mediaEntries = Object.entries(section.media ?? {}).filter(([slot]) => !activePanelSection.mediaSlots || activePanelSection.mediaSlots.includes(slot));

  function changeSection(update: (section: HomeSection) => void) {
    setDrafts(current => current.map(item => {
      if (item.pageKey !== activeKey) return item;
      const copy = structuredClone(item);
      update(copy);
      return copy;
    }));
    setNotice(null);
  }

  function selectPanelSection(areaKey: AdminAreaKey, item: AdminPanelSection) {
    setActiveAreaKey(areaKey);
    setActivePanelSectionId(item.id);
    setActiveKey(item.pageKey);
    setContentQuery("");
    setNotice(null);
    setMobileNavigationOpen(false);
  }

  function areaHasDraft(area: AdminArea) {
    return area.sections.some(item => {
      const current = drafts.find(sectionItem => sectionItem.pageKey === item.pageKey);
      const baseline = saved.find(sectionItem => sectionItem.pageKey === item.pageKey);
      if (!current || !baseline) return false;
      return JSON.stringify(panelSectionSnapshot(current, item)) !== JSON.stringify(panelSectionSnapshot(baseline, item));
    });
  }

  async function save() {
    if (!dirty || saving) return;
    setSaving(true);
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/content/${activeKey}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(section) });
      const result = await response.json().catch(() => ({ message: "Sunucu yanıtı okunamadı." }));
      if (response.status === 401) { router.replace("/admin/login"); router.refresh(); return; }
      if (!response.ok) throw new Error(result.message);
      setSaved(current => current.map(item => item.pageKey === activeKey ? structuredClone(result.section) : item));
      setDrafts(current => current.map(item => item.pageKey === activeKey ? structuredClone(result.section) : item));
      setNotice({ type: "success", text: result.message });
      router.refresh();
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Kaydetme başarısız." });
    } finally { setSaving(false); }
  }

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase("tr") === "s") {
        event.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => window.removeEventListener("keydown", handleShortcut);
  });

  function cancel() {
    setDrafts(current => current.map(item => {
      if (item.pageKey !== activeKey) return item;
      const copy = structuredClone(item);
      for (const language of ["tr", "en"] as Locale[]) {
        for (const field of Object.keys(copy.content[language])) {
          if (isVisibleSiteContent(field) && activePanelSection.matchesField(field)) copy.content[language][field] = structuredClone(savedSection.content[language][field]);
        }
      }
      for (const slot of Object.keys(copy.media ?? {})) {
        if (!activePanelSection.mediaSlots || activePanelSection.mediaSlots.includes(slot)) copy.media![slot] = structuredClone(savedSection.media![slot]);
      }
      return copy;
    }));
    setNotice(null);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <main className="min-h-dvh bg-[#f4f3ee] text-[#182019] lg:grid lg:grid-cols-[292px_minmax(0,1fr)]">
      <aside className="admin-scrollbar relative z-50 border-b border-black/[0.08] bg-[#162e24] text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-[292px] lg:overflow-y-auto lg:border-b-0 lg:border-r lg:border-white/10">
        <div className="flex min-h-full flex-col p-5">
          <div className="flex items-center justify-between px-2 py-4">
            <Image src={logo} alt="Toprak Tarım" className="h-auto w-[142px] brightness-0 invert" priority />
            <div className="flex items-center gap-2"><span className="hidden rounded-full border border-white/15 bg-white/[0.07] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/55 sm:inline-flex">Admin</span><button type="button" onClick={() => setMobileNavigationOpen(value => !value)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/70 lg:hidden" aria-label={mobileNavigationOpen ? "Yönetim menüsünü kapat" : "Yönetim menüsünü aç"} aria-expanded={mobileNavigationOpen}>{mobileNavigationOpen ? <X size={18} /> : <Menu size={18} />}</button></div>
          </div>
          <div className={`${mobileNavigationOpen ? "flex" : "hidden"} flex-1 flex-col lg:flex`}>
          <label className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 transition focus-within:border-white/25 focus-within:bg-white/[0.09]">
            <Search size={15} className="text-white/35" />
            <input value={sidebarQuery} onChange={event => setSidebarQuery(event.target.value)} placeholder="Sayfalarda ara" className="h-11 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-white/30" />
          </label>
          <nav className="mt-8 flex-1">
            <Link href="/admin/header-footer" onClick={() => setMobileNavigationOpen(false)} className="mb-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.05] px-3 py-3 text-white/65 transition hover:bg-white/[0.1] hover:text-white"><Globe2 size={15} /><span className="min-w-0 flex-1"><span className="block text-[12px] font-semibold">Genel Ayarlar</span><span className="mt-0.5 block text-[9px] text-white/30">Header, Footer ve menü başlıkları</span></span><ChevronRight size={14} /></Link>
            <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">Site sayfaları</p>
            <div className="space-y-2">
              {visibleAreas.map(area => {
                const AreaIcon = area.icon;
                const expanded = Boolean(sidebarSearch) || activeAreaKey === area.key;
                return <div key={area.key}>
                  <button type="button" aria-expanded={expanded} onClick={() => {
                    setActiveAreaKey(area.key);
                    if (!area.sections.some(item => item.id === activePanelSectionId)) {
                      const next = area.sections[0];
                      setActivePanelSectionId(next.id);
                      setActiveKey(next.pageKey);
                      setContentQuery("");
                      setNotice(null);
                    }
                  }} className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${activeAreaKey === area.key && !sidebarSearch ? "bg-white/[0.1] text-white" : "text-white/65 hover:bg-white/[0.07] hover:text-white"}`}>
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.07]"><AreaIcon size={16} style={{ color: area.color }} /></span>
                    <span className="min-w-0 flex-1"><span className="block text-[13px] font-semibold">{area.label}</span><span className="mt-0.5 block truncate text-[9px] text-white/30">{area.description}</span></span>
                    {areaHasDraft(area) && <span className="h-2 w-2 rounded-full bg-[#f07d00]" title="Kaydedilmemiş değişiklik" />}
                    {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  {expanded && <div className="ml-6 mt-1 space-y-1 border-l border-white/10 pl-3">{area.sections.map((item, itemIndex) => {
                    const active = item.id === activePanelSectionId;
                    const current = drafts.find(sectionItem => sectionItem.pageKey === item.pageKey);
                    const baseline = saved.find(sectionItem => sectionItem.pageKey === item.pageKey);
                    const itemDirty = Boolean(current && baseline) && JSON.stringify(panelSectionSnapshot(current!, item)) !== JSON.stringify(panelSectionSnapshot(baseline!, item));
                    const showGroup = item.group && area.sections[itemIndex - 1]?.group !== item.group;
                    return <div key={item.id} className={item.group ? "ml-2" : undefined}>{showGroup && <p className="mb-1 mt-3 px-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/35">{item.group}</p>}<button type="button" aria-current={active ? "page" : undefined} onClick={() => selectPanelSection(area.key, item)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${active ? "bg-white text-[#172019] shadow-md" : "text-white/55 hover:bg-white/[0.07] hover:text-white"}`}><span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-semibold">{item.label}</span><span className={`mt-0.5 block truncate text-[9px] ${active ? "text-black/35" : "text-white/25"}`}>{item.description}</span></span>{itemDirty && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#f07d00]" />}</button></div>;
                  })}</div>}
                </div>;
              })}
            </div>
            {!visibleAreas.length && <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-6 text-center text-[11px] leading-5 text-white/40">Aramanızla eşleşen bir bölüm bulunamadı.</div>}
          </nav>
          <div className="mt-8 space-y-2"><Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-3 text-[12px] text-white/45 transition hover:bg-white/[0.07] hover:text-white"><ExternalLink size={15} />Siteyi yeni sekmede aç</Link><button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[12px] text-white/45 transition hover:bg-white/[0.07] hover:text-white"><LogOut size={15} />Güvenli çıkış</button></div>
          </div>
        </div>
      </aside>

      <section className="min-w-0 lg:col-start-2">
        <header className="sticky top-0 z-40 border-b border-black/[0.08] bg-[#f4f3ee]/90 px-5 py-3 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-3">
            <div className="mr-auto min-w-0"><p className="truncate text-[12px] text-black/35">{activeArea.label} / {activePanelSection.group ? `${activePanelSection.group} / ` : ""}{activePanelSection.label}</p><p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em]" style={{ color: dirty ? "#e86f12" : activeArea.color }}>{dirty ? "Bu bölümde kaydedilmemiş değişiklik var" : dirtyCount ? `${dirtyCount} içerik kaydında kaydedilmemiş değişiklik var` : "Tüm değişiklikler kayıtlı"}</p></div>
            {notice && <div className={`order-last flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[11px] md:order-none md:w-auto ${notice.type === "success" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>{notice.type === "success" ? <Check size={14} /> : <CircleAlert size={14} />}{notice.text}</div>}
            <Link href={activePanelSection.preview} target="_blank" className="hidden h-10 items-center gap-2 rounded-xl border border-black/10 bg-white px-3 text-[11px] font-semibold text-black/50 transition hover:border-black/20 hover:text-black sm:flex"><ExternalLink size={14} />Önizle</Link>
            <button onClick={cancel} disabled={!dirty || saving} className="flex h-10 items-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-[12px] font-semibold text-black/55 transition hover:border-black/20 hover:text-black disabled:cursor-not-allowed disabled:opacity-35"><RotateCcw size={14} />İptal</button>
            <button onClick={save} disabled={!dirty || saving} className="flex h-10 items-center gap-2 rounded-xl px-4 text-[12px] font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40" style={{ background: activeArea.color }} title="Kaydet (Ctrl/⌘ + S)"><Save size={14} />{saving ? "Kaydediliyor" : "Kaydet"}</button>
          </div>
        </header>

        <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <div className="rounded-[28px] border border-black/[0.07] p-6 sm:p-8" style={{ background: pageTint }}>
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div><span className="inline-flex rounded-full bg-white/75 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em]" style={{ color: activeArea.color }}>{activeArea.label}</span><h1 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] font-medium leading-none tracking-[-0.055em]">{activePanelSection.label}</h1><p className="mt-4 max-w-xl text-sm leading-6 text-black/50">{activePanelSection.description}</p></div>
              <div className="rounded-2xl border border-black/[0.07] bg-white/70 px-4 py-3"><p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-black/30">Sayfada görüntüle</p><p className="mt-1.5 font-mono text-[12px] text-black/60">{activePanelSection.preview}</p></div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
            <div className="min-w-0 space-y-6">
              <section className="overflow-hidden rounded-[24px] border border-black/[0.07] bg-white">
                <div className="sticky top-[65px] z-20 border-b border-black/[0.07] bg-white/95 p-5 backdrop-blur-lg sm:p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center"><div className="mr-auto flex items-center gap-3"><Type size={17} style={{ color: activeArea.color }} /><div><h2 className="text-[15px] font-semibold">{activePanelSection.label} metinleri</h2><p className="mt-1 text-[11px] text-black/40">{fields.length} alan gösteriliyor · {locale === "tr" ? "Türkçe içerik" : "English content"}</p></div></div><div className="flex rounded-xl bg-black/[0.045] p-1" aria-label="Düzenleme dili">{(["tr", "en"] as Locale[]).map(language => <button key={language} type="button" aria-pressed={locale === language} onClick={() => setLocale(language)} className={`flex h-9 items-center gap-2 rounded-lg px-4 text-[11px] font-semibold transition ${locale === language ? "bg-white text-black shadow-sm" : "text-black/35 hover:text-black"}`}><Languages size={13} />{language === "tr" ? "Türkçe" : "English"}</button>)}</div></div>
                  <label className="mt-4 flex items-center gap-3 rounded-xl border border-black/[0.08] bg-[#fafaf7] px-3.5 focus-within:border-black/20"><Search size={15} className="text-black/30" /><input value={contentQuery} onChange={event => setContentQuery(event.target.value)} placeholder="Alan başlığı veya içerikte ara" className="h-11 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-black/30" />{contentQuery && <button type="button" onClick={() => setContentQuery("")} className="rounded-lg p-1.5 text-black/30 transition hover:bg-black/[0.05] hover:text-black" aria-label="İçerik aramasını temizle"><X size={14} /></button>}</label>
                </div>
                <div className="admin-scrollbar max-h-[calc(100dvh-250px)] space-y-5 overflow-y-auto p-5 sm:p-6">
                  {fields.map(([field, runs]) => {
                    const textEditable = rules[field]?.textEditable !== false;
                    const defaultRuns = defaults.find(item => item.pageKey === activeKey)!.content[locale][field];
                    return <article key={field} className="rounded-[20px] border border-black/[0.065] bg-[#fcfcfa] p-4 sm:p-5"><div className="mb-3 flex flex-wrap items-start justify-between gap-3"><h3 className="text-[13px] font-semibold text-[#19211b]">{fieldLabel(field)}</h3><span className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${textEditable ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{textEditable ? "Metin düzenlenebilir" : "Metin sabit · biçim açık"}</span></div><RichTextEditor runs={runs} defaultRuns={defaultRuns} textEditable={textEditable} onChange={next => changeSection(copy => { copy.content[locale][field] = next; })} /></article>;
                  })}
                  {!fields.length && <div className="py-16 text-center"><Search size={24} className="mx-auto text-black/20" /><p className="mt-3 text-sm text-black/40">Aramanızla eşleşen içerik bulunamadı.</p></div>}
                </div>
              </section>
            </div>

            <aside className="space-y-6">
              <section className="rounded-[24px] border border-black/[0.07] bg-white p-5"><h2 className="text-[13px] font-semibold">Bölüm özeti</h2><div className="mt-4 space-y-3 text-[11px]"><div className="flex justify-between border-b border-black/[0.06] pb-3 text-black/45"><span>Türkçe metin</span><strong className="text-black/70">{activeFieldCounts.tr}</strong></div><div className="flex justify-between border-b border-black/[0.06] pb-3 text-black/45"><span>İngilizce metin</span><strong className="text-black/70">{activeFieldCounts.en}</strong></div><div className="flex justify-between text-black/45"><span>Durum</span><strong style={{ color: dirty ? "#e86f12" : "#24734d" }}>{dirty ? "Taslak" : "Kayıtlı"}</strong></div></div></section>
              <section className="rounded-[24px] border border-black/[0.07] bg-white p-5"><h2 className="text-[13px] font-semibold">{activePanelSection.label} medyaları</h2><p className="mt-1 text-[10px] leading-4 text-black/35">Bu alt bölüme ait dosyalar burada gösterilir.</p>{mediaEntries.length ? <div className="mt-4 space-y-4">{mediaEntries.map(([slot, media]) => <MediaEditor key={`${activeKey}-${slot}`} pageKey={activeKey} slot={slot} media={media} onChange={url => changeSection(copy => { if (copy.media) copy.media[slot].externalUrl = url; })} />)}</div> : <div className="mt-4 rounded-xl bg-[#faf4e7] p-4 text-[11px] leading-5 text-[#76551e]">{activeAreaKey === "contact" ? "Google haritası, merkez ofis ve fabrika konumları sabittir; panelden değiştirilemez." : "Bu alt bölümde değiştirilebilir fotoğraf veya video bulunmuyor."}</div>}</section>
              <section className="rounded-[24px] border border-black/[0.07] bg-[#19211b] p-5 text-white"><h2 className="text-[13px] font-semibold">Güvenli düzenleme</h2><ul className="mt-4 space-y-3 text-[11px] leading-5 text-white/50"><li>• URL ve teknik anahtarlar kilitlidir.</li><li>• Harita adresleri ve koordinatları sabittir.</li><li>• Sabit başlıklarda yalnızca biçim değişir.</li><li>• İptal, son kayıtlı sürüme döner.</li></ul></section>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
