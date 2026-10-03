const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { promisify } = require('node:util');
const cookieParser = require('cookie-parser');
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { rateLimit } = require('express-rate-limit');
const { User, Session, BalanceAudit } = require('./models');

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
const host = process.env.API_HOST || '127.0.0.1';
const sessionCookieName = 'practice_session';
const sessionLifetimeMs = 7 * 24 * 60 * 60 * 1000;

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

const passwordsMatch = async (password, salt, expectedHash) => {
  const actual = await hashPassword(password, salt);
  const actualBuffer = Buffer.from(actual.hash, 'hex');
  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  return actualBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(actualBuffer, expectedBuffer);
};

const publicUser = (user) => ({
  userId: user.userId || user._id,
  name: user.name,
  balanceCents: user.balanceCents || 0,
  role: user.role || 'user',
});

async function withTransaction(operation) {
  const session = await mongoose.startSession();
  try {
    let result;
    await session.withTransaction(async () => {
      result = await operation(session);
    });
    return result;
  } finally {
    await session.endSession();
  }
}

async function initializeAdminAccount() {
  const existingAdmin = await User.findOne({ role: 'admin' }).select('_id').lean();
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
    if (existingAdmin && existingAdmin._id !== configuredUserId) {
      throw new Error(`An admin already exists (${existingAdmin._id}); set ADMIN_USER_ID to that ID to reset its password.`);
    }
    const credentials = await hashPassword(configuredPassword);
    await withTransaction(async (session) => {
      await User.updateOne(
        { _id: configuredUserId },
        {
          $set: {
            name: 'Administrator',
            passwordSalt: credentials.salt,
            passwordHash: credentials.hash,
            role: 'admin',
          },
          $setOnInsert: { balanceCents: 0, createdAt: Date.now() },
        },
        { upsert: true, session },
      );
      await Session.deleteMany({ userId: configuredUserId }, { session });
    });
    console.log(`Admin account ready: ${configuredUserId}`);
    return;
  }

  if (existingAdmin) return;

  if (!userId) {
    do {
      userId = String(crypto.randomInt(100000000, 1000000000));
    } while (await User.exists({ _id: userId }));
    password = crypto.randomBytes(24).toString('base64url');
  }

  const credentials = await hashPassword(password);
  await withTransaction(async (session) => {
    const existingUser = await User.findById(userId).session(session).select('_id').lean();
    if (existingUser) {
      await User.updateOne(
        { _id: userId },
        {
          $set: {
            name: 'Administrator',
            passwordSalt: credentials.salt,
            passwordHash: credentials.hash,
            role: 'admin',
          },
        },
        { session },
      );
    } else {
      await User.create([{
        _id: userId,
        name: 'Administrator',
        passwordSalt: credentials.salt,
        passwordHash: credentials.hash,
        balanceCents: 0,
        role: 'admin',
        createdAt: Date.now(),
      }], { session });
    }
  });

  console.log('Initial ADMIN account (save these credentials):');
  console.log(`Admin User ID: ${userId}`);
  console.log(`Admin password: ${password}`);
}

async function startSession(userId, res) {
  const token = crypto.randomBytes(32).toString('base64url');
  const now = Date.now();
  await Session.create({
    tokenHash: crypto.createHash('sha256').update(token).digest('hex'),
    userId,
    expiresAt: new Date(now + sessionLifetimeMs),
    createdAt: now,
  });
  res.cookie(sessionCookieName, token, cookieOptions());
}

async function getSessionUser(token) {
  if (!token) return null;
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const session = await Session.findOne({
    tokenHash,
    expiresAt: { $gt: new Date() },
  }).select('userId').lean();
  if (!session) return null;
  return User.findById(session.userId)
    .select('_id name balanceCents role')
    .lean();
}

app.use('/api', async (req, _res, next) => {
  try {
    req.authUser = await getSessionUser(req.cookies[sessionCookieName]);
    next();
  } catch (error) {
    next(error);
  }
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
    let user;
    try {
      [user] = await User.create([{
        _id: userId,
        name: name || userId,
        passwordSalt: credentials.salt,
        passwordHash: credentials.hash,
        balanceCents: 0,
        role: 'user',
        createdAt: Date.now(),
      }]);
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({ error: 'That User ID is already registered.' });
      }
      throw error;
    }

    await startSession(userId, res);
    return res.status(201).json({ user: publicUser(user.toObject()) });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/auth/login', authLimiter, async (req, res, next) => {
  try {
    const userId = String(req.body?.userId || '').trim();
    const password = req.body?.password;
    const user = await User.findById(userId).lean();

    if (!user || typeof password !== 'string'
        || !(await passwordsMatch(password, user.passwordSalt, user.passwordHash))) {
      return res.status(401).json({ error: 'Invalid User ID or password.' });
    }

    await startSession(user._id, res);
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/auth/logout', async (req, res, next) => {
  try {
    const token = req.cookies[sessionCookieName];
    if (token) {
      await Session.deleteOne({
        tokenHash: crypto.createHash('sha256').update(token).digest('hex'),
      });
    }
    res.clearCookie(sessionCookieName, { ...cookieOptions(), maxAge: undefined });
    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/auth/change-password', requireAuth, async (req, res, next) => {
  try {
    const currentPassword = req.body?.currentPassword;
    const newPassword = req.body?.newPassword;
    const user = await User.findById(req.authUser._id).lean();

    if (!user || typeof currentPassword !== 'string'
        || !(await passwordsMatch(currentPassword, user.passwordSalt, user.passwordHash))) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }
    if (typeof newPassword !== 'string' || newPassword.length < 12 || newPassword.length > 128) {
      return res.status(400).json({ error: 'New password must be 12–128 characters long.' });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ error: 'Choose a new password different from your current one.' });
    }

    const credentials = await hashPassword(newPassword);
    await withTransaction(async (session) => {
      await User.updateOne(
        { _id: user._id },
        { $set: { passwordSalt: credentials.salt, passwordHash: credentials.hash } },
        { session },
      );
      await Session.deleteMany({ userId: user._id }, { session });
    });

    await startSession(user._id, res);
    return res.json({ user: publicUser(user), message: 'Password changed successfully.' });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/admin/users', requireAdmin, async (_req, res, next) => {
  try {
    const records = await User.find({ role: 'user' })
      .select('_id name balanceCents createdAt')
      .sort({ createdAt: -1 })
      .lean();
    const users = records.map(({ _id, ...user }) => ({ userId: _id, ...user }));
    return res.json({ users });
  } catch (error) {
    return next(error);
  }
});

