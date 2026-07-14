export type ProductVariant = {
  id: number;
  label: string;
  price: number;
  sort_order?: number;
};

export type ProductForPrice = {
  price: number | null;
  product_variants?: { price: number }[] | null;
};

export function priceLabel(product: ProductForPrice): string {
  const variants = product.product_variants;
  if (variants && variants.length > 0) {
    const min = Math.min(...variants.map((v) => v.price));
    return `desde $${min}`;
  }
  return product.price != null ? `$${product.price}` : "";
}

export function isFullPhotoUrl(url: string | null | undefined): boolean {
  return !!url && /^https?:\/\//.test(url);
}
