export interface locationTable {
  results: [
      {
        id: string,
        organization: string,
        community_city: string,
        partner: string,
        address: string,
        enabled: string,
        creation_date: string
      }
  ],
  numOfPages: number,
  totalItems: number
  page: number,
  orderBy: string,
  orderType: string
}