app.patch('/api/admin/users/:userId/balance', requireAdmin, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { balanceCents } = req.body || {};
    if (!/^\d{9}$/.test(userId) || !Number.isSafeInteger(balanceCents)
        || balanceCents < 0 || balanceCents > 100000000000) {
      return res.status(400).json({ error: 'Enter a valid non-negative balance amount.' });
    }

    const updatedUser = await withTransaction(async (session) => {
      const target = await User.findOne({ _id: userId, role: 'user' }).session(session).lean();
      if (!target) return null;

      await User.updateOne({ _id: userId, role: 'user' }, { $set: { balanceCents } }, { session });
      await BalanceAudit.create([{
        _id: crypto.randomUUID(),
        adminUserId: req.authUser._id,
        targetUserId: userId,
        action: 'set',
        previousBalanceCents: target.balanceCents,
        newBalanceCents: balanceCents,
        createdAt: Date.now(),
      }], { session });
      return { ...target, balanceCents };
    });
    if (!updatedUser) return res.status(404).json({ error: 'User not found.' });

    return res.json({ user: publicUser(updatedUser) });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/admin/users/:userId/balance', requireAdmin, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { amountCents, action } = req.body || {};
    if (!/^\d{9}$/.test(userId) || !['add', 'deduct'].includes(action)
        || !Number.isSafeInteger(amountCents) || amountCents <= 0 || amountCents > 100000000000) {
      return res.status(400).json({ error: 'Enter a valid positive amount and choose Add or Deduct.' });
    }

    let failure;
    const updatedUser = await withTransaction(async (session) => {
      failure = null;
      const target = await User.findOne({ _id: userId, role: 'user' }).session(session).lean();
      if (!target) {
        failure = 'not-found';
        return null;
      }

      const nextBalance = action === 'add'
        ? target.balanceCents + amountCents
        : target.balanceCents - amountCents;
      if (action === 'deduct' && amountCents > target.balanceCents) {
        failure = 'deduction';
        return null;
      }
      if (!Number.isSafeInteger(nextBalance) || nextBalance > 100000000000) {
        failure = 'too-large';
        return null;
      }

      await User.updateOne({ _id: userId, role: 'user' }, { $set: { balanceCents: nextBalance } }, { session });
      await BalanceAudit.create([{
        _id: crypto.randomUUID(),
        adminUserId: req.authUser._id,
        targetUserId: userId,
        action,
        previousBalanceCents: target.balanceCents,
        newBalanceCents: nextBalance,
        createdAt: Date.now(),
      }], { session });
      return { ...target, balanceCents: nextBalance };
    });

    if (failure === 'not-found') return res.status(404).json({ error: 'User not found.' });
    if (failure === 'deduction') {
      return res.status(400).json({ error: 'Deduction amount cannot exceed the current balance.' });
    }
    if (failure === 'too-large') {
      return res.status(400).json({ error: 'The resulting balance is too large.' });
    }
    return res.json({ user: publicUser(updatedUser) });
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/admin/users/:userId', requireAdmin, async (req, res, next) => {
  try {
    const { userId } = req.params;
    if (!/^\d{9}$/.test(userId)) return res.status(400).json({ error: 'Enter a valid User ID.' });

    const deleted = await withTransaction(async (session) => {
      const target = await User.findOne({ _id: userId, role: 'user' }).session(session).select('_id').lean();
      if (!target) return false;

      await BalanceAudit.deleteMany({ targetUserId: userId }, { session });
      await Session.deleteMany({ userId }, { session });
      await User.deleteOne({ _id: userId, role: 'user' }, { session });
      return true;
    });
    if (!deleted) return res.status(404).json({ error: 'User not found.' });

    return res.json({ ok: true, userId });
  } catch (error) {
    return next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error('API error:', error.message);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required. Set it in the server environment or .env file.');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  await Promise.all([
    User.createIndexes(),
    Session.createIndexes(),
    BalanceAudit.createIndexes(),
  ]);
  await initializeAdminAccount();
  app.listen(port, host, () => {
    console.log(`API listening on http://${host}:${port}`);
    console.log('MongoDB connected.');
  });
}

startServer().catch(async (error) => {
  console.error('Could not start API:', error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
});
