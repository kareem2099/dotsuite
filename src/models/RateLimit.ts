import { RecordBase } from "@/lib/records";
export default class RateLimit extends RecordBase {
  static collection = "ratelimits";
  static timestamps = false;
  static updatedTimestamp = false;
  declare identifier: string;
  declare action: string;
  declare count: number;
  declare expiresAt: Date;
}
