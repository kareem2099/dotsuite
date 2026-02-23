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
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  getResetPasswordToken(): string;
  getVerificationToken(): string;
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
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (this: IUser) {
  if (!this.isModified("password") || !this.password) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
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