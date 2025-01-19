export interface volunteerTable {
  results: [
      {
        id: string,
        email: string,
        firstname: string,
        lastname: string,
        location: string,
        gender: string,
        ethnicity: string,
        creation_date: string
      }
  ],
  numOfPages: number,
  totalItems: number
  page: number,
  orderBy: string,
  orderType: string
}
