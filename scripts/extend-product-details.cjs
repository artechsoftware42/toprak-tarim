const fs = require("node:fs");

const file = "data/activity-page.seed.json";
const seed = JSON.parse(fs.readFileSync(file, "utf8"));
const add = (key, tr, en) => {
  seed.content.tr[key] = [{ text: tr }];
  seed.content.en[key] = [{ text: en }];
};

const common = {
  detail_products_button: ["Tüm Ürünleri Gör", "View All Products"],
  detail_products_button_hover: ["Ürünlerimizi keşfedin", "Explore our products"],
  detail_story_label: ["Sahadan ürüne", "From field to crop"],
  detail_story_intro: ["Üretim sürecini tek bir aşama olarak değil, birbirini tamamlayan kararların bütünü olarak ele alıyoruz.", "We approach production as a whole made up of complementary decisions rather than a single stage."],
  detail_back_label: ["Faaliyetlerimiz", "Our Activities"],
  detail_brand: ["Toprak Tarım", "Toprak Tarım"],
  detail_scroll_label: ["Aşağı kaydır", "Scroll down"],
  detail_general_overview: ["Genel bakış", "Overview"],
  detail_production_approach: ["Üretim yaklaşımı", "Production approach"],
  detail_fact_usage_label: ["Kullanım alanları", "Uses"],
  detail_fact_sowing_label: ["Ekim dönemi", "Sowing period"],
  detail_fact_harvest_label: ["Hasat dönemi", "Harvest period"],
  detail_fact_character_label: ["Ürün karakteri", "Crop profile"],
};
for (const [key, [tr, en]] of Object.entries(common)) add(key, tr, en);

const stories = [
  {
    eyebrow: ["Sahayı okumak", "Reading the field"], title: ["Her sezon aynı başlamaz.", "No two seasons begin the same."], accent: ["Önce koşulları anlamak gerekir.", "Conditions come first."],
    body: ["Üretime başlamadan önce sahanın mevcut durumunu, sezonun karakterini ve önceki dönemlerden kalan gözlemleri birlikte ele alıyoruz. Böylece ilk karar masa başında değil, doğrudan tarlanın gerçek koşullarından çıkıyor.", "Before production begins, we consider the field’s current state, the character of the season and observations from earlier periods. The first decision therefore comes from real field conditions."],
    note: ["İyi bir üretim planı, sahayı olduğu haliyle okuyarak başlar.", "A sound production plan begins by reading the field as it is."],
  },
  {
    eyebrow: ["Kararları geliştirmek", "Developing decisions"], title: ["Plan sabit kalmaz.", "The plan keeps evolving."], accent: ["Saha değiştikçe karar da gelişir.", "Decisions develop as the field changes."],
    body: ["Üretim boyunca yapılan gözlemler planın yeniden değerlendirilmesini sağlar. Hava, gelişim ritmi ve saha koşulları değiştikçe uygulamalar da aynı disiplin içinde güncellenir.", "Observations throughout production allow the plan to be reassessed. As weather, growth and field conditions change, practices are updated with the same discipline."],
    note: ["Planlama bizim için tek seferlik bir başlangıç değil, yaşayan bir süreçtir.", "For us, planning is a living process rather than a one-time start."],
  },
  {
    eyebrow: ["Dengeyi korumak", "Maintaining balance"], title: ["Sonuç kadar süreç de önemlidir.", "The process matters as much as the result."], accent: ["Tutarlılığı üretimin tamamına yayıyoruz.", "We carry consistency through production."],
    body: ["Ürünün gelişimini yalnızca sonuca bakarak değerlendirmiyoruz. Saha genelindeki dengeyi, üretim standardını ve süreç boyunca oluşan farklılıkları birlikte takip ediyoruz.", "We evaluate crop development beyond the final result, monitoring field-wide balance, production standards and differences that emerge throughout the process."],
    note: ["Amaç yalnızca üretmek değil, aynı özeni sezonun tamamında korumaktır.", "The aim is to maintain the same care throughout the season."],
  },
  {
    eyebrow: ["Deneyimi taşımak", "Carrying experience forward"], title: ["Her sezon bir sonrakini hazırlar.", "Every season prepares the next."], accent: ["Sahadan gelen bilgiyi geleceğe taşıyoruz.", "We carry field knowledge into the future."],
    body: ["Bir üretim dönemi tamamlandığında süreç bizim için bitmez. Sahada edinilen deneyim, gözlemler ve sonuçlar bir sonraki sezonun daha güçlü kararlarla başlamasına katkı sağlar.", "When a production period ends, the process continues. Field experience, observations and results help the next season begin with stronger decisions."],
    note: ["Üretim deneyimi birikir; her sezon bir sonraki döneme yeni bir başlangıç bırakır.", "Production experience accumulates, and every season leaves a stronger starting point for the next."],
  },
];
stories.forEach((story, index) => Object.entries(story).forEach(([field, [tr, en]]) => add(`detail_story_${index + 1}_${field}`, tr, en)));

