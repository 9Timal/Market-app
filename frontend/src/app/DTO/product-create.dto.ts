export interface ProductCreateDTO {
  name: string;
  category: string;
  marque: string;
  barcode: string;
  description?: string;
  image_url?: string;
}
