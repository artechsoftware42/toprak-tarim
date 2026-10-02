# Ana sayfa içerik altyapısı

`hero`, `about`, `production`, `contactCTA`, `/about`, `/activity` ve `/contact` sayfaları bağlandı. `src/features/home/products/Products.tsx` içerik yönetimi kapsamı dışındadır. Production, Activities ve About görselleri ile Contact haritasının teknik ayarları kodda sabittir. İçerik yönetimi `/admin` altında, giriş ekranı `/admin/login` altındadır.

## Kurulum ve gerçek başlangıç verisi

- Veritabanı: `toprak-tarim` (`MONGODB_DB` ile seçilir).
- Koleksiyon: `home_sections` (kodda sabit).
- İçe aktarılacak dosyalar: `data/home-sections.seed.json`, `data/about-page.seed.json` ve `data/activity-page.seed.json`. Birlikte **yedi dolu belge** sağlarlar. Şema örneği değildirler.
- Ayrı şema: `data/home-sections.schema.json` (standart JSON Schema, tek belgeyi tarif eder). Bu dosya başlangıç verisi olarak Atlas'a eklenmez ve MongoDB `$jsonSchema` komutuna doğrudan verilmez. `node scripts/generate-home-schema.cjs` ile yeniden üretilebilir. Sunucu doğrulayıcısı kilitli başlıkların toplam metnini de kontrol eder.
- Uygulama belgeleri `pageKey: { $in: ["hero", "about", "production", "contactCTA", "contact", "aboutPage", "activityPage"] }` ile okur. Eksik, tekrarlı veya geçersiz belge için sadece ilgili bölümün yerel içeriği kullanılır. Bağlantı hatasında bütün bölümler yerel içeriğe döner. İçerik sonraki sunucu isteğinde tekrar okunur.

Atlas Data Explorer içinde:

1. Cluster → Data Explorer/Browse Collections alanını açın; `toprak-tarim` veritabanını ve `home_sections` koleksiyonunu oluşturun.
2. Koleksiyonda Add Data → Insert Document → JSON görünümünü seçin.
3. Seed dosyalarını ekleyin; Insert ile toplam yedi belgeyi oluşturun. Aynı seed'i tekrar eklemeyin.
4. Indexes bölümünde `{ "pageKey": 1 }` için **Unique** indeks oluşturun; her bölümden tek belge bulunmasını sağlayın.
5. Documents filtresinde `{ "pageKey": "hero" }` ile sonucu doğrulayın.

Atlas web arayüzünde JSON dizisi yapıştırma yöntemi kullanılır; dosyadan doğrudan içe aktarma için Compass → Add Data → Import JSON seçilebilir. Resmî açıklama: https://www.mongodb.com/docs/atlas/atlas-ui/documents/

## Güvenli ortam değişkenleri

Proje kökündeki `.env.example` dosyasını `.env.local` adıyla kopyalayın. `.env.local` Git tarafından dışlanır. Gerçek sırları JSON'a veya sohbet mesajına yazmayın.

- `MONGODB_URI`: Atlas → Connect → Drivers bağlantı URI'si; kullanıcı/parola için URI encoding kullanın. Atlas Database Access kullanıcısının bu koleksiyonu okuyabilmesi ve Network Access ayarının uygulama sunucusuna izin vermesi gerekir.
- `MONGODB_DB=toprak-tarim`: veritabanı adı. Farklı ad seçerseniz Atlas'ta da aynı adı kullanın.
- `RESEND_API_KEY`, `RESEND_FROM`, `CONTACT_TO`: iletişim formunun sunucu tarafındaki Resend gönderimi için kullanılır.
- `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`: admin giriş hesabını ve sekiz saatlik imzalı oturum çerezini yapılandırır. Parola ve oturum sırrı boş bırakılamaz; oturum sırrı en az 32 karakter olmalıdır.
- Medya temel URL'si gerekmez; `media.<slot>.externalUrl` tam HTTPS adresidir. Hostinger veya başka sağlayıcı kullanılabilir.

Atlas ve Resend değişkenleri `.env.local` içindedir. Ortam değişkenleri değişince geliştirme sunucusunu yeniden başlatın. Dağıtımda değerleri hosting ortam değişkenleri alanına girin; hiçbir sır `NEXT_PUBLIC_` ile başlamaz.

## Veri modeli ve yetkiler

