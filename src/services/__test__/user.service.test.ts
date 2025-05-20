import { UserService } from "../../services/user.service";
import { User } from "../../models/user.model";
import { ApiError } from "../../utils/apiError";
import bcrypt from "bcryptjs";

// Mock de dependencias
jest.mock("../../models/user.model");
jest.mock("bcryptjs");

describe("UserService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("updateUserEmail", () => {
    it("debe actualizar el email de un usuario existente", async () => {
      const mockUser = { email: "nuevo@email.com" };

      (User.findOneAndUpdate as jest.Mock).mockReturnValueOnce({
        select: () => ({
          lean: () => mockUser,
        }),
      });

      const result = await UserService.updateUserEmail("test@email.com", {
        email: "nuevo@email.com",
      });

      expect(User.findOneAndUpdate).toHaveBeenCalledWith(
        { email: "test@email.com" },
        { email: "nuevo@email.com" },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(mockUser);
    });

    it("debe lanzar ApiError si no se encuentra el usuario", async () => {
      (User.findOneAndUpdate as jest.Mock).mockReturnValueOnce({
        select: () => ({
          lean: () => null,
        }),
      });

      await expect(
        UserService.updateUserEmail("noexiste@email.com", {
          email: "otro@email.com",
        })
      ).rejects.toThrow(ApiError);
    });
  });

  describe("updateUserRole", () => {
    it("debe lanzar error si el rol es inválido", async () => {
      await expect(
        UserService.updateUserRole("test@email.com", "invalidRole")
      ).rejects.toThrow(ApiError);
    });

    it("debe actualizar el rol correctamente", async () => {
      const mockUser = { email: "test@email.com", role: "admin" };

      (User.findOneAndUpdate as jest.Mock).mockReturnValueOnce({
        select: () => ({
          lean: () => mockUser,
        }),
      });

      const result = await UserService.updateUserRole(
        "test@email.com",
        "admin"
      );

      expect(result).toEqual(mockUser);
    });
  });

  describe("changePassword", () => {
    it("debe lanzar error si el usuario no existe", async () => {
      (User.findOne as jest.Mock).mockReturnValueOnce({
        select: () => null,
      });

      await expect(
        UserService.changePassword("x@email.com", "123")
      ).rejects.toThrow(ApiError);
    });

    it("debe lanzar error si la contraseña es igual", async () => {
      const mockUser = { password: "hashed", save: jest.fn() };
      (User.findOne as jest.Mock).mockReturnValueOnce({
        select: () => mockUser,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);

      await expect(
        UserService.changePassword("x@email.com", "123")
      ).rejects.toThrow(ApiError);
    });

    it("debe cambiar la contraseña si es diferente", async () => {
      const mockUser = { password: "hashed", save: jest.fn() };
      (User.findOne as jest.Mock).mockReturnValueOnce({
        select: () => mockUser,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      const result = await UserService.changePassword(
        "x@email.com",
        "nueva123"
      );

      expect(mockUser.password).toBe("nueva123");
      expect(mockUser.save).toHaveBeenCalled();
      expect(result.success).toBe(true);
    });
  });

  describe("deleteUser", () => {
    it("no debe permitir eliminarse a sí mismo", async () => {
      await expect(
        UserService.deleteUser("admin@email.com", "admin@email.com")
      ).rejects.toThrow(ApiError);
    });

    it("debe eliminar un usuario existente", async () => {
      const mockDeleted = { email: "user@email.com", role: "user" };
      (User.findOneAndDelete as jest.Mock).mockReturnValueOnce({
        lean: () => mockDeleted,
      });

      const result = await UserService.deleteUser(
        "user@email.com",
        "admin@email.com"
      );

      expect(result).toHaveProperty("email", "user@email.com");
      expect(result).toHaveProperty("deletedAt");
    });
  });

  describe("getAllUsers", () => {
    it("debe retornar la lista paginada de usuarios", async () => {
      const mockUsers = [{ email: "a@email.com" }, { email: "b@email.com" }];
      const totalCount = 20;

      (User.find as jest.Mock).mockReturnValueOnce({
        skip: () => ({
          limit: () => ({
            select: () => ({
              lean: () => mockUsers,
            }),
          }),
        }),
      });

      (User.estimatedDocumentCount as jest.Mock).mockResolvedValueOnce(
        totalCount
      );

      const result = await UserService.getAllUsers({ page: 2, limit: 5 });

      expect(result.page).toBe(2);
      expect(result.limit).toBe(5);
      expect(result.total).toBe(totalCount);
      expect(result.totalPages).toBe(4);
      expect(result.users).toEqual(mockUsers);
    });
  });
});
