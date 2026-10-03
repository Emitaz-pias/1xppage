const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { promisify } = require('node:util');
const cookieParser = require('cookie-parser');
const express = require('express');
const helmet = require('helmet');
const { rateLimit } = require('express-rate-limit');
const { DatabaseSync } = require('node:sqlite');

function loadServerEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].replace(/^(["'])(.*)\1$/, '$2');
    }
  }
}

loadServerEnv();

const scrypt = promisify(crypto.scrypt);
const app = express();
const port = Number(process.env.API_PORT || 4000);
const host = '127.0.0.1';
const sessionCookieName = 'practice_session';
const sessionLifetimeMs = 7 * 24 * 60 * 60 * 1000;
const databasePath = process.env.DB_PATH || path.join(__dirname, 'data.sqlite');

fs.mkdirSync(path.dirname(databasePath), { recursive: true });
const db = new DatabaseSync(databasePath);
db.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    user_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    balance_cents INTEGER NOT NULL DEFAULT 0,
    role TEXT NOT NULL DEFAULT 'user',
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
  CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions(expires_at);

  CREATE TABLE IF NOT EXISTS balance_audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    admin_user_id TEXT NOT NULL REFERENCES users(user_id),
    target_user_id TEXT NOT NULL REFERENCES users(user_id),
    action TEXT NOT NULL DEFAULT 'set',
    previous_balance_cents INTEGER NOT NULL,
    new_balance_cents INTEGER NOT NULL,
    created_at INTEGER NOT NULL
  );