`pageKey`: teknik kimlik, değiştirilemez. Route değildir. `/`, `/about`, `/activity`, `/contact` ve CTA adresleri kodda kalır; veritabanında düzenlenebilir route/path alanı yoktur. `/hero` adlı bir sayfa mevcut değildir. Kurumsal bağlantısı `/about`; alt bağlantıları `/about#about-us`, `/about#vision` ve `/about#mision` olarak sabittir. Faaliyetler bağlantısı `/activity`; alt bağlantıları `/activity#production` ve `/activity#products` olarak sabittir.

`displayName.tr/en`: admin listesinde gösterilen düzenlenebilir bölüm adı; ekrandaki başlıkla aynı alan değildir.

## Admin paneli

- `/admin` sunucu tarafında oturum kontrolü yapar; geçerli oturum yoksa `/admin/login` sayfasına yönlendirir. Admin sayfalarında genel site Header, Footer, dil sağlayıcısı ve yükleme animasyonu render edilmez.
- Sol menüde ana sayfa bölümleri ve diğer sayfalar ayrı açılır gruplardadır. Sayfa araması, bölüm içi alan/metin araması ve iki alanda da özel scrollbar bulunur.
- Bölümün panelde görünen TR/EN adı değiştirilebilir. Teknik `pageKey` ve route değerleri panelde salt okunur gösterilir ve API doğrulamasında değiştirilemez.
- Üst işlem çubuğu sticky çalışır. Kaydet yalnızca aktif bölümde değişiklik olduğunda etkinleşir; İptal aktif bölümü son kaydedilen sürüme döndürür. Kaydedilmemiş değişiklikler sol menüde işaretlenir.
- Her içerik alanının TR/EN karşılığı, izin verilen yerlerde metin ve tüm alanlarda güvenli kalın/italik/hex renk biçimiyle düzenlenir. Ham HTML kabul edilmez.
- Renk aracı sayfa düzenini büyütmeyen sabit bir panelde açılır. Hazır renkler, sistem renk seçicisi, HEX/RGBA kod alanı ve alanın başlangıç rengine dönen sıfırlama butonu birlikte bulunur.
- Production belgesinde `media` alanı yoktur; admin paneli görsellerin sabit olduğunu belirtir ve görsel düzenleyici göstermez.
- Yazma işlemi `PUT /api/admin/content/[pageKey]` üzerinden aynı `validateSection` doğrulayıcısıyla yapılır. Route 250 KB sınırı uygular ve yalnızca geçerli admin çereziyle Atlas'taki `toprak-tarim.home_sections` belgesini değiştirir.
- Giriş API'si IP başına 15 dakikada beş başarısız denemeden sonra geçici olarak engeller. Oturum çerezi HttpOnly, SameSite Strict ve production ortamında Secure olarak ayarlanır.

`content.tr/en.<field>`: `{ "text": "...", "bold": true, "italic": true, "color": "#24734D" }` biçiminde parçalardan oluşur. Biçim alanları isteğe bağlıdır. Tanımlanmadığında mevcut CSS aynen uygulanır. React metin düğümleri ve güvenli span/tspan kullanılır; ham HTML çalıştırılmaz. Renk `#RGB`, `#RRGGBB`, `#RRGGBBAA` veya sınırları doğrulanan `rgba(r, g, b, a)` biçiminde olabilir. Admin renk menüsündeki sıfırlama renk alanını kaldırarak metni bölümün CSS varsayılanına döndürür. `alt` ve erişilebilirlik etiketleri düz metin olarak okunur.

Ana başlıkların mevcut satır/span yerleşimi korunur. About başlığı `topragin`, `icinden`, `gelecege`; ContactCTA başlığı `birlikte`, `calismaya`, `baslayalim`; Hero'nun aynı ana başlık konumundaki slayt başlıkları `slide1_title`–`slide3_title` alanlarıdır. Bunlar tek başlığın görsel parçaları/slide varyantlarıdır. About alt başlıkları ve Hero kaş metinleri `field-policy.json` içindeki `textEditable:false` kurallarıyla korunur; metin değiştirme reddedilir, biçimlendirme kabul edilir. Teknik alanlar eklenemez/çıkarılamaz. Admin yazma endpoint'i aynı `validateSection` doğrulamasını ve kimlik/yetki kontrolünü kullanır. Atlas yöneticisinin doğrudan DB düzenleme yetkisi uygulama tarafından sınırlandırılamaz; geçersiz belge okunurken reddedilir.

