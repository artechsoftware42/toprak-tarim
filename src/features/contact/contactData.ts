export type LocationKey = "office" | "factory";

export type LocationData = {
  number: string;
  title: string;
  subtitle: string;
  embedUrl: string;
  directionsUrl: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  coordinates: string;
};

export const LOCATIONS: Record<LocationKey, LocationData> = {
  office: {
    number: "01",
    title: "Merkez Ofis",
    subtitle: "Yönetim · Satış · Operasyon",

    embedUrl:
      "https://www.google.com/maps?q=37.8750381,32.5454235&z=16&output=embed",

    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=37.8750381,32.5454235",

    address: "Merkez ofis adresinizi buraya yazabilirsiniz.",

    phone: "+90 332 000 00 00",
    whatsapp: "+90 533 000 00 00",
    email: "info@topraktarim.com.tr",

    coordinates: "37.8750381, 32.5454235",
  },

  factory: {
    number: "02",
    title: "Fabrika",
    subtitle: "Üretim · Depolama · Sevkiyat",

    embedUrl:
      "https://www.google.com/maps?q=37.8738547,32.6141463&z=16&output=embed",

    directionsUrl:
      "https://www.google.com/maps/dir/?api=1&destination=37.8738547,32.6141463",

    address: "Fabrika adresinizi buraya yazabilirsiniz.",

    phone: "+90 332 000 00 01",
    whatsapp: "+90 533 000 00 01",
    email: "fabrika@topraktarim.com.tr",

    coordinates: "37.8738547, 32.6141463",
  },
};