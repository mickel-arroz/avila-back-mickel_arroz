import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import { ApiError } from "../utils/apiError";

export class UserService {
  static async updateUserEmail(email: string, updateData: object) {
    const user = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
      runValidators: true,
    })
      .select("-password")
      .lean();

    if (!user) {
      throw new ApiError(404, "Usuario no encontrado", "USER_NOT_FOUND", {
        email,
      });
    }

    return user;
  }

  static async updateUserRole(email: string, newRole: string) {
    if (!["user", "admin"].includes(newRole)) {
      throw new ApiError(400, "Rol inválido", "ROLE_VALIDATION", {
        validRoles: ["user", "admin"],
        received: newRole,
      });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { role: newRole },
      { new: true, runValidators: true }
    )
      .select("-password")
      .lean();

    if (!user) {
      throw new ApiError(404, "Usuario no encontrado", "USER_NOT_FOUND", {
        email,
      });
    }

    return user;
  }

  static async changePassword(targetEmail: string, newPassword: string) {
    const user = await User.findOne({ email: targetEmail }).select("+password");

    if (!user) {
      throw new ApiError(404, "Usuario no encontrado", "USER_NOT_FOUND", {
        email: targetEmail,
      });
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      throw new ApiError(
        400,
        "La nueva contraseña no puede ser igual a la actual",
        "PASSWORD_SAME_AS_OLD"
      );
    }

    user.password = newPassword;
    await user.save();

    return {
      success: true,
      message: `Contraseña para ${targetEmail} actualizada correctamente`,
    };
  }

  static async deleteUser(email: string, requestingAdminEmail: string) {
    if (email === requestingAdminEmail) {
      throw new ApiError(
        403,
        "No puedes eliminarte a ti mismo",
        "SELF_DELETION",
        {
          email,
        }
      );
    }

    const deletedUser = await User.findOneAndDelete({ email }).lean();

    if (!deletedUser) {
      throw new ApiError(404, "Usuario no encontrado", "USER_NOT_FOUND", {
        email,
      });
    }

    return {
      email: deletedUser.email,
      role: deletedUser.role,
      deletedAt: new Date(),
    };
  }

  static async getAllUsers({
    page = 1,
    limit = 10,
  }: {
    page: number;
    limit: number;
  }) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).select("email role createdAt").lean(),
      User.estimatedDocumentCount(),
    ]);

    return {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      users,
    };
  }
}
