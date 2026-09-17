import localFont from "next/font/local";
import "./globals.css";
import SmoothScroll from "@/components/motion/SmoothScroll";
import { siteData } from "@/data/siteData";

const geistSans = localFont({
  src: "../../public/fonts/geist-latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const editorialSerif = localFont({
  src: [
    { path: "../../public/fonts/cormorant-regular.woff2", weight: "400", style: "normal" },
    { path: "../../public/fonts/cormorant-italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-editorial",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://glamouremporium.com"),
  title: {
    default: "Glamour Emporium | Unisex Salon in Panipat",
    template: "%s | Glamour Emporium",
  },
  description:
    "Visit Glamour Emporium, a unisex salon on Jattal Road near Choudhary Hospital, Panipat, for hair styling, men's grooming, beauty and personal care services. Book your appointment online or connect on WhatsApp.",
  keywords: [
    "Glamour Emporium",
    "Glamour Emporium Unisex Salon",
    "Unisex Salon in Panipat",
    "Salon in Panipat",
    "Hair Salon in Panipat",
    "Beauty Salon in Panipat",
    "Men's Salon in Panipat",
    "Women's Salon in Panipat",
    "Salon on Jattal Road Panipat",
    "Salon near Choudhary Hospital Panipat",
    "Salon near Model Town Panipat",
    "Salon near Sat Kartar Nagar Panipat",
  ],
  authors: [{ name: "Glamour Emporium", url: "https://glamouremporium.com" }],
  creator: "Glamour Emporium",
  publisher: "Glamour Emporium",
  formatDetection: {
    telephone: true,
    address: true,
    email: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Glamour Emporium",
    title: "Glamour Emporium | Unisex Salon in Panipat",
    description:
      "Visit Glamour Emporium, a unisex salon on Jattal Road near Choudhary Hospital, Panipat, for hair styling, men's grooming, beauty and personal care services. Book your appointment online or connect on WhatsApp.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Glamour Emporium Unisex Salon on Jattal Road, Panipat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glamour Emporium | Unisex Salon in Panipat",
    description:
      "Visit Glamour Emporium, a unisex salon on Jattal Road near Choudhary Hospital, Panipat, for hair styling, men's grooming, beauty and personal care services. Book your appointment online or connect on WhatsApp.",
    images: ["/opengraph-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo/logo-mark.png", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  category: "beauty",
};

const salonStructuredData = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "@id": "https://glamouremporium.com/#salon",
  "name": "Glamour Emporium",
  "alternateName": "Glamour Emporium Unisex Salon",
  "image": "https://glamouremporium.com/opengraph-image.png",
  "logo": "https://glamouremporium.com/images/logo/glamour-emporium-logo.png",
  "description":
    "Glamour Emporium is a unisex salon on Jattal Road, near Choudhary Hospital, Panipat, offering hair styling, men's grooming, and beauty care services.",
  "url": "https://glamouremporium.com",
  "telephone": "+917495068282",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Jattal Road, Near Choudhary Hospital",
    "addressLocality": "Panipat",
    "addressRegion": "Haryana",
    "postalCode": "132103",
    "addressCountry": "IN",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 29.3909,
    "longitude": 76.9635,
  },
  "hasMap":
    "https://maps.google.com/?q=Glamour+Emporium+Unisex+Salon+Jattal+Road+Near+Choudhary+Hospital+Panipat+Haryana+132103",
  "sameAs": [
    "https://instagram.com/glamour_emporium_unisex_salon",
  ],
  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Hair & Styling",
        "description": "Haircuts, styling, hair colour and restorative hair care.",
      },
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Men's Grooming",
        "description": "Haircuts, beard grooming, fades and styling.",
      },
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Beauty & Care",
        "description": "Facial care, hair spa, skin treatments and personal grooming.",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${editorialSerif.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(salonStructuredData) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (var i = 0; i < registrations.length; i++) {
                    registrations[i].unregister();
                  }
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0c0b0a] text-[#f5f2eb]">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
