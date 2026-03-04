export const generateMayarLink = (productSlug, price) => {
  const merchantSlug = process.env.NEXT_PUBLIC_MAYAR_SLUG || "abyanstudio";

  // Since AI-generated products do not exist in the merchant's Mayar catalog yet,
  // we redirect the "Buy Vibe" button to the merchant's main Mayar profile link.
  // In a full production app, this would hit Mayar's Headless API to dynamically
  // generate a checkout invoice and return its URL.
  return `https://${merchantSlug}.mayar.link/`;
};
