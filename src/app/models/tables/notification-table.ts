export interface notificationTable {
  results: [
      {
        id: string,
        user_id: string,
        user_name: string,
        message: string,
        creation_date: string
      }
  ],
  numOfPages: number,
  totalItems: number
  page: number,
  orderBy: string,
  orderType: string
}
