import Link from "next/link";

export default function ISS() {
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
                    Kurumsal Bilgilendirme
                  </span>
                </div>

                <h1
                  className="
                    max-w-[1100px]
                    text-[clamp(3rem,5.6vw,7rem)]
                    font-light
                    leading-[0.9]
                    tracking-[-0.055em]
                    text-white
                  "
                >
                  Bilgi Toplumu
                  <span
                    className="
                      mt-2
                      block
                      font-light
                      italic
                      text-white/45
                    "
                  >
                    Hizmetleri
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
                  Şirketimize ilişkin temel kurumsal bilgiler ve ilgili mevzuat
                  kapsamında kamuya sunulan bilgilendirmeler.
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
              Bilgi Toplumu Hizmetleri
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
              Kurumsal bilgiler ve yasal bildirimler.
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
              Bu sayfadaki bilgiler taslak olarak hazırlanmıştır. Şirketin resmî
              ticaret sicili ve diğer kurumsal kayıtları doğrultusunda
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
              <LegalSection number="01" title="Şirket Bilgileri">
                <p>
                  Toprak Tarım, tarım sektöründe faaliyet gösteren ve ürün,
                  üretim ve ticari faaliyetlerini ilgili mevzuat çerçevesinde
                  sürdüren bir kuruluştur.
                </p>

                <p>
                  Şirketin ticari unvanı, ticaret sicil numarası, MERSİS
                  numarası, vergi bilgileri ve diğer resmî kayıtları ilgili
                  kurumsal belgelerde yer almaktadır.
                </p>
              </LegalSection>

              <LegalSection number="02" title="Ticari Unvan">
                <p>
                  Şirketin ticari faaliyetlerinde kullandığı resmî unvan,
                  ticaret sicilinde kayıtlı şirket unvanıdır.
                </p>

                <InfoCard
                  label="Ticari Unvan"
                  value="Toprak Tarım — Resmî şirket unvanı eklenecektir."
                />
              </LegalSection>

              <LegalSection number="03" title="MERSİS Bilgileri">
                <p>
                  Merkezi Sicil Kayıt Sistemi kapsamında şirkete ait MERSİS
                  numarası, resmî kayıtlar doğrultusunda bu alanda
                  yayımlanacaktır.
                </p>

                <InfoCard
                  label="MERSİS No"
                  value="MERSİS numarası eklenecektir."
                />
              </LegalSection>

              <LegalSection number="04" title="Ticaret Sicil Bilgileri">
                <p>
                  Şirketin kayıtlı olduğu ticaret sicili müdürlüğü ve ticaret
                  sicil numarası aşağıdaki alanda yayımlanacaktır.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <InfoCard
                    label="Ticaret Sicil Müdürlüğü"
                    value="Konya Ticaret Sicili Müdürlüğü"
                  />

                  <InfoCard
                    label="Ticaret Sicil No"
                    value="Ticaret sicil numarası eklenecektir."
                  />
                </div>
              </LegalSection>

              <LegalSection number="05" title="Vergi Bilgileri">
                <p>
                  Şirketin vergi dairesi ve vergi numarası, ilgili resmî
                  kayıtlara uygun olarak aşağıdaki alanda yayımlanacaktır.
                </p>

                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <InfoCard
                    label="Vergi Dairesi"
                    value="Vergi dairesi bilgisi eklenecektir."
                  />

                  <InfoCard
                    label="Vergi Numarası"
                    value="Vergi numarası eklenecektir."
                  />
                </div>
              </LegalSection>

              <LegalSection number="06" title="Merkez Adresi">
                <p>
                  Şirketin merkez adresi aşağıda belirtilmiştir. Resmî
                  bildirimlerde ticaret sicilinde kayıtlı güncel adres esas
                  alınmaktadır.
                </p>

                <InfoCard
                  label="Merkez Ofis"
                  value="Fetih Mah. Şeyhülema Yahşi Cad. No:204 Karatay / KONYA"
                />
              </LegalSection>

              <LegalSection number="07" title="Fabrika Adresi">
                <p>
                  Şirketin üretim faaliyetlerinin gerçekleştirildiği fabrika
                  adresine ilişkin bilgiler aşağıda yer almaktadır.
                </p>

                <InfoCard
                  label="Fabrika"
                  value="Tatlıcak, Erdemir Sk. 56a, 42030 Karatay / Konya"
                />
              </LegalSection>

              <LegalSection number="08" title="İletişim Bilgileri">
                <p>
                  Şirket ile kurumsal iletişim kurmak, bilgi talebinde bulunmak
                  veya ilgili birimlere ulaşmak için aşağıdaki iletişim
                  kanallarını kullanabilirsiniz.
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
                    label="Merkez Ofis"
                    value="Fetih Mah. Şeyhülema Yahşi Cad. No:204 Karatay / KONYA"
                  />
                </div>
              </LegalSection>

              <LegalSection number="09" title="Elektronik İletişim">
                <p>
                  Şirketimize elektronik ortamda gönderilecek bildirim, başvuru
                  ve talepler için kurumsal iletişim kanallarının kullanılması
                  gerekmektedir.
                </p>

                <p>
                  İletişim kanalları üzerinden tarafımıza iletilen başvurular,
                  içeriğine göre ilgili şirket birimlerine yönlendirilebilir.
                </p>
              </LegalSection>

              <LegalSection number="10" title="Kurumsal Belgeler ve Duyurular">
                <p>
                  Mevzuat kapsamında yayımlanması gereken şirket bilgileri,
                  duyurular ve ilgili belgeler gerektiğinde bu sayfa üzerinden
                  kamuoyunun erişimine sunulabilir.
                </p>

                <p>
                  Yayımlanan belgelerin kapsamı, şirketin tabi olduğu mevzuat ve
                  kurumsal yükümlülüklere göre değişiklik gösterebilir.
                </p>
              </LegalSection>

              <LegalSection number="11" title="Bilgilerin Güncelliği">
                <p>
                  Bu sayfada yayımlanan kurumsal bilgilerin güncel tutulması
                  amaçlanmaktadır. Şirket bilgilerinde meydana gelen
                  değişiklikler gerekli görüldüğünde sayfaya yansıtılacaktır.
                </p>

                <p>
                  Resmî işlemlerde ilgili kamu kurumları ve ticaret sicili
                  kayıtlarında bulunan güncel bilgiler esas alınmalıdır.
                </p>
              </LegalSection>

              <LegalSection number="12" title="Yasal Bilgilendirmeler">
                <p>
                  İnternet sitesi kullanıcılarının kişisel verileri, çerez
                  kullanımı ve diğer yasal konulara ilişkin ayrıntılı
                  bilgilendirmelere aşağıdaki sayfalardan ulaşabilirsiniz.
                </p>

                <div
                  className="
                    mt-8
                    grid
                    grid-cols-1
                    gap-4
                    sm:grid-cols-2
                  "
                >
                  <InternalLink href="/kvkk" label="KVKK Aydınlatma Metni" />

                  <InternalLink href="/cookie" label="Çerez Politikası" />
                </div>
              </LegalSection>

              <LegalSection number="13" title="İletişim" last>
                <p>
                  Bilgi Toplumu Hizmetleri kapsamında yayımlanan bilgiler
                  hakkında soru veya talepleriniz olması halinde şirketimizle
                  iletişime geçebilirsiniz.
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

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="
        border
        border-black/[0.08]
        bg-white/60
        px-6
        py-6
      "
    >
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
          text-[14px]
          leading-[1.7]
          text-black/60
        "
      >
        {value}
      </span>
    </div>
  );
}

function InternalLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="
        group
        flex
        cursor-pointer
        items-center
        justify-between
        border
        border-black/[0.09]
        bg-white/60
        px-6
        py-5
        transition-colors
        duration-300
        hover:border-[#1D6847]/30
        hover:bg-white
      "
    >
      <span
        className="
          text-[12px]
          font-semibold
          uppercase
          tracking-[0.12em]
          text-[#101312]
          transition-colors
          duration-300
          group-hover:text-[#1D6847]
        "
      >
        {label}
      </span>

      <span
        className="
          ml-6
          text-[14px]
          text-black/30
          transition-all
          duration-300
          group-hover:translate-x-[3px]
          group-hover:text-[#1D6847]
        "
        aria-hidden="true"
      >
        ↗
      </span>
    </Link>
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