`media`: sabit `localDefault` ve düzenlenebilir `externalUrl`. `null` yerel dosyayı kullanır. `asset:hero3`, `asset:hero4`, `asset:icon` mevcut derleme importlarının sabit kimlikleridir. Harici resim/video yüklenemezse yerel dosyaya döner. CTA arka planı harici resim başarıyla yüklenene kadar yerel kalır. Dosyalar taşınmadı, yükleme servisi kurulmadı.

## Ortak Header ve Footer verisi

- Veritabanı `toprak-tarim`, koleksiyon `site_content`, belge anahtarı `siteKey: "headerFooter"` değeridir. Başlangıç verisi `data/site-chrome.seed.json` dosyasındadır.
- `(site)` layout'u bu belgeyi bir kez okur ve aynı nesneyi Header ile Footer'a verir. Menü başlıkları, açılır menü açıklamaları, marka metinleri, iletişim alanları, kayan yazılar ve Footer yasal metinleri TR/EN olarak ortak kaynaktan gelir.
- `/admin/header-footer` ekranı ortak içeriği düzenler. `PUT /api/admin/site-chrome` yalnızca geçerli admin oturumuyla çalışır ve aynı belgeyi değiştirir.
- Menü ve yasal bağlantı adresleri sabittir. Admin ekranında salt okunur gösterilir; doğrulayıcı bir URL değişikliğini reddeder.
- `site_content.siteKey` için kısmi benzersiz indeks kullanılır. Eksik, bağlantısı başarısız veya geçersiz belgede yerel seed güvenli varsayılan olarak render edilir.

## Dil ve çeviriler

Mevcut Header TR/EN düğmeleri ortak dil durumuna bağlandı; stilleri değişmedi. Seçim istemci içi sayfa geçişlerinde korunur; tam yeniden yüklemede TR'ye döner. Ana sayfadaki dört bağlı bölüm, About ve Contact sayfaları, Header ve Footer metinleri aynı seçimle çevrilir; kapsam dışı sayfaların kendi içerikleri çevrilmez.

## Contact sayfası ve harita

`contact` belgesinde sayfa başlıkları, merkez/fabrika görünen iletişim bilgileri, form etiketleri ve yer tutucuları, KVKK metni, gönderim durumları ve harita sıfırlama etiketi TR/EN olarak saklanır. Telefon ve e-posta değerleri sunucuda ayrıca biçim doğrulamasından geçer.

Leaflet/MapLibre harita bileşeni, OpenStreetMap tile URL'si, koordinatlar, yakınlaştırma değerleri ve harita hareketi kodda sabit kalır; admin belgesinde veya `.env.local` içinde düzenlenebilir harita anahtarı bulunmaz. Mevcut harita sağlayıcısı istemci anahtarı istemediği için `.env.local` dosyasına yeni bir API sırrı eklenmemiştir.

İngilizcesi bulunmayan ve çevrilen metinler: Hero'nun üç kaş metni, üç başlığı, üç açıklaması ve erişilebilirlik etiketleri; About'un ana/alt başlıkları, mobil/masaüstü açıklamaları, butonları, etiketleri ve resim açıklamaları; Production başlığı, açıklaması, ürün ve etkileşim metinleri; ContactCTA'nın başlığı, açıklaması, butonları ve iletişim etiketleri. Marka, yer isimleri, telefon, e-posta, adres ve sayılar korunur. Her çeviri seed dosyasında Türkçe karşılığıyla birlikte bulunur.

## Ortak yükleme ekranı

`BrandReveal` Hero'dan `src/components/loading/` altına taşındı. Root layout içindeki `InitialLoading` tek kez mount olur; doğrudan alt sayfada da çalışır, istemci geçişlerinde yeniden gösterilmez. Mevcut görsel sınıflar, logo hareketi, Yükleniyor etiketi ve çıkış animasyonu korunur.

Yüzde izlenen ilk ekran görselleri, işaretli Hero videosunun ilk hazır karesi ve belge fontlarının hazır olma oranıdır; indirme bayt yüzdesi değildir. Hatalı/zaman aşımına uğrayan kaynaklar hazır sayılmaz. Ekran 100'e zorlanmadan kapanır; minimum gösterim süresi yalnızca animasyon içindir. Kaynak başına 4,5 saniye ve ekran için 5 saniye güvenlik sınırı vardır; çıkış animasyonu ayrıca 1,6 saniyedir.

