"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronLeft,
  CircleAlert,
  Contact,
  ExternalLink,
  Globe2,
  Languages,
  Link2,
  LogOut,
  Menu,
  Navigation,
  PanelsTopLeft,
  RotateCcw,
  Save,
  Scale,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

import logo from "@/assets/logo.png";
import type { SiteChrome, SiteLocale } from "@/features/site-chrome/model";

const clone = (value: SiteChrome) => structuredClone(value);

const navigationNames: Record<string, string> = {
  home: "Ana sayfa bağlantısı",
  corporate: "Kurumsal menüsü",
  activities: "Faaliyetler menüsü",
  contact: "İletişim bağlantısı",
};

const childNames: Record<string, string> = {
  about: "Hakkımızda",
  vision: "Vizyon",
  mission: "Misyon",
  production: "Üretim",
  products: "Ürünler",
};

const legalNames: Record<string, string> = {
  kvkk: "KVKK Aydınlatma Metni",
  cookies: "Çerez Politikası",
  "information-society": "Bilgi Toplumu Hizmetleri",
};

export default function SiteChromeEditor({ initialContent }: { initialContent: SiteChrome }) {
  const router = useRouter();
  const [saved, setSaved] = useState(() => clone(initialContent));
  const [draft, setDraft] = useState(() => clone(initialContent));
  const [locale, setLocale] = useState<SiteLocale>("tr");
  const [query, setQuery] = useState("");
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const dirty = JSON.stringify(saved) !== JSON.stringify(draft);
  const search = query.toLocaleLowerCase(locale === "tr" ? "tr" : "en");
  const matches = (...values: string[]) => !search || values.some(value => value.toLocaleLowerCase(locale === "tr" ? "tr" : "en").includes(search));

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => { if (dirty) event.preventDefault(); };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  const visibleNavigation = draft.navigation
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => matches(navigationNames[item.key] ?? item.key, item.label[locale], item.description?.[locale] ?? "", item.href, ...item.children.flatMap(child => [childNames[child.key] ?? child.key, child.label[locale]])));

  const showBrand = matches("marka", "logo", "footer açıklaması", "kayan yazı", draft.brand.tagline[locale], ...draft.brand.marquee[locale]);
  const showContact = matches("iletişim", "adres", "telefon", "e-posta", draft.contact.address.display[locale]);
  const showSocials = matches("sosyal medya", ...draft.socials.flatMap(item => [item.label, item.key]));
  const showFooter = matches("footer", "yasal", "telif", draft.footer.copyright[locale], ...draft.footer.legalLinks.map(item => item.label[locale]));
  const hasResults = showBrand || visibleNavigation.length > 0 || showContact || showSocials || showFooter;

  function update(mutator: (copy: SiteChrome) => void) {
    setDraft(current => {
      const copy = clone(current);
      mutator(copy);
      return copy;
    });
    setNotice(null);
  }

  async function save() {
    if (!dirty || saving) return;
    setSaving(true);
    setNotice(null);
    try {
      const response = await fetch("/api/admin/site-chrome", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const result = await response.json().catch(() => ({ message: "Sunucu yanıtı okunamadı." }));
      if (response.status === 401) {
        router.replace("/admin/login");
        router.refresh();
        return;
      }
      if (!response.ok) throw new Error(result.message);
      setSaved(clone(result.content));
      setDraft(clone(result.content));
      setNotice({ type: "success", text: result.message });
      router.refresh();
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "Kaydetme başarısız." });
    } finally {
      setSaving(false);
    }
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

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  function field(
    label: string,
    value: string,
    onChange: (value: string) => void,
    options: { multiline?: boolean; hint?: string; maxLength?: number } = {},
  ) {
    const { multiline = false, hint, maxLength = 1200 } = options;
    return (
      <label className="block">
        <span className="mb-2 flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/35"><span>{label}</span><span className="font-normal tabular-nums tracking-normal text-black/20">{value.length}/{maxLength}</span></span>
        {multiline ? (
          <textarea value={value} onChange={event => onChange(event.target.value)} maxLength={maxLength} rows={3} className="admin-scrollbar w-full resize-y rounded-xl border border-black/[0.09] bg-[#fafaf7] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#24734d]/45 focus:bg-white" />
        ) : (
          <input value={value} onChange={event => onChange(event.target.value)} maxLength={maxLength} className="h-11 w-full rounded-xl border border-black/[0.09] bg-[#fafaf7] px-4 text-sm outline-none transition focus:border-[#24734d]/45 focus:bg-white" />
        )}
        {hint && <span className="mt-1.5 block text-[10px] leading-4 text-black/30">{hint}</span>}
      </label>
    );
  }

  return (
    <main className="min-h-dvh bg-[#f4f3ee] text-[#182019] lg:grid lg:grid-cols-[292px_minmax(0,1fr)]">
      <aside className="admin-scrollbar relative z-50 border-b border-white/10 bg-[#162e24] text-white lg:fixed lg:inset-y-0 lg:w-[292px] lg:overflow-y-auto">
        <div className="flex min-h-full flex-col p-5">
          <div className="flex items-center justify-between px-2 py-4">
            <Image src={logo} alt="Toprak Tarım" className="h-auto w-[142px] brightness-0 invert" priority />
            <div className="flex items-center gap-2"><span className="hidden rounded-full border border-white/15 bg-white/[0.07] px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/55 sm:inline-flex">Admin</span><button type="button" onClick={() => setMobileNavigationOpen(value => !value)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-white/70 lg:hidden" aria-label={mobileNavigationOpen ? "Yönetim menüsünü kapat" : "Yönetim menüsünü aç"} aria-expanded={mobileNavigationOpen}>{mobileNavigationOpen ? <X size={18} /> : <Menu size={18} />}</button></div>
          </div>

          <div className={`${mobileNavigationOpen ? "flex" : "hidden"} flex-1 flex-col lg:flex`}>
            <Link href="/admin" onClick={() => setMobileNavigationOpen(false)} className="mt-6 flex items-center gap-2 rounded-xl px-3 py-3 text-[12px] text-white/50 transition hover:bg-white/[0.07] hover:text-white"><ChevronLeft size={15} />Sayfa içerikleri</Link>
            <div className="mt-3 rounded-2xl bg-white p-4 text-[#182019]"><div className="flex items-center gap-3"><span className="h-10 w-1 rounded-full bg-[#4d8f70]" /><div><p className="text-[13px] font-semibold">Header ve Footer</p><p className="mt-1 text-[10px] text-black/35">Tüm sayfalarda ortak alanlar</p></div></div></div>
            <label className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.06] px-3.5 transition focus-within:border-white/25"><Search size={15} className="text-white/35" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Ortak içerikte ara" className="h-11 min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-white/30" />{query && <button type="button" onClick={() => setQuery("")} className="rounded-lg p-1 text-white/35 hover:bg-white/10 hover:text-white" aria-label="Aramayı temizle"><X size={14} /></button>}</label>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4"><p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">Bu ekranda</p><ul className="mt-3 space-y-2 text-[11px] leading-5 text-white/50"><li>Marka ve logo metinleri</li><li>Üst ve alt menü başlıkları</li><li>Ortak iletişim bilgileri</li><li>Yasal ve sosyal bağlantı adları</li></ul></div>
            <div className="mt-auto space-y-2 pt-8"><Link href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-3 text-[12px] text-white/45 transition hover:bg-white/[0.07] hover:text-white"><ExternalLink size={15} />Siteyi yeni sekmede aç</Link><button type="button" onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[12px] text-white/45 transition hover:bg-white/[0.07] hover:text-white"><LogOut size={15} />Güvenli çıkış</button></div>
          </div>
        </div>
      </aside>

      <section className="min-w-0 lg:col-start-2">
        <header className="sticky top-0 z-40 border-b border-black/[0.08] bg-[#f4f3ee]/90 px-5 py-3 backdrop-blur-xl sm:px-8 lg:px-10">
          <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-3">
            <div className="mr-auto"><p className="text-[12px] text-black/35">Genel alanlar / Header ve Footer</p><p className={`mt-0.5 text-[10px] font-medium uppercase tracking-[0.14em] ${dirty ? "text-[#e86f12]" : "text-[#24734d]"}`}>{dirty ? "Kaydedilmemiş değişiklik var" : "Tüm değişiklikler kayıtlı"}</p></div>
            {notice && <span className={`order-last flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[11px] md:order-none md:w-auto ${notice.type === "success" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"}`}>{notice.type === "success" ? <Check size={14} /> : <CircleAlert size={14} />}{notice.text}</span>}
            <Link href="/" target="_blank" className="hidden h-10 items-center gap-2 rounded-xl border border-black/10 bg-white px-3 text-[11px] font-semibold text-black/50 transition hover:border-black/20 hover:text-black sm:flex"><ExternalLink size={14} />Önizle</Link>
            <button type="button" onClick={() => { setDraft(clone(saved)); setNotice(null); }} disabled={!dirty || saving} className="flex h-10 items-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-[12px] font-semibold text-black/55 disabled:cursor-not-allowed disabled:opacity-35"><RotateCcw size={14} />İptal</button>
            <button type="button" onClick={save} disabled={!dirty || saving} title="Kaydet (Ctrl/⌘ + S)" className="flex h-10 items-center gap-2 rounded-xl bg-[#24734d] px-4 text-[12px] font-semibold text-white transition hover:bg-[#1d6847] disabled:cursor-not-allowed disabled:opacity-40"><Save size={14} />{saving ? "Kaydediliyor" : "Kaydet"}</button>
          </div>
        </header>

        <div className="mx-auto max-w-[1180px] px-5 py-8 sm:px-8 lg:px-10">
          <div className="rounded-[28px] border border-black/[0.07] bg-[#edf7f1] p-6 sm:p-8">
            <span className="inline-flex rounded-full bg-white/80 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#24734d]">Ortak veri kaynağı</span>
            <h1 className="mt-4 text-[clamp(2.2rem,5vw,4rem)] font-medium leading-none tracking-[-0.055em]">Header ve Footer</h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-black/50">Buradaki metinler sitenin üst ve alt menüsünde birlikte güncellenir. Güvenlik için sayfa adresleri sabittir.</p>
          </div>

          <div className="sticky top-[65px] z-30 mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-black/[0.07] bg-white/95 p-3 shadow-sm backdrop-blur-lg">
            <div className="flex items-center gap-2 px-2 text-[12px] font-semibold"><Globe2 size={16} className="text-[#24734d]" />Düzenleme dili <span className="font-normal text-black/35">· {locale === "tr" ? "Türkçe içerik" : "English content"}</span></div>
            <div className="flex rounded-xl bg-black/[0.045] p-1" aria-label="Düzenleme dili">{(["tr", "en"] as SiteLocale[]).map(language => <button key={language} type="button" aria-pressed={locale === language} onClick={() => setLocale(language)} className={`flex h-9 items-center gap-2 rounded-lg px-4 text-[11px] font-semibold transition ${locale === language ? "bg-white shadow-sm" : "text-black/35 hover:text-black"}`}><Languages size={13} />{language === "tr" ? "Türkçe" : "English"}</button>)}</div>
          </div>

          <div className="admin-scrollbar mt-6 max-h-[calc(100dvh-205px)] space-y-6 overflow-y-auto pr-1">
            {showBrand && <section className="rounded-[24px] border border-black/[0.07] bg-white p-5 sm:p-6"><div className="flex items-center gap-3"><PanelsTopLeft size={18} className="text-[#24734d]" /><div><h2 className="text-[15px] font-semibold">Marka ve Footer açıklaması</h2><p className="mt-1 text-[11px] text-black/40">Logo erişilebilirlik metinleri, kısa marka anlatımı ve kayan kelimeler.</p></div></div><div className="mt-5 space-y-4">{field("Logo alternatif metni", draft.brand.logoAlt[locale], value => update(copy => { copy.brand.logoAlt[locale] = value; }), { maxLength: 160, hint: "Logo görüntülenemediğinde ve ekran okuyucularda kullanılır." })}{field("Ana sayfa erişilebilirlik etiketi", draft.brand.homeAria[locale], value => update(copy => { copy.brand.homeAria[locale] = value; }), { maxLength: 160 })}{field("Footer marka açıklaması", draft.brand.tagline[locale], value => update(copy => { copy.brand.tagline[locale] = value; }), { multiline: true, maxLength: 1200 })}<div><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/35">Kayan yazılar</p><div className="grid gap-3 sm:grid-cols-3">{draft.brand.marquee[locale].map((item, index) => <div key={index}>{field(`${index + 1}. kelime`, item, value => update(copy => { copy.brand.marquee[locale][index] = value; }), { maxLength: 80 })}</div>)}</div></div></div></section>}

            {visibleNavigation.length > 0 && <section className="rounded-[24px] border border-black/[0.07] bg-white p-5 sm:p-6"><div className="flex items-center gap-3"><Navigation size={18} className="text-[#24734d]" /><div><h2 className="text-[15px] font-semibold">Ortak menü başlıkları</h2><p className="mt-1 text-[11px] text-black/40">Header ve Footer aynı menü adlarını kullanır. Hedef adresler değiştirilemez.</p></div></div><div className="mt-5 space-y-5">{visibleNavigation.map(({ item, index }) => <article key={item.key} className="rounded-2xl border border-black/[0.07] bg-[#fafaf7] p-4 sm:p-5"><div className="mb-4 flex flex-wrap items-start justify-between gap-3"><div><strong className="text-[13px]">{navigationNames[item.key] ?? item.key}</strong><p className="mt-1 text-[10px] text-black/35">Sitenin ana menüsünde görünür.</p></div><span className="flex items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 font-mono text-[9px] text-black/35"><Link2 size={12} />{item.href}</span></div><div className="grid gap-4 sm:grid-cols-2">{field("Menü başlığı", item.label[locale], value => update(copy => { copy.navigation[index].label[locale] = value; }), { maxLength: 120 })}{item.description && field("Açılır menü açıklaması", item.description[locale], value => update(copy => { copy.navigation[index].description![locale] = value; }), { multiline: true, maxLength: 500 })}</div>{item.children.length > 0 && <div className="mt-4"><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/35">Alt menü başlıkları</p><div className="grid gap-3 sm:grid-cols-2">{item.children.map((child, childIndex) => <div key={child.key} className="rounded-xl border border-black/[0.06] bg-white p-3">{field(childNames[child.key] ?? child.key, child.label[locale], value => update(copy => { copy.navigation[index].children[childIndex].label[locale] = value; }), { maxLength: 120 })}<p className="mt-2 flex items-center gap-1.5 font-mono text-[9px] text-black/25"><Link2 size={10} />{child.href}</p></div>)}</div></div>}</article>)}</div></section>}

            {showContact && <section className="rounded-[24px] border border-black/[0.07] bg-white p-5 sm:p-6"><div className="flex items-center gap-3"><Contact size={18} className="text-[#24734d]" /><div><h2 className="text-[15px] font-semibold">Ortak iletişim alanı</h2><p className="mt-1 text-[11px] text-black/40">Footer iletişim başlıkları ve dile göre gösterilen adres.</p></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2">{field("E-posta başlığı", draft.contact.email.label[locale], value => update(copy => { copy.contact.email.label[locale] = value; }), { maxLength: 80 })}{field("Telefon başlığı", draft.contact.phone.label[locale], value => update(copy => { copy.contact.phone.label[locale] = value; }), { maxLength: 80 })}{field("Adres başlığı", draft.contact.address.label[locale], value => update(copy => { copy.contact.address.label[locale] = value; }), { maxLength: 80 })}{field("Adres metni", draft.contact.address.display[locale], value => update(copy => { copy.contact.address.display[locale] = value; }), { multiline: true, maxLength: 500 })}</div><div className="mt-4 grid gap-3 rounded-xl bg-[#f4f3ee] p-4 text-[11px] text-black/45 sm:grid-cols-2"><p><strong className="mb-1 block text-[9px] uppercase tracking-[0.12em] text-black/25">Sabit e-posta</strong>{draft.contact.email.display}</p><p><strong className="mb-1 block text-[9px] uppercase tracking-[0.12em] text-black/25">Sabit telefon</strong>{draft.contact.phone.display}</p></div></section>}

            {showSocials && <section className="rounded-[24px] border border-black/[0.07] bg-white p-5 sm:p-6"><div className="flex items-center gap-3"><Globe2 size={18} className="text-[#24734d]" /><div><h2 className="text-[15px] font-semibold">Sosyal medya adları</h2><p className="mt-1 text-[11px] text-black/40">Footer’da görünen platform adları. Bağlantı adresleri sabittir.</p></div></div><div className="mt-5 grid gap-3 sm:grid-cols-3">{draft.socials.map((social, index) => <div key={social.key} className="rounded-xl border border-black/[0.06] bg-[#fafaf7] p-3">{field(social.key === "linkedin" ? "LinkedIn" : social.key.charAt(0).toLocaleUpperCase("tr") + social.key.slice(1), social.label, value => update(copy => { copy.socials[index].label = value; }), { maxLength: 80 })}<p className="mt-2 truncate font-mono text-[9px] text-black/25" title={social.href}>{social.href}</p></div>)}</div></section>}

            {showFooter && <section className="rounded-[24px] border border-black/[0.07] bg-white p-5 sm:p-6"><div className="flex items-center gap-3"><Scale size={18} className="text-[#24734d]" /><div><h2 className="text-[15px] font-semibold">Footer yasal ve alt bilgiler</h2><p className="mt-1 text-[11px] text-black/40">Yasal alan başlıkları, telif metni ve geliştirici etiketi.</p></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2">{field("Yasal bölüm başlığı", draft.footer.legalLabel[locale], value => update(copy => { copy.footer.legalLabel[locale] = value; }), { maxLength: 80 })}{field("Geliştirici etiketi", draft.footer.developedBy[locale], value => update(copy => { copy.footer.developedBy[locale] = value; }), { maxLength: 80 })}{field("Telif metni", draft.footer.copyright[locale], value => update(copy => { copy.footer.copyright[locale] = value; }), { maxLength: 300 })}</div><div className="mt-5"><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-black/35">Yasal bağlantı adları</p><div className="grid gap-3 sm:grid-cols-3">{draft.footer.legalLinks.map((link, index) => <div key={link.key} className="rounded-xl border border-black/[0.06] bg-[#fafaf7] p-3">{field(legalNames[link.key] ?? link.key, link.label[locale], value => update(copy => { copy.footer.legalLinks[index].label[locale] = value; }), { maxLength: 180 })}<p className="mt-2 flex items-center gap-1.5 font-mono text-[9px] text-black/25"><Link2 size={10} />{link.href}</p></div>)}</div></div></section>}

            {!hasResults && <div className="rounded-[24px] border border-dashed border-black/10 bg-white px-6 py-16 text-center"><Search size={24} className="mx-auto text-black/20" /><p className="mt-3 text-sm font-medium text-black/50">Eşleşen ortak içerik bulunamadı.</p><button type="button" onClick={() => setQuery("")} className="mt-4 rounded-xl bg-[#173e2e] px-4 py-2 text-[11px] font-semibold text-white">Aramayı temizle</button></div>}

            <section className="rounded-[24px] border border-black/[0.07] bg-[#19211b] p-5 text-white"><div className="flex items-center gap-3"><ShieldCheck size={18} className="text-[#8cc29e]" /><h2 className="text-[13px] font-semibold">Güvenli düzenleme</h2></div><ul className="mt-4 grid gap-3 text-[11px] leading-5 text-white/50 sm:grid-cols-2"><li>• Header ve Footer aynı kaydı kullanır.</li><li>• URL ve teknik anahtarlar kilitlidir.</li><li>• Türkçe ve İngilizce ayrı düzenlenir.</li><li>• İptal son kayıtlı sürüme döner.</li></ul></section>
          </div>
        </div>
      </section>
    </main>
  );
}
