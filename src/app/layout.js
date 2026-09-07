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
    default: "Glamour Emporium Unisex Salon | Hair & Beauty Salon in Panipat",
    template: "%s | Glamour Emporium Unisex Salon",
  },
  description:
    "Glamour Emporium Unisex Salon on Jattal Road, Panipat offers professional hair styling, men's grooming and beauty care. Book your salon appointment directly on WhatsApp.",
  keywords: [
    "Glamour Emporium",
    "Glamour Emporium Unisex Salon",
    "Hair Salon Panipat",
    "Men's Grooming Panipat",
    "Beauty Salon Panipat",
    "Haircut Panipat",
    "Jattal Road Salon Panipat",
    "Unisex Salon Panipat",
    "Hair Styling Panipat",
  ],
  authors: [{ name: "Glamour Emporium Unisex Salon", url: "https://glamouremporium.com" }],
  creator: "Glamour Emporium Unisex Salon",
  publisher: "Glamour Emporium Unisex Salon",
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
    siteName: "Glamour Emporium Unisex Salon",
    title: "Glamour Emporium Unisex Salon | Hair & Beauty Salon in Panipat",
    description:
      "Glamour Emporium Unisex Salon on Jattal Road, Panipat offers professional hair styling, men's grooming and beauty care. Book your salon appointment directly on WhatsApp.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Glamour Emporium Unisex Salon Panipat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Glamour Emporium Unisex Salon | Hair & Beauty Salon in Panipat",
    description:
      "Glamour Emporium Unisex Salon on Jattal Road, Panipat offers professional hair styling, men's grooming and beauty care. Book your salon appointment directly on WhatsApp.",
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
  "@type": "HairSalon",
  "@id": "https://glamouremporium.com/#salon",
  "name": "Glamour Emporium Unisex Salon",
  "alternateName": "Glamour Emporium",
  "image": "https://glamouremporium.com/opengraph-image.png",
  "logo": "https://glamouremporium.com/images/logo/glamour-emporium-logo.png",
  "description":
    "Glamour Emporium Unisex Salon on Jattal Road, Panipat offers tailored hair styling, men's grooming and beauty care rituals.",
  "url": "https://glamouremporium.com",
  "telephone": "+917495068282",
  "priceRange": "$$",
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
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      "opens": "09:00",
      "closes": "21:00",
    },
  ],
  "sameAs": [
    "https://instagram.com/glamour_emporium_unisex_salon",
  ],
  "makesOffer": [
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Hair & Styling",
        "description": "Tailored cuts, couture styling, and restorative hair care.",
      },
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Men's Grooming",
        "description": "Precision scissor work, tailored fades, and beard sculpting.",
      },
    },
    {
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": "Beauty & Care",
        "description": "Nourishing skin treatments, scalp care, and aesthetic rituals.",
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
      </head>
      <body className="min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
