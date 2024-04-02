export interface genderTable {
  results: [
      {
        id: string,
        name: string,
        enabled: string,
        creation_date: string,
        modification_date: string,
      }
  ],
  numOfPages: number,
  totalItems: number
  page: number,
  orderBy: string,
  orderType: string
}
