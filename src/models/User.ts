import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { RecordBase } from "@/lib/records";
import { getPool, encode, type Data } from "@/lib/postgres";

export default class User extends RecordBase {
  static collection = "users";
  static hidden = ["password", "passwordHistory"];
  declare email: string;
  declare name: string;
  declare password?: string;
  declare image?: string;
  declare bio: string;
  declare location: string;
  declare website: string;
  declare twitter: string;
  declare github: string;
  declare isEmailVerified: boolean;
  declare verificationToken?: string;
  declare verificationTokenExpire?: Date;
  declare resetPasswordToken?: string;
  declare resetPasswordExpire?: Date;
  declare failedLoginAttempts: number;
  declare lockoutUntil?: Date;
  declare passwordHistory?: string[];
  declare sessionVersion: number;
  declare referral_code?: string;
  constructor(data: Data, stored = false) {
    super(stored ? data : { bio: "", location: "", website: "", twitter: "", github: "", isEmailVerified: false,
      failedLoginAttempts: 0, passwordHistory: [], sessionVersion: 1, ...data }, stored);
  }
  protected async beforeSave() {
    if ((this.isNew || Object.hasOwn(this, "referral_code")) && !this.referral_code) this.referral_code = crypto.randomBytes(4).toString("hex");
    if (this.isNew && (!this.email || !this.name)) throw new Error("Name and email are required");
    if (!this.isModified("password") || !this.password) return;
    const previous = this.passwordHistory ?? ((await getPool().query("SELECT data->'passwordHistory' AS history FROM ds_documents WHERE collection='users' AND id=$1", [this._id])).rows[0]?.history as string[] | undefined) ?? [];
    this.password = await bcrypt.hash(this.password, 10);
    this.passwordHistory = [...previous, this.password].slice(-5);
  }
  async comparePassword(candidate: string) { return this.password ? bcrypt.compare(candidate, this.password) : false; }
  isLockedOut() { return !!this.lockoutUntil && this.lockoutUntil > new Date(); }
  getLockoutTimeRemaining() { return this.lockoutUntil ? Math.max(0, Math.ceil((this.lockoutUntil.getTime() - Date.now()) / 60_000)) : 0; }
  async resetLoginAttempts() { this.failedLoginAttempts = 0; this.lockoutUntil = undefined; await this.save(); }
  async incrementSessionVersion() {
    const r = await getPool().query("SELECT after_data->'sessionVersion' AS version FROM ds_write('users',$1::jsonb,$2::jsonb,false,false,$3)", [JSON.stringify(encode({ _id: this._id })), JSON.stringify({ $inc: { sessionVersion: 1 } }), this._id]);
    if (!r.rows[0]) throw new Error("Account no longer exists");
    this.sessionVersion = r.rows[0].version;
  }
  async isPasswordInHistory(candidate: string) { return (await Promise.all((this.passwordHistory ?? []).map(h => bcrypt.compare(candidate, h)))).some(Boolean); }
  getResetPasswordToken() {
    const token = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    this.resetPasswordExpire = new Date(Date.now() + 10 * 60_000); return token;
  }
  static generateVerificationToken() {
    const token = crypto.randomBytes(32).toString("hex");
    return { token, hashedToken: crypto.createHash("sha256").update(token).digest("hex"), expires: new Date(Date.now() + 24 * 3600_000) };
  }
  getVerificationToken() {
    const token = User.generateVerificationToken(); this.verificationToken = token.hashedToken; this.verificationTokenExpire = token.expires; return token.token;
  }
}
export type IUser = User;
