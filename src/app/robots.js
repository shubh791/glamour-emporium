/**
 * Next.js App Router Robots Configuration
 * Configures search engine crawlers and points to the canonical sitemap.
 */
export default function robots() {
  const baseUrl = "https://glamouremporiumsaloon.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
