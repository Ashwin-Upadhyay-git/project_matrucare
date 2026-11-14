# API Documentation

## Base URL
Local development:
`http://localhost:5000`

## Authentication
Most protected endpoints expect an HTTP-only JWT cookie named `token`.

## Response format
Responses follow a consistent shape:

```json
{
  "success": true,
  "message": "Description",
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Reason"
}
```

## Endpoints

### Health check
#### GET `/api/health`
Returns server health status.

### Authentication

#### POST `/api/auth/signup`
Body:
```json
{
  "fullName": "Test User",
  "email": "user@example.com",
  "password": "StrongPass1"
}
```

Status codes:
- `201` Created
- `400` Validation error
- `409` Duplicate email

#### POST `/api/auth/verify-otp`
Body:
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

#### POST `/api/auth/resend-otp`
Body:
```json
{
  "email": "user@example.com"
}
```

#### POST `/api/auth/login`
Body:
```json
{
  "email": "user@example.com",
  "password": "StrongPass1"
}
```

#### POST `/api/auth/logout`
Clears the auth cookie.

#### GET `/api/auth/me`
Returns current authenticated user.

### User

#### GET `/api/user/me`
Returns the user profile.

#### PUT `/api/user/update`
Body:
```json
{
  "fullName": "Updated Name"
}
```

### Hackathon

#### POST `/api/hackathon/register`
Requires auth.

Example body:
```json
{
  "fullName": "Student User",
  "email": "student@example.com",
  "mobileNumber": "9876543210",
  "collegeName": "VIT Vellore",
  "course": "B.Tech",
  "branch": "CSE",
  "yearOfStudy": "3rd year",
  "domain": "AI/ML",
  "projectName": "AI Health Tracker",
  "pptLink": "https://drive.google.com/file/d/example/view",
  "prototypeLink": "https://github.com/example/project",
  "demoVideoLink": "https://www.youtube.com/watch?v=123",
  "teamSize": 2,
  "teamMembers": [{ "name": "Team Member", "email": "team@example.com" }]
}
```

#### GET `/api/hackathon/my-entry`
Returns the current user's hackathon registration.

#### DELETE `/api/hackathon/`
Deletes the current user's registration.

### Contact

#### POST `/api/contact`
Requires auth for this implementation.

Body:
```json
{
  "name": "Test User",
  "email": "user@example.com",
  "message": "I would like to ask about the event."
}
```

## Status codes
- `200` OK
- `201` Created
- `400` Validation or bad request
- `401` Authentication required or invalid token
- `403` Forbidden or unverified user
- `404` Not found
- `409` Duplicate record
- `429` Rate limited
- `500` Server error
