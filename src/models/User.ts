import mongoose, { Schema, Document, CallbackError } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IUser extends Document {
  email: string;
  name: string;
  password?: string;
  image?: string;
  bio?: string;
  location?: string;
  website?: string;
  twitter?: string;
  github?: string;
  isEmailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpire?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  failedLoginAttempts: number;
  lockoutUntil?: Date;
  passwordHistory: string[];
  sessionVersion: number;
  referral_code?: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  isLockedOut(): boolean;
  getLockoutTimeRemaining(): number;
  resetLoginAttempts(): Promise<void>;
  isPasswordInHistory(candidatePassword: string): Promise<boolean>;
  getResetPasswordToken(): string;
  getVerificationToken(): string;
  incrementSessionVersion(): Promise<void>;
}

export interface IUserModel extends mongoose.Model<IUser> {
  generateVerificationToken(): { token: string; hashedToken: string; expires: Date };
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, select: false },
    image: { type: String },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
    twitter: { type: String, default: "" },
    github: { type: String, default: "" },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpire: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    lockoutUntil: { type: Date },
    passwordHistory: { type: [String], default: [], select: false },
    sessionVersion: { type: Number, default: 1 },
    referral_code: { type: String, unique: true },
  },
  { timestamps: true }
);

// Hash password before saving + password history
UserSchema.pre("save", async function (this: IUser) {
  // Generate referral code if it doesn't exist
  if (!this.referral_code) {
    this.referral_code = crypto.randomBytes(4).toString("hex");
  }

  if (!this.isModified("password") || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // 🛡️ Add new password to history (keep last 5 only)
  if (!this.passwordHistory) {
    this.passwordHistory = [];
  }
  this.passwordHistory.push(this.password);
  
  if (this.passwordHistory.length > 5) {
    this.passwordHistory.shift(); // Remove oldest password
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if account is locked out
UserSchema.methods.isLockedOut = function (this: IUser): boolean {
  return !!this.lockoutUntil && this.lockoutUntil > new Date();
};

// Get remaining lockout time in minutes
UserSchema.methods.getLockoutTimeRemaining = function (this: IUser): number {
  if (!this.lockoutUntil) return 0;
  const remaining = Math.ceil((this.lockoutUntil.getTime() - Date.now()) / (60 * 1000));
  return Math.max(0, remaining);
};

// Reset failed login attempts (called on successful login)
UserSchema.methods.resetLoginAttempts = async function (this: IUser): Promise<void> {
  this.failedLoginAttempts = 0;
  this.lockoutUntil = undefined;
  await this.save();
};

// Increment session version to invalidate all existing JWT sessions
// Called after password change or reset to force re-login on all devices
UserSchema.methods.incrementSessionVersion = async function (this: IUser): Promise<void> {
  this.sessionVersion = (this.sessionVersion || 1) + 1;
  await this.save();
};

// Check if password was used before
UserSchema.methods.isPasswordInHistory = async function (
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  if (!this.passwordHistory || this.passwordHistory.length === 0) return false;
  
  // Check against all hashed passwords in history
  const checks = await Promise.all(
    this.passwordHistory.map((hashedPassword) =>
      bcrypt.compare(candidatePassword, hashedPassword)
    )
  );
  
  return checks.some((match) => match);
};

// Generate and hash reset password token
UserSchema.methods.getResetPasswordToken = function (
  this: IUser
): string {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire time (10 minutes)
  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

// Static method to generate verification token (call without creating instance)
UserSchema.statics.generateVerificationToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return { token, hashedToken, expires };
};

// Instance method to generate verification token (call on user instance)
UserSchema.methods.getVerificationToken = function (this: IUser): string {
  const verificationToken = crypto.randomBytes(32).toString("hex");

  this.verificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  this.verificationTokenExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return verificationToken;
};

export default mongoose.models.User as IUserModel ||
  mongoose.model<IUser, IUserModel>("User", UserSchema);