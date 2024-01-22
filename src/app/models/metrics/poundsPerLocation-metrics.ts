export interface PoundsPerLocationMetrics {
  average: number,
  median: number,
  data: {
    name: string,
    total: number
  }[]
}
