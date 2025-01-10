export interface ViewTicket {
  id: string;
  donation_id: string;
  total_weight: string;
  provider: string;
  location: string;
  date: string;
  delivered_by: string;
  transported_by: string;
  created_by_id: string;
  created_by_username: string;
  audit_status: string;
  notes: {
    id: number;
    user_id: number;
    firstname: string;
    lastname: string;
    note: string;
    creation_date: string;
  }[];
  creation_date: string;
  products: {product_id: string, product: string, quantity: string}[];
}
