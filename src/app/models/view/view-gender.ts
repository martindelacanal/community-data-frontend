export interface ViewGender {
  id: string;
  name: string;
  name_es: string;
  creation_date: string;
  modification_date: string;
  beneficiaries: {beneficiary_id: number, username: string, creation_date: string}[];
}
