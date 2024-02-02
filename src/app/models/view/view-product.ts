export interface ViewProduct {
  id: string;
  name: string;
  product_type: string;
  total_quantity: string;
  value_usd: string;
  creation_date: string;
  modification_date: string;
  tickets: {ticket_id: number, donation_id: string, quantity: string, creation_date: string}[];
}
