# Local account app

This repository includes a local Express API for account creation, sign-in, and password changes. The deposit interface is illustrative: this app does not send, receive, or verify payments. The balance is stored locally and can be adjusted from the admin dashboard; it is not linked to deposits.

## Run locally

Requirements: Node.js 22.12 or newer.

```bash
npm install
npm run dev
```

Open the React app at `http://localhost:3000`. The API runs at `http://127.0.0.1:4000` and saves accounts and sessions in `server/data.sqlite`.

Create an account with any unused 9-digit User ID and a password of at least 12 characters. Once signed in, choose **Change password**. The current password is required. Signing out or changing a password revokes the previous session.

On the first start, the server creates an administrator account and prints its User ID and password in the terminal. Save those credentials. Sign in with them to open `/admin`; the dashboard lists user accounts and lets the administrator add to, deduct from, or set each balance. A deduction cannot exceed the current balance. Accounts can also be removed after confirmation. Balance changes appear for active users within about five seconds. The administrator credential can be set or reset with `ADMIN_USER_ID` and `ADMIN_PASSWORD` in `server/.env`.

Passwords are stored as scrypt hashes. Session tokens are random, stored as hashes in SQLite, and sent to the browser only in an HttpOnly cookie. The server binds to `127.0.0.1`. Node prints an experimental SQLite warning on startup; this is expected with the built-in SQLite support in Node 22.

## Deployment note

The existing Netlify configuration publishes the React frontend; it does not run this Express/SQLite server. A hosted version needs a separately deployed backend and persistent database, plus HTTPS and production cookie settings. Real payments would also need a payment provider and verified payment callbacks; this project does not include those.
