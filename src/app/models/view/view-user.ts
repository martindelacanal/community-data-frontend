export interface ViewUser {
  id: string;
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  client_name: string;
  date_of_birth: string;
  last_location_community_city: string;
  role_name: string;
  reset_password: string;
  enabled: string;
  modification_date: string;
  creation_date: string;
  ethnicity_name: string;
  other_ethnicity: string;
  gender_name: string;
  phone: string;
  zipcode: string;
  household_size: string;
  table_header: string[];
  table_rows: string[][];
  emails_for_reporting: {
    email: string;
  }[];
}
