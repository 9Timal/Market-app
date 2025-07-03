export interface Product {
  _id?: string; // facultatif car pas encore présent avant insertion
  name: string;
  category: string;
  marque: string;
  barcode: string;
  description?: string;
  image_url?: string;
}
