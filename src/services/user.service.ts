import { User } from "../models/user.model";
import bcrypt from "bcryptjs";

export class UserService {
  static async updateUserEmail(email: string, updateData: object) {
    const user = await User.findOneAndUpdate({ email }, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) throw new Error("Usuario no encontrado");
    return user;
  }

  static async updateUserRole(email: string, newRole: string) {
    if (!["user", "admin"].includes(newRole)) {
      throw new Error(
        JSON.stringify({
          errorType: "ROLE_VALIDATION",
          message: "Rol inválido",
          details: {
            validRoles: ["user", "admin"],
            received: newRole,
          },
        })
      );
    }
    const user = await User.findOneAndUpdate(
      { email },
      { role: newRole },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      throw new Error(
        JSON.stringify({
          errorType: "USER_NOT_FOUND",
          message: "Usuario no encontrado",
          details: { email },
        })
      );
    }

    return user;
  }

  static async changePassword(targetEmail: string, newPassword: string) {
    const user = await User.findOne({ email: targetEmail }).select("+password");
    if (!user) {
      throw new Error(
        JSON.stringify({
          errorType: "USER_NOT_FOUND",
          message: "Usuario no encontrado",
          details: { email: targetEmail },
        })
      );
    }

    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) {
      throw new Error(
        JSON.stringify({
          errorType: "PASSWORD_SAME_AS_OLD",
          message: "La nueva contraseña no puede ser igual a la actual",
        })
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
      throw new Error(
        JSON.stringify({
          errorType: "SELF_DELETION",
          message: "No puedes eliminarte a ti mismo",
          details: {
            email: requestingAdminEmail,
          },
        })
      );
    }

    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      throw new Error(
        JSON.stringify({
          errorType: "USER_NOT_FOUND",
          message: "Usuario no encontrado",
          details: { email },
        })
      );
    }

    return {
      email: deletedUser.email,
      role: deletedUser.role,
      deletedAt: new Date(),
    };
  }

  static async getAllUsers() {
    const users = await User.find().select("+password");
    if (!users) throw new Error("No se encontraron usuarios");
    return users;
  }
}
