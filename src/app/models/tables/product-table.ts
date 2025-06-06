export interface productTable {
  results: [
      {
        id: string,
        name: string,
        product_type: string,
        total_quantity: string,
        value_usd: string,
        creation_date: string
      }
  ],
  numOfPages: number,
  totalItems: number
  page: number,
  orderBy: string,
  orderType: string
}
