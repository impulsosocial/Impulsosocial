// Cloudflare Pages Function: functions/api/create-checkout.js
// Configure MERCADOPAGO_ACCESS_TOKEN as a secret in Cloudflare Pages.
// This starter deliberately fails closed until a real provider token is configured.
// Test in Mercado Pago sandbox before accepting live payments.
export async function onRequestPost({ request, env }) {
  if (!env.MERCADOPAGO_ACCESS_TOKEN) {
    return Response.json({ error: "Pagamento online ainda não configurado. O responsável precisa adicionar o token do Mercado Pago no Cloudflare." }, { status: 503 });
  }
  let order;
  try { order = await request.json(); } catch {
    return Response.json({ error: "Pedido inválido." }, { status: 400 });
  }
  if (!order || !Array.isArray(order.items) || order.items.length < 1 || order.items.length > 30) {
    return Response.json({ error: "Carrinho inválido." }, { status: 400 });
  }
  const allowed = {
    "ig-follow": { title: "Instagram — Seguidores", price: 1.00 },
    "ig-like": { title: "Instagram — Curtidas", price: 0.20 },
    "ig-views": { title: "Instagram — Visualizações", price: 0.10 },
    "tt-follow": { title: "TikTok — Seguidores", price: 1.50 },
    "tt-like": { title: "TikTok — Curtidas", price: 0.25 },
    "tt-views": { title: "TikTok — Visualizações", price: 0.08 },
    "yt-subs": { title: "YouTube — Inscritos", price: 2.00 },
    "yt-views": { title: "YouTube — Visualizações", price: 0.10 },
    "fb-like": { title: "Facebook — Curtidas", price: 0.20 },
    "kw-follow": { title: "Kwai — Seguidores", price: 1.20 },
    "kw-views": { title: "Kwai — Visualizações", price: 0.08 },
    "x-follow": { title: "X — Seguidores", price: 1.50 },
    "comments": { title: "Comentários", price: 0.30 },
    "shares": { title: "Compartilhamentos", price: 0.20 },
    "saves": { title: "Salvamentos", price: 0.20 }
  };
  const items = [];
  for (const item of order.items) {
    const p = allowed[item.id];
    const qty = Number(item.qty);
    if (!p || !Number.isInteger(qty) || qty < 1 || qty > 1000) {
      return Response.json({ error: "Um dos itens ou quantidades de pacotes não é válido." }, { status: 400 });
    }
    items.push({ title: p.title, quantity: qty, unit_price: p.price, currency_id: "BRL" });
  }
  const origin = new URL(request.url).origin;
  const payload = {
    items,
    external_reference: crypto.randomUUID(),
    back_urls: { success: `${origin}/?payment=success`, failure: `${origin}/?payment=failure`, pending: `${origin}/?payment=pending` },
    auto_return: "approved",
    notification_url: env.MERCADOPAGO_WEBHOOK_URL || undefined,
    metadata: { customer_name: String(order.name || "").slice(0, 100), profile: String(order.profile || "").slice(0, 200), notes: String(order.obs || "").slice(0, 500) }
  };
  const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: { "Authorization": `Bearer ${env.MERCADOPAGO_ACCESS_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await response.json();
  if (!response.ok) {
    return Response.json({ error: "O provedor recusou a criação do checkout. Verifique as credenciais e a conta do Mercado Pago." }, { status: 502 });
  }
  return Response.json({ checkout_url: result.init_point });
}
