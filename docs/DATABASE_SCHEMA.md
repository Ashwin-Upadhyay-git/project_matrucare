# Database Schema

## MongoDB / Mongoose models

### User
```js
{
  fullName: String,
  email: String,
  password: String,
  isVerified: Boolean,
  otpHash: String,
  otpExpiresAt: Date,
  otpAttempts: Number,
  otpResendAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

Notes:
- `email` is unique.
- `password` is never returned through API responses.
- `otpHash` is never exposed.

### HackathonRegistration
```js
{
  userId: ObjectId,
  fullName: String,
  email: String,
  mobileNumber: String,
  collegeName: String,
  course: String,
  branch: String,
  yearOfStudy: String,
  domain: String,
  projectName: String,
  pptLink: String,
  prototypeLink: String,
  demoVideoLink: String,
  teamSize: Number,
  teamMembers: [{ name: String, email: String }],
  createdAt: Date,
  updatedAt: Date
}
```

Notes:
- `userId` is unique to prevent duplicate registrations per user.
- `teamMembers` stores additional participant names and emails.

## Indexes
- Unique index on `User.email`
- Unique index on `HackathonRegistration.userId`

## Design decisions
The schema stays intentionally simple and extensible. Additional fields can be added without breaking the core participant profile and registration flow.
