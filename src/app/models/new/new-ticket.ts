export interface NewTicket {
  donation_id: string;
  total_weight: string;
  provider: string;
  destination: string;
  date: string;
  delivered_by: string;
  products: {
              product: string;
              product_type: string;
              quantity: string;
            }[];
}
