import { getRevenueConfig } from "./config";

type ShopifyOrder = {
  id: string;
  name: string;
  createdAt: string;
  currencyCode: string;
  totalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
  totalRefundedSet: { shopMoney: { amount: string; currencyCode: string } };
  customer: { id: string; displayName: string; email: string } | null;
  transactions: Array<{ kind: string; status: string; amountSet: { shopMoney: { amount: string } } }>;
};

const ORDERS_QUERY = `query RevenueOrders($cursor: String, $query: String!) {
  orders(first: 100, after: $cursor, query: $query, sortKey: CREATED_AT) {
    pageInfo { hasNextPage endCursor }
    nodes {
      id name createdAt currencyCode
      totalPriceSet { shopMoney { amount currencyCode } }
      totalRefundedSet { shopMoney { amount currencyCode } }
      customer { id displayName email }
      transactions(first: 20) { kind status amountSet { shopMoney { amount } } }
    }
  }
}`;

export async function fetchShopifyOrders(cutoffIso: string) {
  const cfg = getRevenueConfig();
  const endpoint = `https://${cfg.shopDomain}/admin/api/${cfg.shopifyApiVersion}/graphql.json`;
  const query = `created_at:<=${cutoffIso}`;
  let cursor: string | null = null;
  const orders: ShopifyOrder[] = [];
  do {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": cfg.shopifyAccessToken,
      },
      body: JSON.stringify({ query: ORDERS_QUERY, variables: { cursor, query } }),
      cache: "no-store",
    });
    if (!response.ok) throw new Error(`SHOPIFY_HTTP_${response.status}`);
    const body = await response.json();
    if (body.errors?.length) throw new Error("SHOPIFY_GRAPHQL_ERROR");
    const connection = body.data?.orders;
    if (!connection) throw new Error("SHOPIFY_ORDERS_RESPONSE_MISSING");
    orders.push(...connection.nodes);
    cursor = connection.pageInfo.hasNextPage ? connection.pageInfo.endCursor : null;
  } while (cursor);
  return orders.map((o) => ({
    id: o.id,
    name: o.name,
    customerId: o.customer?.id ?? null,
    customerName: o.customer?.displayName ?? "",
    customerEmail: o.customer?.email ?? "",
    createdAt: o.createdAt,
    currency: o.currencyCode,
    gross: Number(o.totalPriceSet.shopMoney.amount),
    refunds: Number(o.totalRefundedSet.shopMoney.amount),
    net: Number(o.totalPriceSet.shopMoney.amount) - Number(o.totalRefundedSet.shopMoney.amount),
    transactions: o.transactions,
  }));
}

// Deliberately no Shopify mutations: this adapter is read-only.