`);

const userColumns = db.prepare('PRAGMA table_info(users)').all();
if (!userColumns.some((column) => column.name === 'balance_cents')) {
  db.exec('ALTER TABLE users ADD COLUMN balance_cents INTEGER NOT NULL DEFAULT 0');
}
if (!userColumns.some((column) => column.name === 'role')) {
  db.exec("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'user'");
}
const auditColumns = db.prepare('PRAGMA table_info(balance_audit)').all();
if (!auditColumns.some((column) => column.name === 'action')) {
  db.exec("ALTER TABLE balance_audit ADD COLUMN action TEXT NOT NULL DEFAULT 'set'");
}

app.disable('x-powered-by');
app.use(helmet());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please wait 15 minutes and try again.' },
});

const cookieOptions = () => ({
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production',
  path: '/api',
  maxAge: sessionLifetimeMs,
});

const hashPassword = async (password, salt = crypto.randomBytes(16).toString('hex')) => {
  const derivedKey = await scrypt(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return { salt, hash: derivedKey.toString('hex') };
};

async function initializeAdminAccount() {
  const existingAdmin = db.prepare("SELECT user_id FROM users WHERE role = 'admin' LIMIT 1").get();
  const configuredUserId = process.env.ADMIN_USER_ID;
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if ((configuredUserId && !configuredPassword) || (!configuredUserId && configuredPassword)) {
    throw new Error('Set both ADMIN_USER_ID and ADMIN_PASSWORD in server/.env, or leave both unset.');
  }

  let userId = configuredUserId;
  let password = configuredPassword;
  if (userId && !/^\d{9}$/.test(userId)) {
    throw new Error('ADMIN_USER_ID must contain exactly 9 digits.');
  }
  if (password && (password.length < 12 || password.length > 128)) {
    throw new Error('ADMIN_PASSWORD must be 12–128 characters long.');
  }

  if (configuredUserId) {
    if (existingAdmin && existingAdmin.user_id !== configuredUserId) {
      throw new Error(`An admin already exists (${existingAdmin.user_id}); set ADMIN_USER_ID to that ID to reset its password.`);
    }
    const credentials = await hashPassword(configuredPassword);
    const configuredUser = db.prepare('SELECT user_id FROM users WHERE user_id = ?').get(configuredUserId);
    if (configuredUser) {
      db.prepare("UPDATE users SET name = ?, password_salt = ?, password_hash = ?, role = 'admin' WHERE user_id = ?")
        .run('Administrator', credentials.salt, credentials.hash, configuredUserId);
      db.prepare('DELETE FROM sessions WHERE user_id = ?').run(configuredUserId);
    } else {
      db.prepare(`
        INSERT INTO users (user_id, name, password_salt, password_hash, role, created_at)
        VALUES (?, ?, ?, ?, 'admin', ?)
      `).run(configuredUserId, 'Administrator', credentials.salt, credentials.hash, Date.now());
    }
    console.log(`Admin account ready: ${configuredUserId}`);
    return;
  }

  if (existingAdmin) return;

  if (!userId) {
    do {
      userId = String(crypto.randomInt(100000000, 1000000000));
    } while (db.prepare('SELECT 1 FROM users WHERE user_id = ?').get(userId));
    password = crypto.randomBytes(24).toString('base64url');
  }

  const credentials = await hashPassword(password);
  const existingUser = db.prepare('SELECT user_id FROM users WHERE user_id = ?').get(userId);
  if (existingUser) {
    db.prepare("UPDATE users SET name = ?, password_salt = ?, password_hash = ?, role = 'admin' WHERE user_id = ?")
      .run('Administrator', credentials.salt, credentials.hash, userId);
  } else {
    db.prepare(`
      INSERT INTO users (user_id, name, password_salt, password_hash, role, created_at)
      VALUES (?, ?, ?, ?, 'admin', ?)
    `).run(userId, 'Administrator', credentials.salt, credentials.hash, Date.now());
  }

  console.log('Initial ADMIN account (save these credentials):');
  console.log(`Admin User ID: ${userId}`);
  console.log(`Admin password: ${password}`);
}

const passwordsMatch = async (password, salt, expectedHash) => {
  const actual = await hashPassword(password, salt);
  const actualBuffer = Buffer.from(actual.hash, 'hex');
  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
};

const publicUser = (user) => ({
  userId: user.user_id,
  name: user.name,
  balanceCents: user.balance_cents || 0,
  role: user.role || 'user',
});

const startSession = (userId, res) => {
  const token = crypto.randomBytes(32).toString('base64url');
  const now = Date.now();
  db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
    .run(crypto.createHash('sha256').update(token).digest('hex'), userId, now + sessionLifetimeMs, now);
  res.cookie(sessionCookieName, token, cookieOptions());
};

const getSessionUser = (token) => {
  if (!token) return null;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const row = db.prepare(`
    SELECT users.user_id, users.name, users.balance_cents, users.role
    FROM sessions JOIN users ON users.user_id = sessions.user_id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ?
  `).get(tokenHash, Date.now());
  return row || null;
};

app.use('/api', (req, _res, next) => {
  req.authUser = getSessionUser(req.cookies[sessionCookieName]);
  next();
});

const requireAuth = (req, res, next) => {
  if (!req.authUser) return res.status(401).json({ error: 'Please sign in again.' });
  next();
};

const requireAdmin = (req, res, next) => {
  if (!req.authUser) return res.status(401).json({ error: 'Please sign in again.' });
  if (req.authUser.role !== 'admin') return res.status(403).json({ error: 'Admin access is required.' });
  next();
};

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/api/auth/me', (req, res) => {
  res.json({ user: req.authUser ? publicUser(req.authUser) : null });
});

app.post('/api/auth/register', authLimiter, async (req, res, next) => {
  try {
    const userId = String(req.body?.userId || '').trim();
    const name = String(req.body?.name || userId).trim().slice(0, 60);
    const password = req.body?.password;

    if (!/^\d{9}$/.test(userId)) {
      return res.status(400).json({ error: 'User ID must contain exactly 9 digits.' });
    }
    if (typeof password !== 'string' || password.length < 12 || password.length > 128) {
      return res.status(400).json({ error: 'Password must be 12–128 characters long.' });
    }

    const credentials = await hashPassword(password);
    try {
      db.prepare(`
        INSERT INTO users (user_id, name, password_salt, password_hash, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(userId, name || userId, credentials.salt, credentials.hash, Date.now());
    } catch (error) {
      if (/constraint failed: users\.user_id/i.test(error.message)) {
        return res.status(409).json({ error: 'That User ID is already registered.' });
      }
      throw error;
    }

    const user = db.prepare('SELECT user_id, name, balance_cents, role FROM users WHERE user_id = ?').get(userId);
    startSession(userId, res);
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/auth/login', authLimiter, async (req, res, next) => {
  try {
    const userId = String(req.body?.userId || '').trim();
    const password = req.body?.password;
    const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId);

    if (!user || typeof password !== 'string' || !(await passwordsMatch(password, user.password_salt, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid User ID or password.' });
    }

    startSession(user.user_id, res);
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/auth/logout', (req, res) => {
  const token = req.cookies[sessionCookieName];
  if (token) {
    db.prepare('DELETE FROM sessions WHERE token_hash = ?')
      .run(crypto.createHash('sha256').update(token).digest('hex'));
  }
  res.clearCookie(sessionCookieName, { ...cookieOptions(), maxAge: undefined });
  res.json({ ok: true });
});

app.post('/api/auth/change-password', requireAuth, async (req, res, next) => {
  try {
    const currentPassword = req.body?.currentPassword;
    const newPassword = req.body?.newPassword;
    const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(req.authUser.user_id);

    if (typeof currentPassword !== 'string' || !(await passwordsMatch(currentPassword, user.password_salt, user.password_hash))) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }
    if (typeof newPassword !== 'string' || newPassword.length < 12 || newPassword.length > 128) {
      return res.status(400).json({ error: 'New password must be 12–128 characters long.' });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ error: 'Choose a new password different from your current one.' });
    }

    const credentials = await hashPassword(newPassword);
    const updatePassword = db.prepare('UPDATE users SET password_salt = ?, password_hash = ? WHERE user_id = ?');
    const revokeSessions = db.prepare('DELETE FROM sessions WHERE user_id = ?');
    db.exec('BEGIN IMMEDIATE');
    try {
      updatePassword.run(credentials.salt, credentials.hash, user.user_id);
      revokeSessions.run(user.user_id);
      db.exec('COMMIT');
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }

    startSession(user.user_id, res);
    return res.json({ user: publicUser(user), message: 'Password changed successfully.' });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/admin/users', requireAdmin, (_req, res) => {
  const users = db.prepare(`
    SELECT user_id AS userId, name, balance_cents AS balanceCents, created_at AS createdAt
    FROM users WHERE role = 'user' ORDER BY created_at DESC
  `).all();
  res.json({ users });
});

