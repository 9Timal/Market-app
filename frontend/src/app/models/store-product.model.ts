
export interface StoreProduct {
  _id: string;
  store_id: string;
  product_id: string;
  price: number;
  stock: number;
  promo?: string;
}
