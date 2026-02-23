import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  slug: string;
  category: "vscode" | "python" | "nextjs";
  githubRepo: string;
  hasLicense: boolean;
  price: number;
  order: number;
  translations: {
    en: { title: string; description: string };
    ar: { title: string; description: string };
    fr: { title: string; description: string };
    ru: { title: string; description: string };
    de: { title: string; description: string };
  };
}

const ProductSchema = new Schema<IProduct>({
  slug: { type: String, required: true, unique: true },
  category: { type: String, enum: ["vscode", "python", "nextjs"], required: true },
  githubRepo: { type: String, required: true },
  hasLicense: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  translations: {
    en: { title: String, description: String },
    ar: { title: String, description: String },
    fr: { title: String, description: String },
    ru: { title: String, description: String },
    de: { title: String, description: String },
  },
});

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);