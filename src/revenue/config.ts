export type RevenueConfig = {
  shopDomain: string;
  shopifyAccessToken: string;
  shopifyApiVersion: string;
  databaseUrl: string;
  stripeSecretKey?: string;
};

export function getRevenueConfig(): RevenueConfig {
  const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const shopifyAccessToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const databaseUrl = process.env.DATABASE_URL;
  const missing = [
    !shopDomain && "SHOPIFY_STORE_DOMAIN",
    !shopifyAccessToken && "SHOPIFY_ADMIN_ACCESS_TOKEN",
    !databaseUrl && "DATABASE_URL",
  ].filter(Boolean);
  if (missing.length) {
    throw new Error(`REVENUE_CONFIGURATION_REQUIRED: ${missing.join(", ")}`);
  }
  return {
    shopDomain: shopDomain!.replace(/^https?:\/\//, "").replace(/\/$/, ""),
    shopifyAccessToken: shopifyAccessToken!,
    shopifyApiVersion: process.env.SHOPIFY_API_VERSION || "2026-10",
    databaseUrl: databaseUrl!,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY || undefined,
  };
}
