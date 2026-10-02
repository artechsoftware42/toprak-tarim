"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, CircleAlert, Eye, EyeOff, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";

import logo from "@/assets/logo.png";

export default function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState(configured ? "" : "Admin hesabı .env.local içinde yapılandırılmalı.");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!configured || pending) return;
    const data = new FormData(event.currentTarget);
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: data.get("username"), password: data.get("password") }),
      });
      const result = await response.json().catch(() => ({ message: "Giriş yanıtı okunamadı." }));
      if (!response.ok) throw new Error(result.message);
      router.replace("/admin");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Giriş yapılamadı.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#f2f0e9] px-5 py-12 text-[#172019]">
      <div className="pointer-events-none absolute -left-32 -top-40 h-[500px] w-[500px] rounded-full bg-[#24734d]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-48 -right-32 h-[520px] w-[520px] rounded-full bg-[#f07d00]/10 blur-3xl" />
      <div className="relative grid w-full max-w-[1050px] overflow-hidden rounded-[36px] border border-black/[0.07] bg-white shadow-[0_30px_100px_rgba(30,45,32,0.12)] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="relative hidden min-h-[660px] overflow-hidden bg-[#173e2e] p-12 text-white lg:flex lg:flex-col">
          <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,.2),transparent_38%),linear-gradient(145deg,transparent_45%,rgba(240,125,0,.25))]" />
          <div className="relative z-10"><Image src={logo} alt="Toprak Tarım" className="h-auto w-[170px] brightness-0 invert" priority /></div>
          <div className="relative z-10 mt-auto">
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d5e8c5]">İçerik yönetimi</span>
            <h1 className="mt-6 max-w-md text-[58px] font-medium leading-[0.94] tracking-[-0.055em]">İçeriğinizi güvenle yönetin.</h1>
            <p className="mt-7 max-w-sm text-[15px] leading-7 text-white/60">Ana sayfa içeriklerini Türkçe ve İngilizce olarak tek yerden düzenleyin.</p>
          </div>
        </section>
        <section className="flex min-h-[620px] items-center p-7 sm:p-12 lg:p-16">
          <div className="mx-auto w-full max-w-[420px]">
            <div className="mb-10 flex items-center justify-between gap-4 lg:mb-0"><Image src={logo} alt="Toprak Tarım" className="h-auto w-[150px] lg:hidden" priority /><Link href="/" className="ml-auto flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-semibold text-black/35 transition hover:bg-black/[0.04] hover:text-black"><ArrowLeft size={14} />Siteye dön</Link></div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#24734d]">Yönetim paneli</p>
            <h2 className="mt-4 text-[42px] font-medium tracking-[-0.045em]">Tekrar hoş geldiniz.</h2>
            <p className="mt-3 text-sm leading-6 text-black/45">İçerikleri yönetmek için yetkili hesabınızla güvenli giriş yapın.</p>
            <form onSubmit={submit} aria-busy={pending} className="mt-10 space-y-5">
              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-black/45">Kullanıcı adı</span>
                <span className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#f7f6f1] px-4 transition focus-within:border-[#24734d]/50 focus-within:bg-white">
                  <UserRound size={17} className="text-black/35" />
                  <input name="username" required autoComplete="username" className="h-14 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-black/25" placeholder="Kullanıcı adınız" />
                </span>
              </label>
              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em] text-black/45">Parola</span>
                <span className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[#f7f6f1] px-4 transition focus-within:border-[#24734d]/50 focus-within:bg-white">
                  <LockKeyhole size={17} className="text-black/35" />
                  <input name="password" required type={showPassword ? "text" : "password"} autoComplete="current-password" className="h-14 min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-black/25" placeholder="Parolanız" />
                  <button type="button" onClick={() => setShowPassword(value => !value)} className="rounded-lg p-1 text-black/35 transition hover:text-black" aria-label={showPassword ? "Parolayı gizle" : "Parolayı göster"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
                </span>
              </label>
              <div aria-live="polite" className={`flex min-h-11 items-start gap-2 rounded-xl px-3 py-2.5 text-[12px] leading-5 ${message ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-800"}`}>{message ? <CircleAlert size={15} className="mt-0.5 shrink-0" /> : <ShieldCheck size={15} className="mt-0.5 shrink-0" />}<span>{message || "Oturumunuz güvenli ve yalnızca yönetim panelinde geçerlidir."}</span></div>
              <button type="submit" disabled={!configured || pending} className="group flex h-14 w-full items-center justify-between rounded-2xl bg-[#173e2e] px-5 text-sm font-semibold text-white transition hover:bg-[#24734d] disabled:cursor-not-allowed disabled:opacity-50">
                <span>{pending ? "Giriş yapılıyor..." : "Giriş yap"}</span>
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </form>
            <p className="mt-8 text-center text-[11px] text-black/30">Toprak Tarım güvenli içerik yönetimi</p>
          </div>
        </section>
      </div>
    </main>
  );
}
