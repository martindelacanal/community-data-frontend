export interface HouseholdMetrics {
  average: number,
  median: number,
  data: {
    name: string,
    total: number
  }[]
}
