export interface ViewDeliveredBy {
  id: string;
  name: string;
  creation_date: string;
  modification_date: string;
  tickets: {ticket_id: number, donation_id: string, date: string, creation_date: string}[];
}