app.patch('/api/admin/users/:userId/balance', requireAdmin, (req, res) => {
  const { userId } = req.params;
  const { balanceCents } = req.body || {};
  if (!/^\d{9}$/.test(userId) || !Number.isSafeInteger(balanceCents) || balanceCents < 0 || balanceCents > 100000000000) {
    return res.status(400).json({ error: 'Enter a valid non-negative balance amount.' });
  }

  const target = db.prepare("SELECT user_id, name, balance_cents, role FROM users WHERE user_id = ? AND role = 'user'").get(userId);
  if (!target) return res.status(404).json({ error: 'User not found.' });

  db.exec('BEGIN IMMEDIATE');
  try {
    db.prepare('UPDATE users SET balance_cents = ? WHERE user_id = ?').run(balanceCents, userId);
    db.prepare(`
      INSERT INTO balance_audit (admin_user_id, target_user_id, action, previous_balance_cents, new_balance_cents, created_at)
      VALUES (?, ?, 'set', ?, ?, ?)
    `).run(req.authUser.user_id, userId, target.balance_cents, balanceCents, Date.now());
    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }

  return res.json({
    user: publicUser({ ...target, balance_cents: balanceCents }),
  });
});

app.post('/api/admin/users/:userId/balance', requireAdmin, (req, res) => {
  const { userId } = req.params;
  const { amountCents, action } = req.body || {};
  if (!/^\d{9}$/.test(userId) || !['add', 'deduct'].includes(action)
      || !Number.isSafeInteger(amountCents) || amountCents <= 0 || amountCents > 100000000000) {
    return res.status(400).json({ error: 'Enter a valid positive amount and choose Add or Deduct.' });
  }

  db.exec('BEGIN IMMEDIATE');
  try {
    const target = db.prepare("SELECT user_id, name, balance_cents, role FROM users WHERE user_id = ? AND role = 'user'").get(userId);
    if (!target) {
      db.exec('ROLLBACK');
      return res.status(404).json({ error: 'User not found.' });
    }

    const nextBalance = action === 'add'
      ? target.balance_cents + amountCents
      : target.balance_cents - amountCents;
    if (action === 'deduct' && amountCents > target.balance_cents) {
      db.exec('ROLLBACK');
      return res.status(400).json({ error: 'Deduction amount cannot exceed the current balance.' });
    }
    if (!Number.isSafeInteger(nextBalance) || nextBalance > 100000000000) {
      db.exec('ROLLBACK');
      return res.status(400).json({ error: 'The resulting balance is too large.' });
    }

    db.prepare('UPDATE users SET balance_cents = ? WHERE user_id = ?').run(nextBalance, userId);
    db.prepare(`
      INSERT INTO balance_audit (admin_user_id, target_user_id, action, previous_balance_cents, new_balance_cents, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(req.authUser.user_id, userId, action, target.balance_cents, nextBalance, Date.now());
    db.exec('COMMIT');

    return res.json({ user: publicUser({ ...target, balance_cents: nextBalance }) });
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
});

app.delete('/api/admin/users/:userId', requireAdmin, (req, res) => {
  const { userId } = req.params;
  if (!/^\d{9}$/.test(userId)) return res.status(400).json({ error: 'Enter a valid User ID.' });

  db.exec('BEGIN IMMEDIATE');
  try {
    const target = db.prepare("SELECT user_id FROM users WHERE user_id = ? AND role = 'user'").get(userId);
    if (!target) {
      db.exec('ROLLBACK');
      return res.status(404).json({ error: 'User not found.' });
    }

    db.prepare('DELETE FROM balance_audit WHERE target_user_id = ?').run(userId);
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(userId);
    db.prepare('DELETE FROM users WHERE user_id = ? AND role = \'user\'').run(userId);
    db.exec('COMMIT');
    return res.json({ ok: true, userId });
  } catch (error) {
    db.exec('ROLLBACK');
    throw error;
  }
});

app.use((error, _req, res, _next) => {
  console.error('API error:', error.message);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

initializeAdminAccount()
  .then(() => {
    app.listen(port, host, () => {
      console.log(`API listening on http://${host}:${port}`);
      console.log(`SQLite database: ${databasePath}`);
    });
  })
  .catch((error) => {
    console.error('Could not initialize admin account:', error.message);
    process.exitCode = 1;
  });
