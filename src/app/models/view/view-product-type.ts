export interface ViewProductType {
  id: string;
  name: string;
  name_es: string;
  creation_date: string;
  modification_date: string;
  products: {product_id: number, name: string, total_quantity: string, creation_date: string}[];
}
