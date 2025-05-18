import { Schema, model, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  email: string;
  password: string;
  _id: Types.ObjectId;

}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, select: false },
});

// Middleware para hashear la contraseña antes de guardar
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = model<IUser>("User", userSchema);
