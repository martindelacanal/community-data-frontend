export interface ticketTable {
  results: [
      {
        id: string,
        donation_id: string,
        total_weight: string,
        provider: string,
        location: string,
        date: string,
        delivered_by: string,
        products: string,
        creation_date: string
      }
  ],
  numOfPages: number,
  totalItems: number
  page: number,
  orderBy: string,
  orderType: string
}
