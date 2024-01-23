export interface PoundsPerProductMetrics {
  average: number,
  median: number,
  page: number,
  totalItems: number,
  data: {
    name: string,
    total: number
  }[]
}
