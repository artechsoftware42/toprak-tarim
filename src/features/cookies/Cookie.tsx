import Link from "next/link";

export default function Cookie() {
  return (
    <main className="min-h-screen bg-[#f6f6f2] text-[#101312]">
      <section
        className="
          relative
          overflow-hidden
          bg-[#0c0d0e]
          text-white
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            right-[-180px]
            top-[-220px]
            h-[650px]
            w-[650px]
            rounded-full
            bg-[#1D6847]/20
            blur-[150px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            bottom-[-280px]
            left-[20%]
            h-[600px]
            w-[600px]
            rounded-full
            bg-[#F07D00]/10
            blur-[160px]
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-[linear-gradient(180deg,rgba(255,255,255,0.02)_0%,transparent_45%,rgba(0,0,0,0.3)_100%)]
          "
        />

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            w-full
            max-w-[1600px]
            items-center
            justify-between
            px-6
            pt-8
            sm:px-8
            md:px-12
            lg:px-[7.5vw]
            lg:pt-10
          "
        >
          <span
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.24em]
              text-white/40
            "
          >
            Toprak Tarım
          </span>
        </div>

        <div
          className="
            relative
            z-10
            mx-auto
            flex
            min-h-[600px]
            w-full
            max-w-[1600px]
            flex-col
            justify-end
            px-6
            pb-16
            pt-32
            sm:min-h-[650px]
            sm:px-8
            sm:pb-20
            md:px-12
            lg:min-h-[720px]
            lg:px-[7.5vw]
            lg:pb-24
          "
        >
          <div
            className="
              border-t
              border-white/20
              pt-7
            "
          >
            <div
              className="
                grid
                grid-cols-1
                gap-12
                lg:grid-cols-12
                lg:items-end
                lg:gap-8
              "
            >
              <div className="lg:col-span-8">
                <div className="mb-7 flex items-center gap-4">
                  <span className="h-[14px] w-[3px] bg-[#F07D00]" />

                  <span
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.24em]
                      text-white/50
                    "
                  >
                    Yasal Bilgilendirme
                  </span>
                </div>

                <h1
                  className="
                    max-w-[1050px]
                    text-[clamp(3.1rem,6vw,7.4rem)]
                    font-light
                    leading-[0.9]
                    tracking-[-0.055em]
                    text-white
                  "
                >
                  Çerez
                  <span
                    className="
                      mt-2
                      block
                      font-light
                      italic
                      text-white/45
                    "
                  >
                    Politikası
                  </span>
                </h1>
              </div>

              <div
                className="
                  flex
                  lg:col-span-4
                  lg:justify-end
                "
              >
                <p
                  className="
                    max-w-[410px]
                    text-[14px]
                    leading-[1.85]
                    text-white/50
                    sm:text-[15px]
                  "
                >
                  İnternet sitemizde kullanılan çerezler, kullanım amaçları ve
                  çerez tercihlerinize ilişkin bilgilendirme metni.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="
          relative
          overflow-hidden
          bg-[#f6f6f2]
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            right-[-300px]
            top-[300px]
            h-[700px]
            w-[700px]
            rounded-full
            bg-[#1D6847]/[0.035]
            blur-[100px]
          "
        />

        <div
          className="
            relative
            mx-auto
            grid
            w-full
            max-w-[1600px]
            grid-cols-1
            gap-16
            px-6
            py-20
            sm:px-8
            sm:py-24
            md:px-12
            lg:grid-cols-[320px_1fr]
            lg:gap-24
            lg:px-[7.5vw]
            lg:py-32
          "
        >
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <span
              className="
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-[#1D6847]
              "
            >
              Çerez Politikası
            </span>

            <h2
              className="
                mt-6
                max-w-[280px]
                text-[30px]
                font-light
                leading-[1.15]
                tracking-[-0.03em]
                text-[#101312]
              "
            >
              İnternet sitesi kullanımınıza ilişkin bilgilendirme.
            </h2>

            <div className="mt-9 h-px w-14 bg-[#F07D00]" />

            <p
              className="
                mt-8
                max-w-[280px]
                text-[13px]
                leading-[1.8]
                text-black/45
              "
            >
              Bu sayfadaki metin taslak olarak hazırlanmıştır. Nihai hukuki
              metin şirketin yetkili hukuk danışmanı tarafından
              güncellenmelidir.
            </p>

            <div
              className="
                mt-10
                border-t
                border-black/10
                pt-6
              "
            >
              <p
                className="
                  text-[10px]
                  font-medium
                  uppercase
                  tracking-[0.18em]
                  text-black/30
                "
              >
                Son Güncelleme
              </p>

              <p
                className="
                  mt-2
                  text-[13px]
                  text-black/55
                "
              >
                30 Eylül 2026
              </p>
            </div>
          </aside>

          <div
            className="
              w-full
              max-w-[900px]
              lg:justify-self-end
            "
          >
            <article>
              <LegalSection number="01" title="Çerez Nedir?">
                <p>
                  Çerezler, internet sitelerini ziyaret ettiğinizde tarayıcınız
                  aracılığıyla cihazınıza kaydedilebilen küçük boyutlu veri
                  dosyalarıdır.
                </p>

                <p>
                  Çerezler; internet sitesinin düzgün çalışmasını sağlamak,
                  kullanıcı tercihlerini hatırlamak, site performansını
                  geliştirmek ve ziyaretçilerin siteyi nasıl kullandığını
                  anlamak gibi çeşitli amaçlarla kullanılabilir.
                </p>
              </LegalSection>

              <LegalSection number="02" title="Çerezleri Neden Kullanıyoruz?">
                <p>
                  Toprak Tarım internet sitesinde kullanılan çerezler,
                  ziyaretçilere daha güvenli, hızlı ve kullanışlı bir internet
                  deneyimi sunulmasına yardımcı olmak amacıyla kullanılabilir.
                </p>

                <ul>
                  <li>İnternet sitesinin temel fonksiyonlarını çalıştırmak,</li>
                  <li>Kullanıcı tercihlerini hatırlamak,</li>
                  <li>Site performansını ölçmek ve geliştirmek,</li>
                  <li>Ziyaretçi deneyimini iyileştirmek,</li>
                  <li>Teknik sorunları ve güvenlik risklerini tespit etmek.</li>
                </ul>
              </LegalSection>

              <LegalSection number="03" title="Zorunlu Çerezler">
                <p>
                  Zorunlu çerezler, internet sitesinin temel işlevlerinin
                  çalışabilmesi için gerekli olan çerezlerdir.
                </p>

                <p>
                  Bu çerezler; sayfalar arasında gezinme, güvenli alanların
                  kullanılması, form işlemlerinin gerçekleştirilmesi ve
                  kullanıcı tercihlerinin teknik olarak uygulanması gibi
                  işlevlerin yerine getirilmesi amacıyla kullanılabilir.
                </p>
              </LegalSection>

              <LegalSection number="04" title="Performans ve Analiz Çerezleri">
                <p>
                  Performans ve analiz çerezleri, ziyaretçilerin internet
                  sitesini nasıl kullandığına ilişkin toplu bilgiler elde
                  edilmesine yardımcı olabilir.
                </p>

                <p>
                  Bu kapsamda ziyaret edilen sayfalar, sayfalarda geçirilen
                  süre, teknik hata kayıtları ve genel kullanım davranışları
                  gibi bilgiler analiz edilebilir.
                </p>

                <p>
                  Elde edilen bilgiler internet sitesinin performansını ve
                  kullanıcı deneyimini geliştirmek amacıyla kullanılabilir.
                </p>
              </LegalSection>

              <LegalSection number="05" title="İşlevsel Çerezler">
                <p>
                  İşlevsel çerezler, internet sitesinin ziyaret sırasında
                  yaptığınız bazı seçimleri hatırlamasına yardımcı olur.
                </p>

                <p>
                  Dil tercihi, görüntüleme tercihleri ve benzeri kullanıcı
                  ayarlarının sonraki ziyaretlerde hatırlanması bu kapsamda
                  değerlendirilebilir.
                </p>
              </LegalSection>

              <LegalSection number="06" title="Üçüncü Taraf Çerezleri">
                <p>
                  İnternet sitesinde kullanılan bazı hizmetler kapsamında üçüncü
                  taraf hizmet sağlayıcılar tarafından çerezler
                  yerleştirilebilir.
                </p>

                <p>
                  Harita hizmetleri, video içerikleri, analiz araçları ve sosyal
                  medya entegrasyonları gibi üçüncü taraf servislerin
                  kullanılması halinde ilgili sağlayıcıların kendi çerez ve
                  gizlilik politikaları geçerli olabilir.
                </p>
              </LegalSection>

              <LegalSection number="07" title="Çerezlerin Saklanma Süresi">
                <p>
                  Kullanılan çerezlerin saklanma süreleri, çerezin türüne ve
                  kullanım amacına göre farklılık gösterebilir.
                </p>

                <p>
                  Bazı çerezler yalnızca internet sitesi ziyaretiniz boyunca
                  kullanılabilir ve tarayıcı kapatıldığında silinebilir. Bazı
                  çerezler ise belirlenen süre boyunca cihazınızda saklanabilir.
                </p>
              </LegalSection>

              <LegalSection number="08" title="Çerez Tercihlerinin Yönetilmesi">
                <p>
                  Çerez tercihlerinizi internet tarayıcınızın ayarları üzerinden
                  kontrol edebilir, mevcut çerezleri silebilir veya yeni
                  çerezlerin kaydedilmesini sınırlandırabilirsiniz.
                </p>

                <p>
                  Çerezlerin tamamen devre dışı bırakılması durumunda internet
                  sitesinin bazı bölümleri veya fonksiyonları beklenen şekilde
                  çalışmayabilir.
                </p>

                <p>
                  Tarayıcınızın çerez ayarlarına ilişkin seçenekler
                  kullandığınız tarayıcıya ve cihazınıza göre farklılık
                  gösterebilir.
                </p>
              </LegalSection>

              <LegalSection number="09" title="Kişisel Verilerin Korunması">
                <p>
                  Çerezler aracılığıyla kişisel veri elde edilmesi halinde bu
                  veriler, ilgili veri koruma mevzuatı ve şirketimizin kişisel
                  verilerin korunmasına ilişkin politikaları kapsamında
                  işlenebilir.
                </p>

                <p>
                  Kişisel verilerinizin işlenmesine ilişkin daha ayrıntılı bilgi
                  için KVKK aydınlatma metnimizi inceleyebilirsiniz.
                </p>

                <div className="mt-7">
                  <Link
                    href="/kvkk"
                    className="
                      group
                      inline-flex
                      cursor-pointer
                      items-center
                      gap-3
                      text-[13px]
                      font-semibold
                      uppercase
                      tracking-[0.13em]
                      text-[#1D6847]
                      transition-colors
                      duration-300
                      hover:text-[#F07D00]
                    "
                  >
                    <span>KVKK Metnini İncele</span>

                    <span
                      className="
                        transition-transform
                        duration-300
                        group-hover:translate-x-[3px]
                      "
                      aria-hidden="true"
                    >
                      ↗
                    </span>
                  </Link>
                </div>
              </LegalSection>

              <LegalSection number="10" title="Politikadaki Değişiklikler">
                <p>
                  Çerez Politikası, internet sitesinde kullanılan teknolojiler,
                  şirket uygulamaları veya ilgili mevzuatta meydana gelen
                  değişikliklere bağlı olarak güncellenebilir.
                </p>

                <p>
                  Güncellenen politika, internet sitesinde yayımlandığı tarihten
                  itibaren geçerli olacaktır.
                </p>
              </LegalSection>

              <LegalSection number="11" title="İletişim" last>
                <p>
                  Çerez kullanımı ve kişisel verilerinizin işlenmesi hakkında
                  soru veya talepleriniz bulunması halinde şirketimizle
                  aşağıdaki iletişim kanalları üzerinden iletişime
                  geçebilirsiniz.
                </p>

                <div
                  className="
                    mt-8
                    grid
                    grid-cols-1
                    gap-6
                    border-t
                    border-black/10
                    pt-8
                    sm:grid-cols-2
                  "
                >
                  <ContactDetail
                    label="E-posta"
                    value="toprak@topraktarim.com.tr"
                    href="mailto:toprak@topraktarim.com.tr"
                  />

                  <ContactDetail
                    label="Telefon"
                    value="0 (332) 355 80 80"
                    href="tel:03323558080"
                  />

                  <ContactDetail
                    label="Adres"
                    value="Fetih Mah. Şeyhülema Yahşi Cad. No:204 Karatay / KONYA"
                  />
                </div>
              </LegalSection>
            </article>

            <div
              className="
                mt-16
                flex
                justify-end
                border-t
                border-black/10
                pt-10
                sm:mt-20
                sm:pt-12
                lg:mt-24
              "
            >
              <HomeButton />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function LegalSection({
  number,
  title,
  children,
  last = false,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <section
      className={`
        grid
        grid-cols-1
        gap-7
        border-t
        border-black/10
        py-12
        sm:py-14
        md:grid-cols-[90px_1fr]
        md:gap-8
        lg:py-16
        ${last ? "border-b" : ""}
      `}
    >
      <div>
        <span
          className="
            text-[11px]
            font-semibold
            tracking-[0.16em]
            text-[#F07D00]
          "
        >
          {number}
        </span>
      </div>

      <div>
        <h3
          className="
            text-[25px]
            font-medium
            leading-[1.2]
            tracking-[-0.025em]
            text-[#101312]
            sm:text-[28px]
          "
        >
          {title}
        </h3>

        <div
          className="
            mt-7
            space-y-5
            text-[15px]
            leading-[1.9]
            text-black/55

            [&_ul]:mt-7
            [&_ul]:space-y-3

            [&_li]:relative
            [&_li]:pl-6

            [&_li]:before:absolute
            [&_li]:before:left-0
            [&_li]:before:top-[12px]
            [&_li]:before:h-[1px]
            [&_li]:before:w-3
            [&_li]:before:bg-[#1D6847]
          "
        >
          {children}
        </div>
      </div>
    </section>
  );
}

function ContactDetail({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <span
        className="
          block
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.17em]
          text-[#1D6847]
        "
      >
        {label}
      </span>

      <span
        className="
          mt-3
          block
          max-w-[320px]
          text-[14px]
          leading-[1.7]
          text-black/60
          transition-colors
          duration-300
          group-hover:text-black
        "
      >
        {value}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="
          group
          block
          w-fit
          cursor-pointer
        "
      >
        {content}
      </a>
    );
  }

  return <div>{content}</div>;
}

function HomeButton() {
  return (
    <Link
      href="/"
      className="
        group
        relative
        inline-flex
        w-[300px]
        max-w-full
        cursor-pointer
        items-center
        justify-between
        overflow-visible
        pb-4
        text-[#101312]
      "
    >
      <span className="relative block h-[20px] flex-1 overflow-hidden">
        <span
          className="
            absolute
            left-0
            top-1/2
            -translate-y-1/2
            whitespace-nowrap
            text-[12px]
            font-semibold
            uppercase
            tracking-[0.17em]
            transition-all
            duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover:-translate-x-6
            group-hover:-translate-y-1/2
            group-hover:opacity-0
          "
        >
          Anasayfaya Dön
        </span>

        <span
          className="
            absolute
            left-0
            top-1/2
            translate-x-7
            -translate-y-1/2
            whitespace-nowrap
            text-[12px]
            font-semibold
            uppercase
            tracking-[0.15em]
            text-[#1D6847]
            opacity-0
            transition-all
            duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover:translate-x-0
            group-hover:-translate-y-1/2
            group-hover:opacity-100
          "
        >
          Anasayfaya Dön
        </span>
      </span>

      <span
        className="
          ml-8
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          transition-colors
          duration-500
          group-hover:text-[#1D6847]
        "
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="
            h-[18px]
            w-[18px]
            rotate-[135deg]
            transition-transform
            duration-500
            ease-[cubic-bezier(0.22,1,0.36,1)]
            group-hover:rotate-180
            group-hover:-translate-x-[3px]
          "
          aria-hidden="true"
        >
          <path
            d="M5 12H19"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />

          <path
            d="M14 7L19 12L14 17"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span
        className="
          absolute
          bottom-0
          left-0
          h-px
          w-full
          origin-left
          scale-x-0
          bg-[#1D6847]
          transition-transform
          duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]
          group-hover:scale-x-100
        "
      />
    </Link>
  );
}
