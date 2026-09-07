/**
 * Next.js App Router Sitemap Configuration
 * Generates dynamic sitemap.xml for Glamour Emporium Unisex Salon.
 */
export default function sitemap() {
  const baseUrl = "https://glamouremporium.com";
  const lastModified = new Date().toISOString();

  return [
    {
      url: baseUrl,
      lastModified: lastModified,
      changeFrequency: "monthly",
      priority: 1.0,
    },
  ];
}
