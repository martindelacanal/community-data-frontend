export interface NewTicket {
  donation_id: string;
  total_weight: string;
  provider: string;
  destination: string;
  date: string;
  delivered_by: string;
  audit_status: string;
  notes: {
    id: number;
    user_id: number;
    firstname: string;
    lastname: string;
    note: string;
    creation_date: string;
  }[];
  image_count: number;
  products: {
              product: string;
              product_type: string;
              quantity: string;
            }[];
}
