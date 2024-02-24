export interface clientTable {
  results: [
      {
        id: string,
        name: string,
        short_name: string,
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
