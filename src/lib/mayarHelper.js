export const generateMayarLink = (productSlug, price) => {
  // Format: https://mayar.id/checkout/{productSlug}?price={amount}
  return `https://mayar.id/checkout/${productSlug}?price=${price}`;
};
