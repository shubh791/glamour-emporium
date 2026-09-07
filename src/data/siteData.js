/**
 * Centralized Business & Site Data for Glamour Emporium Unisex Salon
 * 
 * NOTE: Contains ONLY verified business information.
 * Do not add placeholder pricing, fake testimonials, unverified services, or stock content.
 */

const WHATSAPP_PHONE_RAW = "917495068282";
const DEFAULT_BOOKING_MESSAGE = "Hi Glamour Emporium, I would like to book a slot.";

/**
 * Generates a direct WhatsApp click-to-chat URL with an encoded booking message
 * @param {string} [customMessage] - Optional custom booking text
 * @returns {string} WhatsApp web / deep link URL
 */
export function buildWhatsAppUrl(customMessage = DEFAULT_BOOKING_MESSAGE) {
  const encodedText = encodeURIComponent(customMessage);
  return `https://wa.me/${WHATSAPP_PHONE_RAW}?text=${encodedText}`;
}

export const siteData = {
  business: {
    name: "Glamour Emporium Unisex Salon",
    shortName: "Glamour Emporium",
    tagline: "Unisex Salon",
    address: {
      street: "Jattal Road, Near Choudhary Hospital",
      city: "Panipat",
      state: "Haryana",
      postalCode: "132103",
      country: "India",
      fullAddress: "Jattal Road, Near Choudhary Hospital, Panipat, Haryana - 132103",
      googleMapsUrl: "https://maps.google.com/?q=Glamour+Emporium+Unisex+Salon+Jattal+Road+Near+Choudhary+Hospital+Panipat+Haryana+132103",
    },
    contact: {
      phoneDisplay: "+91 74950 68282",
      phoneTel: "+917495068282",
      whatsappNumber: WHATSAPP_PHONE_RAW,
      defaultMessage: DEFAULT_BOOKING_MESSAGE,
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
    defaultMessage: DEFAULT_BOOKING_MESSAGE,
    whatsappUrl: buildWhatsAppUrl(DEFAULT_BOOKING_MESSAGE),
  },
};

export default siteData;

// Replace editorial references with approved salon photography when available.
// These images are inspiration, not clients, staff, or the salon premises.
export const editorialImages = {
  woman: { src: "/images/editorial-woman.jpg", alt: "Editorial portrait of a woman with sculptural, voluminous curls", position: "50% 35%" },
  man: { src: "/images/editorial-man.jpg", alt: "Black and white editorial portrait with textured men's hair", position: "50% 30%" },
  detail: { src: "/images/salon-detail.jpg", alt: "Barber carefully shaping a haircut, an illustration of grooming craft", position: "50% 50%" },
  texture: { src: "/images/texture-portrait.jpg", alt: "Editorial beauty portrait showing natural hair texture", position: "50% 35%" },
};

// Broad enquiry categories, not a confirmed treatment or price list.
export const serviceCategories = [
  { title: "Hair & styling", description: "A subtle refresh or a new direction. Tell us what you have in mind and let's talk about a look that feels like you." },
  { title: "Men’s grooming", description: "From your everyday style to your next occasion, talk to us about your hair and grooming preferences." },
  { title: "Beauty & care", description: "Make room for some self-care. Message us to explore the beauty and care options available for your visit." },
];
