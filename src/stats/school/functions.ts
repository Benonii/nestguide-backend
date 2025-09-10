import { type SchoolDistrictResult } from "./validation";
import type { Coordinates } from "@/geocoding/validation";
import { point } from '@turf/helpers';
import { booleanPointInPolygon } from '@turf/boolean-point-in-polygon';
import fs from 'fs';
import path from 'path';

// Cache for school district boundaries to avoid loading the large file repeatedly
let schoolDistrictsCache: any = null;

/**
 * Load school district boundaries from GeoJSON file
 * Uses caching to avoid repeated file reads
 */
const loadSchoolDistrictBoundaries = async (): Promise<any> => {
  if (schoolDistrictsCache) {
    return schoolDistrictsCache;
  }

  try {
    const geoJsonPath = path.join(__dirname, 'School_District_Boundaries_-_Current.geojson');
    
    if (!fs.existsSync(geoJsonPath)) {
      throw new Error('School district boundaries file not found');
    }

    const fileContent = fs.readFileSync(geoJsonPath, 'utf8');
    schoolDistrictsCache = JSON.parse(fileContent);
    
    return schoolDistrictsCache;
  } catch (error) {
    console.error('Error loading school district boundaries:', error);
    throw error;
  }
};

/**
 * Find the school district for given coordinates using spatial analysis
 */
export const getDistrict = async (coordinates: Coordinates): Promise<SchoolDistrictResult> => {
  try {
    const schoolDistrictsGeoJSON = await loadSchoolDistrictBoundaries();
    
    if (!schoolDistrictsGeoJSON || !schoolDistrictsGeoJSON.features) {
      return {
        data: {
          name: "District not found - no boundary data",
          id: "",
          found: false
        }
      };
    }

    // Create a point using Turf.js (equivalent to shapely.geometry.Point)
    const turfPoint = point([coordinates.lon, coordinates.lat]); // [longitude, latitude] format
    
    // Check which polygon contains the point (equivalent to gdf.contains(point))
    const containingDistrict = schoolDistrictsGeoJSON.features.find((feature: any) => {
      return booleanPointInPolygon(turfPoint, feature);
    });
    
    if (containingDistrict) {
      const properties = containingDistrict.properties;
      return {
        data: {
          name: properties.NAME || 
                properties.name || 
                properties.DISTRICT_NAME ||
                properties.SCHOOL_DISTRICT ||
                "Unknown District",
          id: properties.GEOID || 
              properties.ID || 
              properties.id || 
              properties.DISTRICT_ID ||
              properties.FID ||
              null,
          found: true
        }
      };
    }
    
    return {
      data: {
        name: "District not found",
        id: "",
        found: false
      }
    };

    
  } catch (error) {
    console.error("Error in spatial analysis:", error);
    return {
      data: {
        name: "District not found - analysis error",
        id: "",
        found: false
      }
    };
  }
};

export const getSchoolStats = async (districtID: string) => {
  //  const schoolStats    
}