import { RecordBase } from "@/lib/records";
export default class Contact extends RecordBase {
  static collection = "contacts";
  declare name: string;
  declare email: string;
  declare subject: string;
  declare message: string;
  protected async beforeSave() {
    for (const field of ["name", "email", "subject", "message"] as const) {
      this[field] = this[field]?.trim(); if (!this[field]) throw new Error("Contact fields are required");
    }
    this.email = this.email.toLowerCase();
  }
}
