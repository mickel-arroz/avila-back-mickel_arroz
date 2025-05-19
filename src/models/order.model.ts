import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  status: "pendiente" | "procesado" | "enviado" | "entregado" | "cancelado";
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: { type: [OrderItemSchema], required: true },
    status: {
      type: String,
      enum: ["pendiente", "procesado", "enviado", "entregado", "cancelado"],
      default: "pendiente",
      index: true,
    },
  },
  { timestamps: true }
);

OrderSchema.index({ createdAt: -1 });

export const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);
