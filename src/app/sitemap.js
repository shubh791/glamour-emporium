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
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/cancellation-refund-policy`,
      lastModified: lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
