import { type SchoolDistrictResult, type SchoolStats } from "./validation";
import type { Coordinates } from "@/geocoding/validation";
import { point } from '@turf/helpers';
import { booleanPointInPolygon } from '@turf/boolean-point-in-polygon';
import fs from 'fs';
import path from 'path';
import { env } from "@/utils/env";

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

export const getSchoolStats = async (districtID: string, state: string) => {
  const url = `https://api.schooldigger.com/v2.3/schools?districtID=${districtID}&appID=${env.SCHOOLDIGGER_APP_ID}&appKey=${env.SCHOOLDIGGER_APP_KEY}&st=${state}`;
  const response = await fetch(url, {
  });

  if (!response.ok) {
    const error: any = await response.json();
    throw new Error( error?.message || `Failed to fetch school stats: ${response.statusText}`);
  }

  const schoolStats: any = await response.json();

  return {
    numberOfSchools: schoolStats.numberOfSchools,
    numberOfPages: schoolStats.numberOfPages,
    schoolList: schoolStats.schoolList.map((school: any) => ({
      id: school.schoolid,
      name: school.schoolName,
      phone: school.phone,
      url: school.url,
      urlCompare: school.urlCompare,
      address: school.address,
      lowGrade: school.lowGrade,
      highGrade: school.highGrade,
      schoolLevel: school.schoolLevel,
      isCharterSchool: school.isCharterSchool,
      isMagnetSchool: school.isMagnetSchool,
      isVirtualSchool: school.isVirtualSchool,
      isTitleISchool: school.isTitleISchool,
      isPrivate: school.isPrivate,
      privateDays: school.privateDays,
      privateHours: school.privateHours,
      privateCoed: school.privateCoed,
      privateHasLibrary: school.privateHasLibrary,
      privateOrientation: school.privateOrientation,
      ncesPrivateSchoolID: school.ncesPrivateSchoolID,
      isTitleISchoolwideSchool: school.isTitleISchoolwideSchool,
      district:{
        districtID: school.district.districtID,
        districtName: school.district.districtName,
        url: school.district.url,
        rankURL: school.district.rankURL,
      },
      rank: school.rankHistory[0],
      schoolYearlyDetails: school.schoolYearlyDetails
    }))
  };
}