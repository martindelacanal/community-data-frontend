export interface ViewClient {
  id: string;
  name: string;
  short_name: string;
  email: string;
  phone: string;
  address: string;
  webpage: string;
  enabled: string;
  creation_date: string;
  modification_date: string;
  locations: {location_id: number, community_city: string, enabled: string, creation_date: string}[];
  emails_for_reporting: {
    email: string;
  }[];
}
