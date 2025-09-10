import { z } from "zod";

export const geocodeValidationSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(2, "State is required").max(2, "State must be 2 characters"),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters").max(10, "Zip code must be at most 10 characters")
});



export type GeocodeParams = {
    street: string
    city: string
    state: string
    zipCode: string
}
  
export type Coordinates = {
  lat: number
  lon: number
  state: string
}
  
export type CensusGeocodeResponse = {
  result: {
    addressMatches: Array<{
      coordinates: {
        x: number // longitude
        y: number // latitude
      }
    }>
  }
}