## Değişen dosyalar ve kontroller

- `src/lib/mongodb.ts`: yalnızca sunucuda paylaşılan bağlantı havuzu; başarısız bağlantı yeniden denenebilir.
- `src/features/home/content/*`: tipler, doğrulama, okuma, güvenli metin/medya render'ı, dil durumu ve sabit alan politikası.
- `src/features/home/{hero/Hero,about/AboutSection,contact/ContactCTA}.tsx`: mevcut yerleşimde içerik bağlantıları.
- `src/app/(site)/page.tsx`, `src/app/(site)/layout.tsx`, `src/app/layout.tsx`, `src/components/layout/Header.tsx`: sunucu okuması, genel site kabuğu ve mevcut dil seçicinin bağlantısı.
- `src/app/admin/*`, `src/app/api/admin/*`, `src/features/admin/*`, `src/lib/admin-auth.ts`: admin giriş, oturum, korumalı panel, içerik editörü ve Atlas yazma API'si.
- `src/components/loading/*`: taşınmış animasyon ve gerçek kaynak takibi.
- `data/home-sections.seed.json`, `.env.example`, `.gitignore`, `package.json`, `package-lock.json`, `scripts/test-home-content.cjs`, bu belge.

`node scripts/test-home-content.cjs` başlangıç verisini, iki dilde alan kapsamını, kilitli başlıkları, biçimlendirmeyi, medya güvenliğini, sabit anahtarları/path alanlarının reddini ve BSON alanlarının istemciye taşınmamasını doğrular. Kapsamdaki yeni/değişen içerik ve loader dosyaları ESLint kontrolünden geçmiştir.

`tsc --noEmit` ve içerik doğrulama testleri geçer. `next build`, ağ erişimi olmayan ortamlarda Google Fonts indirmesinde durabilir. Proje genelindeki ESLint, bu çalışmadan önce var olan script `require()` kuralları ve `HeroIntro` efekt uyarısı nedeniyle temiz değildir.

Tarayıcıda mobil ana sayfa ve TR/EN geçişi doğrulandı. `/about` ve `/contact` adreslerine doğrudan girişte loader'ın mount olduğu, ardından kapandığı kontrol edildi. Activities ve Products dosyaları değiştirilmedi. Production'ın sınıfları, animasyonu ve sabit görselleri korunarak yalnızca metin düğümleri bağlandı. Piksel düzeyinde tüm ekran genişliklerini kapsayan görsel regresyon testi yapılmadı.

Canlı Atlas bağlantısı doğrulandı: Cluster0 içindeki `toprak-tarim.home_sections` koleksiyonunda `hero`, `about`, `production`, `contactCTA`, `contact`, `aboutPage` ve `activityPage` belgeleri bulunuyor ve uygulamanın `validateSection` doğrulamasından geçiyor. Bu yedi anahtarı kapsayan benzersiz indeks oluşturuldu. `site_content` içindeki ortak Header/Footer belgesinde yalnızca Kurumsal ve Faaliyetler navigasyon adresleri hash hedefleriyle güncellendi; diğer ortak içerikler korundu. Diğer veritabanlarına veya koleksiyonlara yazılmadı. `node scripts/seed-atlas.cjs` salt okunur bağlantı kontrolüdür; `--apply` eksik belgeleri ekler, mevcut belgeleri değiştirmez. URI `.env.local` dosyasındadır; `.env.example` sır içermez.

Admin panelinden Atlas'a gerçek bir bölüm adı kaydetme testi yapıldı ve aynı değer hemen özgün haline döndürülerek tekrar kaydedildi. Yetkisiz içerik isteği 401, yetkili fakat geçersiz belge 400 döndürdü; oturumlu `/admin` isteği 200 yanıt verdi.

`/contact` sayfasındaki gerçek form `POST /api/contact` route'una bağlıdır. Route alanları sunucuda doğrular, gizli bot alanını kontrol eder, IP başına saatte beş isteğe izin verir ve Resend anahtarını istemciye göndermez. `RESEND_FROM`, `CONTACT_TO` ve `RESEND_API_KEY` değerleri `.env.local` içinden okunur. Canlı deneme ile Resend başarı yanıtı alındı. ContactCTA form içermez ve mevcut `mailto:` bağlantısı korunmuştur.
