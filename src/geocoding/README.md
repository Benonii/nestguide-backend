# Geocoding API Endpoint

This module provides a backend proxy for the U.S. Census Bureau Geocoding Services API.

## Endpoint

**POST** `/api/geocoding/geocode`

## Request Body

```json
{
  "street": "1600 Pennsylvania Avenue NW",
  "city": "Washington", 
  "state": "DC",
  "zipCode": "20500"
}
```

### Parameters

- `street` (string, required): Street address
- `city` (string, required): City name
- `state` (string, required): Two-letter state code (e.g., "DC", "CA", "NY")
- `zipCode` (string, required): ZIP code (5-10 characters)

## Response

### Success Response (200)

```json
{
  "success": true,
  "coordinates": {
    "lat": 38.898690918655,
    "lon": -77.036543957308
  }
}
```

### Error Responses

#### Validation Error (400)
```json
{
  "error": "Invalid input",
  "details": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Street address is required",
      "path": ["street"]
    }
  ]
}
```

#### Address Not Found (404)
```json
{
  "success": false,
  "error": "Address not found or geocoding failed"
}
```

#### Server Error (500)
```json
{
  "success": false,
  "error": "Internal server error"
}
```

## Usage Example

```bash
curl -X POST http://localhost:5000/api/geocoding/geocode \
  -H "Content-Type: application/json" \
  -d '{
    "street": "1600 Pennsylvania Avenue NW",
    "city": "Washington",
    "state": "DC", 
    "zipCode": "20500"
  }'
```

## Notes

- This endpoint proxies requests to the U.S. Census Bureau Geocoding Services API
- The API is free and does not require authentication
- Coordinates are returned in decimal degrees (WGS84)
- The endpoint includes input validation and error handling
