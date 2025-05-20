import { AuthService } from "../../services/auth.service";
import { User } from "../../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/jwt.utils";
import { ApiError } from "../../utils/apiError";

jest.mock("../../models/user.model");
jest.mock("bcryptjs");
jest.mock("../../utils/jwt.utils");

describe("AuthService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("debe lanzar error si el usuario ya existe", async () => {
      (User.findOne as jest.Mock).mockReturnValueOnce({
        lean: () => ({ email: "existing@email.com" }),
      });

      await expect(
        AuthService.register("existing@email.com", "123456")
      ).rejects.toThrow(ApiError);
    });

    it("debe registrar un nuevo usuario si no existe", async () => {
      (User.findOne as jest.Mock).mockReturnValueOnce({
        lean: () => null,
      });

      const saveMock = jest.fn();
      const mockUser = {
        _id: "userId123",
        email: "new@email.com",
        password: "hashed",
        save: saveMock,
      };

      (User as unknown as jest.Mock).mockImplementation(() => mockUser);

      const result = await AuthService.register("new@email.com", "123456");

      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual({ id: "userId123", email: "new@email.com" });
    });
  });

  describe("login", () => {
    it("debe lanzar error si el usuario no existe", async () => {
      (User.findOne as jest.Mock).mockReturnValueOnce({
        select: () => null,
      });

      await expect(AuthService.login("no@email.com", "123456")).rejects.toThrow(
        ApiError
      );
    });

    it("debe lanzar error si la contraseña no coincide", async () => {
      const mockUser = {
        password: "hashed",
        _id: "userId123",
        email: "test@email.com",
        role: "user",
      };

      (User.findOne as jest.Mock).mockReturnValueOnce({
        select: () => mockUser,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(
        AuthService.login("test@email.com", "wrongpass")
      ).rejects.toThrow(ApiError);
    });

    it("debe retornar token y datos del usuario si login es exitoso", async () => {
      const mockUser = {
        _id: "userId123",
        email: "test@email.com",
        password: "hashed",
        role: "admin",
      };

      (User.findOne as jest.Mock).mockReturnValueOnce({
        select: () => mockUser,
      });

      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(true);
      (generateToken as jest.Mock).mockReturnValueOnce("mockedToken");

      const result = await AuthService.login("test@email.com", "123456");

      expect(generateToken).toHaveBeenCalledWith("userId123", "admin");
      expect(result).toEqual({
        token: "mockedToken",
        user: {
          id: "userId123",
          email: "test@email.com",
          role: "admin",
        },
      });
    });
  });

  describe("getAllUsers", () => {
    it("debe lanzar error si no hay usuarios", async () => {
      (User.find as jest.Mock).mockReturnValueOnce({
        select: () => ({
          lean: () => [],
        }),
      });

      await expect(AuthService.getAllUsers()).rejects.toThrow(ApiError);
    });

    it("debe retornar usuarios si existen", async () => {
      const mockUsers = [
        { email: "a@email.com", role: "user", createdAt: new Date() },
        { email: "b@email.com", role: "admin", createdAt: new Date() },
      ];

      (User.find as jest.Mock).mockReturnValueOnce({
        select: () => ({
          lean: () => mockUsers,
        }),
      });

      const result = await AuthService.getAllUsers();

      expect(result).toEqual(mockUsers);
    });
  });
});
