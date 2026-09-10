/**
 * Centralized Business & Site Data for Glamour Emporium Unisex Salon
 * 
 * NOTE: Contains ONLY verified business information.
 * Do not add placeholder pricing, fake testimonials, unverified services, or stock content.
 */

const WHATSAPP_PHONE_RAW = "917495068282";
export const DEFAULT_HELP_MESSAGE = "Hello Glamour Emporium,\n\nI have a question and need some help before booking my appointment.\n\nThank you.";
export const DEFAULT_BOOKING_MESSAGE = DEFAULT_HELP_MESSAGE;

/**
 * Generates a direct WhatsApp click-to-chat URL with an encoded message
 * @param {string} [customMessage] - Optional custom text
 * @returns {string} WhatsApp web / deep link URL
 */
export function buildWhatsAppUrl(customMessage = DEFAULT_HELP_MESSAGE) {
  const encodedText = encodeURIComponent(customMessage);
  return `https://wa.me/${WHATSAPP_PHONE_RAW}?text=${encodedText}`;
}

export const siteData = {
  business: {
    name: "Glamour Emporium Unisex Salon",
    shortName: "Glamour Emporium",
    tagline: "Unisex Salon in Panipat",
    address: {
      street: "Jattal Road, Near Choudhary Hospital",
      city: "Panipat",
      state: "Haryana",
      postalCode: "132103",
      country: "India",
      fullAddress: "Jattal Road, Near Choudhary Hospital, Panipat, Haryana - 132103",
      googleMapsUrl: "https://maps.google.com/?q=Glamour+Emporium+Unisex+Salon+Jattal+Road+Near+Choudhary+Hospital+Panipat+Haryana+132103",
      servingAreas: "Serving clients from Jattal Road, Model Town, New Model Town, Sat Kartar Nagar, and nearby Panipat areas.",
    },
    contact: {
      phoneDisplay: "+91 74950 68282",
      phoneTel: "+917495068282",
      whatsappNumber: WHATSAPP_PHONE_RAW,
      defaultMessage: DEFAULT_HELP_MESSAGE,
    },
    social: {
      instagram: {
        handle: "glamour_emporium_unisex_salon",
        url: "https://instagram.com/glamour_emporium_unisex_salon",
      },
    },
  },
  navigation: [
    { label: "Home", href: "#hero" },
    { label: "Services", href: "#services" },
    { label: "Experience", href: "#experience" },
    { label: "Gallery", href: "#showcase" },
    { label: "Contact", href: "#contact" },
  ],
  booking: {
    ctaLabel: "Book your slot",
    defaultMessage: DEFAULT_HELP_MESSAGE,
    whatsappUrl: buildWhatsAppUrl(DEFAULT_HELP_MESSAGE),
  },
};

export default siteData;

// Replace editorial references with approved salon photography when available.
// These images are inspiration, not clients, staff, or the salon premises.
export const editorialImages = {
  woman: { src: "/images/editorial-woman.jpg", alt: "Women's hair styling at Glamour Emporium salon in Panipat", position: "50% 35%" },
  man: { src: "/images/editorial-man.jpg", alt: "Men's precision haircut and grooming at Glamour Emporium", position: "50% 30%" },
  detail: { src: "/images/salon-detail.jpg", alt: "Hair cutting and styling craft at Glamour Emporium unisex salon", position: "50% 50%" },
  texture: { src: "/images/texture-portrait.jpg", alt: "Hair care and styling texture portrait at Glamour Emporium", position: "50% 35%" },
};

// Customer-friendly service descriptions
export const serviceCategories = [
  { title: "Hair & Styling", description: "From everyday haircuts and styling to colour and hair care, choose a service that suits your look, occasion and preferences." },
  { title: "Men’s Grooming", description: "Haircuts, beard grooming and styling services designed for a clean, well-finished look." },
  { title: "Beauty & Care", description: "Beauty and personal care services for everyday grooming, occasions and special moments." },
];
