export interface workerTable {
  results: [
      {
        id: string,
        user_id: string,
        username: string,
        firstname: string,
        lastname: string,
        community_city: string,
        onboarding_date: string,
        offboarding_date: string,
      }
  ],
  numOfPages: number,
  totalItems: number
  page: number,
  orderBy: string,
  orderType: string
}
