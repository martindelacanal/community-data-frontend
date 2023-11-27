export interface deliveredTable {
  results: [
      {
        id: string,
        delivering_user_id: string,
        delivery_username: string,
        receiving_user_id: string,
        beneficiary_username: string,
        location_id: string,
        community_city: string,
        approved: string,
        creation_date: string
      }
  ],
  numOfPages: number,
  totalItems: number
  page: number,
  orderBy: string,
  orderType: string
}
