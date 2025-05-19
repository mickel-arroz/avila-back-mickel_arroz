import { Schema, model, Document, Types } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  stock: number;
  createdAt: Date;
  _id: Types.ObjectId;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

export const Product = model<IProduct>("Product", productSchema);
