export interface VolunteerLocationMetrics {
  average: number,
  median: number,
  total: number,
  data: {
    name: string,
    total: number
  }[]
}
