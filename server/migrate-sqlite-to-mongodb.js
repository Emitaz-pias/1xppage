const fs = require('node:fs');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');
const mongoose = require('mongoose');
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

function readLegacyData(database) {
  const users = database.prepare(`
    SELECT user_id, name, password_salt, password_hash, balance_cents, role, created_at
    FROM users
  `).all().map((row) => ({
    _id: row.user_id,
    name: row.name,
    passwordSalt: row.password_salt,
    passwordHash: row.password_hash,
    balanceCents: row.balance_cents,
    role: row.role,
    createdAt: row.created_at,
  }));

  const sessions = database.prepare(`
    SELECT token_hash, user_id, expires_at, created_at
    FROM sessions
  `).all().map((row) => ({
    tokenHash: row.token_hash,
    userId: row.user_id,
    expiresAt: new Date(row.expires_at),
    createdAt: row.created_at,
  }));

  const auditColumns = database.prepare('PRAGMA table_info(balance_audit)').all();
  const hasAction = auditColumns.some((column) => column.name === 'action');
  const actionSelect = hasAction ? 'action' : "'set' AS action";
  const audits = database.prepare(`
    SELECT id, admin_user_id, target_user_id, ${actionSelect},
      previous_balance_cents, new_balance_cents, created_at
    FROM balance_audit
  `).all().map((row) => ({
    _id: `sqlite:${row.id}`,
    adminUserId: row.admin_user_id,
    targetUserId: row.target_user_id,
    action: row.action,
    previousBalanceCents: row.previous_balance_cents,
    newBalanceCents: row.new_balance_cents,
    createdAt: row.created_at,
  }));

  return { users, sessions, audits };
}

async function upsertDocuments(model, documents, key, label) {
  if (documents.length === 0) {
    console.log(`${label}: no records to migrate.`);
    return;
  }

  const operations = documents.map((document) => ({
    updateOne: {
      filter: { [key]: document[key] },
      update: { $setOnInsert: document },
      upsert: true,
    },
  }));
  const result = await model.bulkWrite(operations, { ordered: true });
  console.log(`${label}: ${result.upsertedCount} inserted; ${documents.length} source records processed.`);
}

async function verifyDocuments(model, documents, key, fields, label) {
  if (documents.length === 0) return;
  const ids = documents.map((document) => document[key]);
  const migrated = await model.find({ [key]: { $in: ids } }).lean();
  const byId = new Map(migrated.map((document) => [document[key], document]));

  for (const source of documents) {
    const target = byId.get(source[key]);
    if (!target || fields.some((field) => {
      const sourceValue = source[field] instanceof Date ? source[field].getTime() : source[field];
      const targetValue = target[field] instanceof Date
        ? target[field].getTime()
        : (target[field] instanceof mongoose.Types.ObjectId ? target[field].toString() : target[field]);
      return sourceValue !== targetValue;
    })) {
      throw new Error(`Migration verification failed for ${label} record ${source[key]}.`);
    }
  }
  console.log(`${label}: verified ${documents.length} records.`);
}

async function migrate() {
  loadServerEnv();
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required. Set it in the server environment or .env file.');
  }
  const sqlitePath = process.argv[2];
  if (!sqlitePath) {
    throw new Error('Pass the existing SQLite database path as the first argument.');
  }
  const resolvedPath = path.resolve(sqlitePath);
  if (!fs.existsSync(resolvedPath)) {
    throw new Error(`SQLite database not found: ${resolvedPath}`);
  }

  const database = new DatabaseSync(resolvedPath, { readOnly: true });
  let source;
  try {
    source = readLegacyData(database);
  } finally {
    database.close();
  }

  await mongoose.connect(process.env.MONGODB_URI);
  try {
    await Promise.all([
      User.createIndexes(),
      Session.createIndexes(),
      BalanceAudit.createIndexes(),
    ]);

    await upsertDocuments(User, source.users, '_id', 'Users');
    await upsertDocuments(Session, source.sessions, 'tokenHash', 'Sessions');
    await upsertDocuments(BalanceAudit, source.audits, '_id', 'Balance audit');

    await verifyDocuments(
      User,
      source.users,
      '_id',
      ['name', 'passwordSalt', 'passwordHash', 'balanceCents', 'role', 'createdAt'],
      'Users',
    );
    await verifyDocuments(
      Session,
      source.sessions,
      'tokenHash',
      ['userId', 'expiresAt', 'createdAt'],
      'Sessions',
    );
    await verifyDocuments(
      BalanceAudit,
      source.audits,
      '_id',
      ['adminUserId', 'targetUserId', 'action', 'previousBalanceCents', 'newBalanceCents', 'createdAt'],
      'Balance audit',
    );
    console.log('Migration completed and verified. The SQLite source was opened read-only and left unchanged.');
  } finally {
    await mongoose.disconnect();
  }
}

migrate().catch(async (error) => {
  console.error('SQLite to MongoDB migration failed:', error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
});
