import type { CensusGeocodeResponse, Coordinates, GeocodeParams } from "@/geocoding/validation";
import { timestamp, varchar } from "drizzle-orm/pg-core";


export { createId } from "@paralleldrive/cuid2";
export const cuid = (name: string) => varchar(name, { length: 32 });

export const timestamps = {
  createdAt: timestamp("created_on", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_on", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow().$onUpdate(() => new Date()),
};


export const deletedAt = {deletedAt:timestamp("deleted_at", { withTimezone: true, mode: "date" })};

/**
 * Geocode a street address using the U.S. Census Bureau Geocoding Services API.
 * 
 * @param params - Object containing street, city, state, and zipCode
 * @returns Promise resolving to coordinates (lat, lon) or null if not found
 */
export const geocodeAddress = async (params: GeocodeParams): Promise<Coordinates | null> => {
  const { street, city, state, zipCode } = params
  
  const url = "https://geocoding.geo.census.gov/geocoder/locations/address"
  const searchParams = new URLSearchParams({
    street,
    city,
    state,
    zip: zipCode,
    benchmark: "Public_AR_Current",
    format: "json"
  })

  try {
    const response = await fetch(`${url}?${searchParams}`)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json() as CensusGeocodeResponse
    
    if (data.result.addressMatches && data.result.addressMatches.length > 0) {
      const match = data.result.addressMatches[0]
      const coordinates = match?.coordinates
      return {
        lat: coordinates?.y ?? 0,
        lon: coordinates?.x ?? 0
      }
    } else {
      console.log("No match found for this address.")
      return null
    }
  } catch (error) {
    console.error("Request failed:", error)
    return null
  }
}

export type ZipCodeResponse = {
	"country": string,
	"country abbreviation": string,
	"post code": string,
	"places": [
		{
			"place name": string,
			"longitude": string,
			"latitude": string,
			"state": string,
			"state abbreviation": string
		}
	]
}


export const getCentroidFromZipCode = async (zipCode: string): Promise<Coordinates | null> => {
  // Use the zip code to get the centroid
  const response = await fetch(`http://api.zippopotam.us/us/${zipCode}`);
  const data = await response.json() as ZipCodeResponse;
  
  return {
    lon: Number(data?.places[0]?.longitude),
    lat: Number(data?.places[0]?.latitude)
  }
}

