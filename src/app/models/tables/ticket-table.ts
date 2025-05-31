export interface ticketTable {
  results: [
      {
        id: string,
        donation_id: string,
        total_weight: string,
        weight_difference: string,
        provider: string,
        location: string,
        date: string,
        delivered_by: string,
        transported_by: string,
        audit_status: string,
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
