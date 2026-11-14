# MatruCare AI Hackathon Registration Portal

## Overview
This project is a full-stack hackathon registration system built with a React + Vite frontend and an Express + MongoDB backend. It supports signup, OTP verification, protected dashboard access, registration workflows, and email-based notifications.

## Problem statement
The goal is to provide a secure and polished web application for MatruCare AI participants to register, verify their accounts, and submit hackathon project details with team management and persistence in MongoDB.

## Features
- Responsive landing page and event website
- User signup and OTP verification
- Secure login with JWT and cookie-based auth
- Protected dashboard and registration flow
- Dynamic team members management
- MongoDB-backed persistence
- Nodemailer notifications
- Contact form with validation and rate limiting
- Automated backend and frontend test coverage

## Tech stack
- Frontend: React, Vite, Tailwind CSS, React Router, React Hook Form, Zod
- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Helmet, CORS, rate limiting
- Testing: Vitest, Supertest, React Testing Library
- Email: Nodemailer SMTP via Gmail App Password

## Architecture
- `client/` contains the React frontend.
- `server/` contains the Express API and MongoDB models.
- `docs/` contains project documentation.

## Installation

### Root
```bash
npm install
```

### Frontend
```bash
cd client
npm install
```

### Backend
```bash
cd server
npm install
```

## Environment variables
Copy the examples and fill in real values.

### Backend `.env.example`
```env
NODE_ENV=development
PORT=5000
MONGO_URI=
JWT_SECRET=change-me
CLIENT_URL=http://localhost:5173
EMAIL_USER=
EMAIL_PASS=
```

### Frontend `.env.example`
```env
VITE_API_BASE_URL=http://localhost:5000
```

## Run locally

### Frontend
```bash
cd client
npm run dev
```

### Backend
```bash
cd server
npm run dev
```

### Full stack
From the project root:
```bash
npm run dev
```

## Testing
```bash
cd server && npm test
cd client && npm test
```

## API endpoints
- `POST /api/auth/signup`
- `POST /api/auth/verify-otp`
- `POST /api/auth/resend-otp`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET /api/user/me`
- `PUT /api/user/update`
- `POST /api/hackathon/register`
- `GET /api/hackathon/my-entry`
- `DELETE /api/hackathon/`
- `POST /api/contact`
- `GET /api/health`

## Authentication workflow
1. User signs up.
2. Password is hashed with bcryptjs.
3. A six-digit OTP is generated and sent by email.
4. The user verifies OTP.
5. The backend marks the account as verified.
6. Login creates a signed JWT and stores it in an HTTP-only cookie.

## OTP workflow
- OTP expiry is set to 10 minutes.
- OTP values are stored as bcrypt hashes.
- OTPs are invalidated after successful verification.
- Resend is limited by a cooldown and rate limiting.

## Deployment
This project is prepared for Render and Vercel deployment, but deployment credentials were not available in the current environment. See the deployment guide for the exact production configuration steps.

## Known limitations
- Real SMTP credentials, MongoDB Atlas credentials, and deployment access were not available during this local development session.
- Contact and registration email delivery will be active only when the corresponding environment variables are configured.
- Public deployment URLs are not included because they were not verified in this environment.

## Project structure
```text
matrucare-ai/
├── client/
├── server/
├── docs/
├── README.md
├── .gitignore
├── package.json
```