const products = [
  {
    kicker: ["Topraktan gelen", "Born from the soil"], eyebrow: ["Serin iklim tahılı", "Cool-season grain"],
    sectionLabel: ["Arpa üretimi", "Barley production"], sectionTitle: ["Serin iklim tahıllarının güçlü ve çok yönlü ürünü.", "A strong and versatile cool-season grain."],
    sectionText: ["Arpa; yetiştiricilik koşullarına uyum gücü, farklı kullanım alanları ve üretim zincirindeki önemli yeriyle temel tarla bitkilerinden biridir.", "Barley is a fundamental field crop thanks to its adaptability, varied uses and important role in the production chain."],
    whiteTitle: ["Toprağın koşullarını okuyarak üretimin her aşamasını birlikte yönetiyoruz.", "We read soil conditions and manage every stage of production as one."], whiteText: ["Ekimden hasada kadar ürünün gelişim dönemi, toprak yapısı ve kullanım amacı üretim kararlarının temelini oluşturur.", "From sowing to harvest, crop development, soil structure and intended use guide production decisions."],
    usage: [["Yem, malt ve gıda", "Feed, malt and food"], ["Hayvan beslemede yaygın olarak kullanılır. Malt üretiminin temel hammaddelerinden biridir ve bazı çeşitleri gıda ürünlerinde değerlendirilir.", "Widely used in animal nutrition, barley is a key raw material for malt and some varieties are used in food products."]],
    sowing: [["Sonbahar / İlkbahar", "Autumn / Spring"], ["Bölge ve çeşide göre kışlık veya yazlık ekim yapılabilir. İç Anadolu’da kışlık ekim yaygındır.", "Depending on region and variety, barley may be sown in autumn or spring; winter sowing is common in Central Anatolia."]],
    harvest: [["Haziran – Temmuz", "June – July"], ["Hasat zamanı bölgeye, ekim dönemine ve çeşide göre değişir. İç Anadolu’da çoğunlukla yaz başında olgunlaşır.", "Harvest timing varies by region, sowing period and variety, with maturity generally reached in early summer in Central Anatolia."]],
    character: [["Serin iklim tahılı", "Cool-season grain"], ["Farklı çevre koşullarına uyum gösterebilen, tek yıllık ve kullanım amacına göre farklı çeşitleri bulunan bir tahıldır.", "An annual grain adaptable to varied environments, with different varieties suited to different uses."]],
    highlights: [["Uyum gücü", "Adaptability"], ["Çok yönlü kullanım", "Versatile use"], ["Planlı ekim", "Planned sowing"], ["Kontrollü hasat", "Controlled harvest"]],
  },
  {
    kicker: ["Bereketin kaynağı", "A source of abundance"], eyebrow: ["Temel tahıl", "Essential grain"],
    sectionLabel: ["Buğday üretimi", "Wheat production"], sectionTitle: ["Toprağın karakterini doğru okuyarak dengeli üretim.", "Balanced production through an accurate reading of the soil."],
    sectionText: ["Buğday üretiminde ekim zamanı, çeşit seçimi, toprak koşulları ve hasat dönemi aynı üretim planının birbirini tamamlayan parçalarıdır.", "In wheat production, sowing time, variety selection, soil conditions and harvest are complementary parts of one plan."],
    whiteTitle: ["Üretim sürecini yalnızca hasatla değil, tüm gelişim dönemiyle ele alıyoruz.", "We consider the entire growth period, not only the harvest."], whiteText: ["Saha koşullarını düzenli takip ederek ürünün ihtiyaçlarını üretim döneminin her aşamasında yeniden değerlendiriyoruz.", "We regularly monitor field conditions and reassess crop needs at every stage."],
    usage: [["Un, yem ve gıda", "Flour, feed and food"], ["Başta un ve unlu mamuller olmak üzere geniş bir gıda zincirinde kullanılır. Bazı çeşitleri yem amacıyla da değerlendirilir.", "Used throughout the food chain, especially for flour and baked goods, while some varieties are also used for feed."]],
    sowing: [["Sonbahar ağırlıklı", "Mainly autumn"], ["Türkiye’de yaygın olarak kışlık ekim yapılır. Bölge ve iklim koşullarına göre ilkbahar ekimleri de mümkündür.", "Winter sowing is widespread in Türkiye, while spring sowing is possible depending on region and climate."]],
    harvest: [["Haziran – Ağustos", "June – August"], ["Hasat dönemi bölgenin iklim koşullarına ve rakımına göre değişir. İç Anadolu’da çoğunlukla yaz aylarında gerçekleştirilir.", "Harvest varies with climate and elevation and generally takes place during summer in Central Anatolia."]],
    character: [["Serin iklim tahılı", "Cool-season grain"], ["Dünyanın temel tahıllarından biridir. Çeşit, iklim ve yetiştirme amacına göre farklı üretim özellikleri gösterir.", "One of the world’s essential grains, with production characteristics shaped by variety, climate and purpose."]],
    highlights: [["Çeşit seçimi", "Variety selection"], ["Toprak dengesi", "Soil balance"], ["Saha takibi", "Field monitoring"], ["Doğru hasat", "Timely harvest"]],
  },
  {
    kicker: ["Üretimin ritmi", "The rhythm of production"], eyebrow: ["Sıcak iklim tahılı", "Warm-season grain"],
    sectionLabel: ["Mısır üretimi", "Corn production"], sectionTitle: ["Yüksek verim potansiyelini doğru zamanlama ile buluşturuyoruz.", "We combine high yield potential with accurate timing."],
    sectionText: ["Mısır üretiminde sıcaklık, su yönetimi, gelişim dönemi ve hasat zamanı ürün performansını doğrudan etkileyen temel unsurlardır.", "Temperature, water management, growth stage and harvest timing directly influence corn performance."],
    whiteTitle: ["Ürünün gelişim ritmini takip eden planlı bir üretim yaklaşımı.", "A planned approach that follows the crop’s growth rhythm."], whiteText: ["Mısırın farklı gelişim evrelerini saha koşullarıyla birlikte değerlendirerek üretim sürecini kontrollü biçimde yönetiyoruz.", "We evaluate each growth stage with field conditions and manage production in a controlled way."],
    usage: [["Yem, gıda ve sanayi", "Feed, food and industry"], ["Hayvan besleme, nişasta ve yağ sanayisi ile farklı gıda ürünlerinde geniş kullanım alanına sahiptir.", "Widely used in animal nutrition, starch and oil industries, and many food products."]],
    sowing: [["İlkbahar", "Spring"], ["Toprak sıcaklığının uygun seviyeye ulaşmasıyla ekim yapılır. Bölgeye göre ekim tarihi değişiklik gösterir.", "Sowing begins when soil temperature reaches the appropriate level, with timing varying by region."]],
    harvest: [["Ağustos – Ekim", "August – October"], ["Ürünün kullanım amacına, ekim tarihine ve bölgesel iklim koşullarına göre hasat zamanı değişebilir.", "Harvest timing varies by intended use, sowing date and regional climate."]],
    character: [["Sıcak iklim tahılı", "Warm-season grain"], ["Yüksek verim potansiyeline sahip, sıcaklık ve su yönetimine duyarlı, hızlı gelişen bir tarla bitkisidir.", "A fast-growing crop with high yield potential and sensitivity to temperature and water management."]],
    highlights: [["Su yönetimi", "Water management"], ["Gelişim takibi", "Growth monitoring"], ["Doğru zamanlama", "Accurate timing"], ["Yüksek potansiyel", "High potential"]],
  },
  {
    kicker: ["Güneşe uzanan", "Reaching for the sun"], eyebrow: ["Yağ bitkisi", "Oilseed crop"],
    sectionLabel: ["Ayçiçeği üretimi", "Sunflower production"], sectionTitle: ["Toprak, sıcaklık ve gelişim dönemini birlikte değerlendiriyoruz.", "We assess soil, temperature and growth period together."],
    sectionText: ["Ayçiçeği üretiminde ekim zamanı, toprak koşulları, gelişim süreci ve hasat olgunluğu birlikte değerlendirilir.", "Sunflower production combines sowing time, soil conditions, growth and harvest maturity."],
    whiteTitle: ["Her gelişim dönemini kendi koşulları içinde takip ediyoruz.", "We follow each growth stage within its own conditions."], whiteText: ["Üretim boyunca alınan kararları ürünün gelişim süreci ve değişen saha koşullarıyla birlikte ele alıyoruz.", "Production decisions are considered alongside crop development and changing field conditions."],
    usage: [["Yağ, yem ve gıda", "Oil, feed and food"], ["Bitkisel yağ üretiminde temel hammaddelerden biridir. Küspesi yem sanayisinde, bazı çeşitleri ise çerezlik olarak kullanılır.", "A key raw material for vegetable oil; its meal is used for feed and some varieties for snacks."]],
    sowing: [["İlkbahar", "Spring"], ["Toprak sıcaklığının yükselmesiyle ekim yapılır. Bölge ve iklim koşullarına göre ekim zamanı farklılaşır.", "Sowing begins as soil warms, with timing varying by region and climate."]],
    harvest: [["Ağustos – Eylül", "August – September"], ["Tabla ve danelerin olgunlaşması takip edilir. Hasat tarihi bölge, çeşit ve ekim zamanına göre değişiklik gösterir.", "Head and seed maturity are monitored, with harvest varying by region, variety and sowing time."]],
    character: [["Yağ bitkisi", "Oilseed crop"], ["Güçlü kök sistemi ve farklı toprak koşullarına uyum yeteneğiyle önemli bir endüstri bitkisidir.", "An important industrial crop with a strong root system and adaptability to varied soils."]],
    highlights: [["Güçlü kök", "Strong roots"], ["Toprak uyumu", "Soil adaptability"], ["Olgunluk takibi", "Maturity monitoring"], ["Kaliteli ürün", "Quality crop"]],
  },
];

products.forEach((product, index) => {
  const n = index + 1;
  for (const key of ["kicker", "eyebrow", "sectionLabel", "sectionTitle", "sectionText", "whiteTitle", "whiteText"]) {
    const field = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    add(`detail_product_${n}_${field}`, product[key][0], product[key][1]);
  }
  for (const fact of ["usage", "sowing", "harvest", "character"]) {
    add(`detail_product_${n}_${fact}_value`, product[fact][0][0], product[fact][0][1]);
    add(`detail_product_${n}_${fact}_description`, product[fact][1][0], product[fact][1][1]);
  }
  product.highlights.forEach(([tr, en], highlight) => add(`detail_product_${n}_highlight_${highlight + 1}`, tr, en));
});

seed.media ||= {};
const productImages = ["/barley-field.png", "/wheat-field.png", "/corn-field.png", "/sunflower-field.png"];
for (let index = 1; index <= 4; index++) seed.media[`detailProduct${index}`] = { localDefault: productImages[index - 1], externalUrl: null };

fs.writeFileSync(file, `${JSON.stringify(seed, null, 2)}\n`);
