export interface NewTicket {
  donation_id: string;
  total_weight: string;
  provider: string;
  destination: string;
  date: string;
  delivered_by: string;
  audit_status: string;
  notes: string;
  image_count: number;
  products: {
              product: string;
              product_type: string;
              quantity: string;
            }[];
}
