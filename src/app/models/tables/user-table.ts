export interface userTable {
  results: [
      {
        id: string,
        username: string,
        email: string,
        firstname: string,
        lastname: string,
        role: string,
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
