import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.utils";

export class AuthService {
  static async register(email: string, password: string) {
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) throw new Error("El usuario ya existe");

    const user = new User({ email, password });
    await user.save();
    return { id: user._id, email: user.email };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new Error("Credenciales inválidas");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Credenciales inválidas");

    const token = generateToken(user._id.toString(), user.role);
    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    };
  }

  static async getAllUsers() {
    const users = await User.find().select("email role createdAt").lean();
    if (users.length === 0) throw new Error("No se encontraron usuarios");
    return users;
  }
}
