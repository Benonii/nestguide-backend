import { z } from "zod";

// US state abbreviations
const US_STATE_ABBREVIATIONS = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", 
    ""
] as const;

export const getSchoolStatsSchema = z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.enum(US_STATE_ABBREVIATIONS).optional(),
    zipCode: z.string().max(5),
});

export const getSchoolStatsQueryParametersSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    perPage: z.coerce.number().min(1).max(100).default(10),
});

export type GetSchoolStatsSchema = z.infer<typeof getSchoolStatsSchema>;

export interface SchoolDistrictResult {
  data: {
    name: string
    id: string
    found: boolean
  }
}

export type SchoolItem = {
  "schoolid": string,
  "schoolName": string,
  "phone": string,
  "url": string,
  "urlCompare": string,
	"address": {
    "street": string,
		"city": string,
    "state": string,
    "stateFull": string,
  "zip": string,
		"zip4": string,
    "cityURL": string,
    "zipURL": string,
    "html": string,
  },
  "lowGrade": string,
  "highGrade": string,
  "schoolLevel": string,
  "isCharterSchool": string,
  "isMagnetSchool": string,
  "isVirtualSchool": string,
  "isTitleISchool": string,
  "isTitleISchoolwideSchool": string, 
	"district": {
    "districtID": string,
    "districtName": string,
    "url": string,
    "rankURL": string,
	},
  "county": {
    "countyName": string,
    "countyURL": string,
  },
	"rankHistory": {
    "year": number,
    "rank": number,
    "rankOf": number,
    "rankStars": number,
    "rankLevel": string,
    "rankStatewidePercentage": number,
    "averageStandardScore": number,
  }[],
  "rankMovement": number,
  "schoolYearlyDetails": {
    "year": 2024,
			"numberOfStudents": number,
			"percentFreeDiscLunch": number,
			"percentofAfricanAmericanStudents": number,
			"percentofAsianStudents": number,
			"percentofHispanicStudents": number,
			"percentofIndianStudents": number,
			"percentofPacificIslanderStudents": number,
			"percentofWhiteStudents": number,
			"percentofTwoOrMoreRaceStudents": number,
			"percentofUnspecifiedRaceStudents": number| null,
			"teachersFulltime": number,
			"pupilTeacherRatio": number,
			"numberofAfricanAmericanStudents": number,
			"numberofAsianStudents": number,
			"numberofHispanicStudents": number,
			"numberofIndianStudents": number,
			"numberofPacificIslanderStudents": number,
			"numberofWhiteStudents": number,
			"numberofTwoOrMoreRaceStudents": number,
			"numberofUnspecifiedRaceStudents": number| null,
	  }[],
  "isPrivate": boolean,
	"privateDays": number| null,
	"privateHours": number| null,
	"privateHasLibrary": boolean| null,
	"privateCoed": boolean| null,
	"privateOrientation": number| null,
	"ncesPrivateSchoolID": number| null,
}

export type SchoolStats = {
	"numberOfSchools": number,
	"numberOfPages": 7,
	"schoolList": SchoolItem[]
}