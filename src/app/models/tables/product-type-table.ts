export interface productTypeTable {
  results: [
      {
        id: string,
        name: string,
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
