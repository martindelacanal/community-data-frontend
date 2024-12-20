export interface NewUser {
  username: string;
  password: string;
  email: string;
  firstname: string;
  lastname: string;
  date_of_birth: Date;
  gender_id: string;
  role_id: number;
  phone: string;
  client_id: string;
  emails_for_reporting: {
    email: string
  }[];
}
