export interface ViewProvider {
  id: string;
  name: string;
  total_quantity: string;
  creation_date: string;
  modification_date: string;
  tickets: {ticket_id: number, donation_id: string, quantity: string, creation_date: string}[];
}
