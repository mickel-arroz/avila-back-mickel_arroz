import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.utils";
import { ApiError } from "../utils/apiError";

export class AuthService {
  static async register(email: string, password: string) {
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      throw new ApiError(409, "El usuario ya existe", "USER_EXISTS");
    }

    const user = new User({ email, password });
    await user.save();
    return { id: user._id, email: user.email };
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError(401, "Credenciales inválidas", "INVALID_CREDENTIALS");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Credenciales inválidas", "INVALID_CREDENTIALS");
    }

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
    if (users.length === 0) {
      throw new ApiError(404, "No se encontraron usuarios", "NO_USERS_FOUND");
    }
    return users;
  }
}
