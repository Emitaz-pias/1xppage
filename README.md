# Local account app

This repository includes a React frontend and an Express API for account creation, sign-in, and password changes. The deposit interface is illustrative: this app does not send, receive, or verify payments. Balances are displayed values managed by the administrator and are not linked to deposits.

## Requirements

- Node.js 22.12 or newer
- MongoDB configured as a replica set (a single-node replica set is sufficient locally)

Balance changes and their audit records, password changes and session revocation, and user deletion use MongoDB transactions. A standalone MongoDB server does not support these transactions; use a replica-set deployment or a managed MongoDB deployment with transaction support.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `server/.env.example` to `server/.env` and set `MONGODB_URI` to your MongoDB connection string. Keep it server-side; never put it in frontend configuration or commit `server/.env`.
3. Start MongoDB as a replica set.
4. Run `npm run dev` to start the API and React app.

Open the React app at `http://localhost:3000`. The API listens at `http://127.0.0.1:4000` by default. Set `API_PORT` to change the port or `API_HOST=0.0.0.0` if the deployment platform requires an externally reachable interface.
Set `CORS_ORIGINS` to a comma-separated list of exact frontend origins when the frontend and API use different hosts. Local development allows ports 3000 and 3001; production defaults allow `https://1xbetsupport.com` and `https://www.1xbetsupport.com`. Production session cookies use `SameSite=None; Secure` so credentialed requests from the separate frontend host can send them. If setting `CORS_ORIGINS` on the API host, include `http://localhost:3001` while testing from that local frontend.

Create an account with any unused 9-digit User ID and a password of 12–128 characters. Once signed in, choose **Change password**. The current password is required. Changing a password revokes the user's existing sessions and starts a new session for the current browser.

On first startup, the server creates an administrator account and prints its User ID and password in the server terminal. Save those credentials. Sign in with them to open `/admin`; the dashboard lists user accounts and lets the administrator add to, deduct from, or set each balance. A deduction cannot exceed the current balance. Accounts can also be removed after confirmation. Balance changes appear for active users within about five seconds. To configure a known admin, set both `ADMIN_USER_ID` (exactly 9 digits) and `ADMIN_PASSWORD` (12–128 characters) in `server/.env`.

Passwords are stored as scrypt hashes. Session tokens are random, stored as hashes in MongoDB, and sent to the browser only in an HttpOnly cookie. Set `NODE_ENV=production` when deploying over HTTPS so the cookie is marked Secure.

## Migrate the existing SQLite data

Stop the old API before migration so the source is not being changed while it is copied. Keep `server/data.sqlite` and its `-wal`/`-shm` files intact. The migration script opens SQLite read-only and does not delete or overwrite it.

Set `MONGODB_URI` in `server/.env` (or the server environment), then run:

```powershell
npm run migrate:sqlite -- "server\data.sqlite"
```

The script migrates users (including password hashes and salts), sessions, and balance audit records. It inserts only missing records, verifies all copied fields, and fails if an existing MongoDB record conflicts. It is safe to rerun. Switch to the MongoDB-backed API only after the script reports successful verification, and retain a separate SQLite backup until the migrated data is checked.

## Deployment

The existing Netlify configuration publishes only the React frontend; it does not run this Express API. Deploy the API separately with a private server-side `MONGODB_URI`, a transaction-capable MongoDB replica set, HTTPS, `NODE_ENV=production`, `CORS_ORIGINS` set to the exact deployed frontend origin(s), and the `API_HOST`/`API_PORT` required by the host. Never expose the database URI or credentials in source code or frontend build-time configuration.

Real payments would also need a payment provider and verified payment callbacks; this project does not include those.
