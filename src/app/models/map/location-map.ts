
export interface LocationMap {
  center: { lat: number, lng: number },
  locations: {
    position: { lat: number, lng: number },
    label: string,
  }[]
}
