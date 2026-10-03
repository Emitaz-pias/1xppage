const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  passwordSalt: { type: String, required: true },
  passwordHash: { type: String, required: true },
  balanceCents: { type: Number, required: true, default: 0 },
  role: { type: String, enum: ['user', 'admin'], required: true, default: 'user' },
  createdAt: { type: Number, required: true },
}, {
  collection: 'users',
  versionKey: false,
});
userSchema.index({ role: 1, createdAt: -1 });

const sessionSchema = new mongoose.Schema({
  tokenHash: { type: String, required: true, unique: true },
  userId: { type: String, ref: 'User', required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Number, required: true },
}, {
  collection: 'sessions',
  versionKey: false,
});
sessionSchema.index({ userId: 1 });
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const balanceAuditSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  adminUserId: { type: String, ref: 'User', required: true },
  targetUserId: { type: String, ref: 'User', required: true },
  action: { type: String, enum: ['set', 'add', 'deduct'], required: true, default: 'set' },
  previousBalanceCents: { type: Number, required: true },
  newBalanceCents: { type: Number, required: true },
  createdAt: { type: Number, required: true },
}, {
  collection: 'balance_audit',
  versionKey: false,
});
balanceAuditSchema.index({ targetUserId: 1, createdAt: -1 });
balanceAuditSchema.index({ adminUserId: 1, createdAt: -1 });

module.exports = {
  User: mongoose.model('User', userSchema),
  Session: mongoose.model('Session', sessionSchema),
  BalanceAudit: mongoose.model('BalanceAudit', balanceAuditSchema),
};
