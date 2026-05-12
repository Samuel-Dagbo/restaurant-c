import mongoose, { Schema, Document } from "mongoose";

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  category: mongoose.Types.ObjectId;
  tags: string[];
  featured: boolean;
  isAvailable: boolean;
  spicyLevel?: number;
  preparationTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    image: { type: String, default: "" },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    spicyLevel: { type: Number, min: 0, max: 5 },
    preparationTime: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.models.MenuItem || mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);
