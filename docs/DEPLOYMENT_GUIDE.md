# Deployment Guide

## Prerequisites
- MongoDB Atlas account
- Render account
- Vercel account
- Gmail account with App Password support

## Single-service Docker deployment (Render)
The root `Dockerfile` builds the frontend and runs it from the Express server, so the app and API are available from one Render web service.

1. Push the repository to GitHub and create a new **Web Service** in Render.
2. Select **Docker** as the runtime and keep the repository root as the Docker build context.
3. Configure these environment variables in Render:
   - `MONGO_URI=<MongoDB Atlas connection string>`
   - `JWT_SECRET=<strong secret>`
   - `EMAIL_USER=<Gmail address>`
   - `EMAIL_PASS=<Gmail app password>`
   - `CLIENT_URL=<your Render service URL>`
   Set `MONGO_URI` in the service's **Environment** settings before deploying. Production requires a persistent MongoDB connection; the in-memory database is only used for local development and tests.
4. Deploy. Render provides the `PORT` environment variable; the server listens on it.
5. Verify `https://<render-app>.onrender.com/api/health`.

The frontend uses same-origin API requests in production. Set `VITE_API_BASE_URL` as a Docker build argument only if the frontend API is hosted at a separate URL.

## Backend deployment (Render)
1. Push the `server/` project to GitHub.
2. In Render, create a new Web Service.
3. Set the build command:
   ```bash
   npm install
   ```
4. Set the start command:
   ```bash
   npm start
   ```
5. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `MONGO_URI=<MongoDB Atlas connection string>`
   - `JWT_SECRET=<strong secret>`
   - `CLIENT_URL=<Vercel frontend URL>`
   - `EMAIL_USER=<gmail address>`
   - `EMAIL_PASS=<gmail app password>`
6. Verify health endpoint:
   ```bash
   curl https://<render-app>.onrender.com/api/health
   ```

## Frontend deployment (Vercel)
1. Push the `client/` project to GitHub or connect the repo root.
2. Set the project root to `client`.
3. Add the production environment variable:
   ```env
   VITE_API_BASE_URL=https://<render-app>.onrender.com
   ```
4. Build and deploy.
5. Ensure Vercel rewrites are enabled for SPA routing.

## MongoDB Atlas setup
1. Create a cluster.
2. Create a database user with read/write permissions.
3. Add your deployment IP or allow all IPs during setup.
4. Copy the connection string into `MONGO_URI`.
5. In Render, open the web service's **Environment** settings, add `MONGO_URI`, paste the connection string, and save. Render will redeploy the service.

## Gmail App Password setup
1. Enable 2-Step Verification on the Gmail account.
2. Generate an App Password.
3. Store it in `EMAIL_PASS`.

## Production CORS
Set the backend `CLIENT_URL` to the deployed frontend origin and keep credentials enabled for cookie authentication.

## Verification checklist
- Health endpoint responds successfully.
- Signup and OTP verification work on the deployed system.
- Login creates a valid cookie.
- Dashboard and registration routes load correctly.
- Nodemailer sends OTP and registration confirmation emails.

## Real deployment URLs
No live URLs were verified in this environment because deployment credentials were not available at the time of implementation.
