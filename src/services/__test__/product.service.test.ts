import { ProductService } from "../product.service";
import { Product } from "../../models/product.model";

jest.mock("../../models/product.model");

describe("ProductService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createProduct", () => {
    it("debe crear un nuevo producto", async () => {
      const data = { name: "Test", description: "Desc", price: 10, stock: 5 };
      const mockSave = jest.fn().mockResolvedValue({ ...data, _id: "id123" });

      (Product as unknown as jest.Mock).mockImplementation(() => ({
        save: mockSave,
      }));

      const result = await ProductService.createProduct(data);

      expect(result._id).toBe("id123");
      expect(mockSave).toHaveBeenCalled();
    });
  });

  describe("getProducts", () => {
    it("debe devolver productos con stock paginados", async () => {
      const mockProducts = [{ name: "A" }];
      (Product.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockProducts),
      });
      (Product.countDocuments as jest.Mock).mockResolvedValue(1);

      const result = await ProductService.getProducts({ page: 1, limit: 10 });

      expect(result.items).toEqual(mockProducts);
      expect(result.total).toBe(1);
    });
  });

  describe("getProductsAll", () => {
    it("debe devolver todos los productos paginados", async () => {
      const mockProducts = [{ name: "A" }];
      (Product.find as jest.Mock).mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockProducts),
      });
      (Product.estimatedDocumentCount as jest.Mock).mockResolvedValue(5);

      const result = await ProductService.getProductsAll({
        page: 1,
        limit: 10,
      });

      expect(result.items).toEqual(mockProducts);
      expect(result.total).toBe(5);
    });
  });

  describe("getProduct", () => {
    it("debe devolver un producto por id", async () => {
      const mockProduct = { _id: "id123", name: "Test" };
      (Product.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockProduct),
      });

      const result = await ProductService.getProduct("id123");

      expect(result.item).toEqual(mockProduct);
    });

    it("debe lanzar error si no encuentra el producto", async () => {
      (Product.findById as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(ProductService.getProduct("id123")).rejects.toThrow(
        "Producto no encontrado"
      );
    });
  });

  describe("updateProduct", () => {
    it("debe actualizar un producto existente", async () => {
      const mockProduct = { _id: "id123", name: "Updated" };
      (Product.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockProduct),
      });

      const result = await ProductService.updateProduct("id123", {
        name: "Updated",
      });

      expect(result).toEqual(mockProduct);
    });

    it("debe lanzar error si no encuentra el producto", async () => {
      (Product.findByIdAndUpdate as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(
        ProductService.updateProduct("id123", { name: "Nope" })
      ).rejects.toThrow("Producto no encontrado");
    });
  });

  describe("deleteProduct", () => {
    it("debe eliminar un producto existente", async () => {
      const mockDeleted = { _id: "id123" };
      (Product.findByIdAndDelete as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockDeleted),
      });

      const result = await ProductService.deleteProduct("id123");

      expect(result.id).toBe("id123");
    });

    it("debe lanzar error si no encuentra el producto", async () => {
      (Product.findByIdAndDelete as jest.Mock).mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      });

      await expect(ProductService.deleteProduct("id123")).rejects.toThrow(
        "Producto no encontrado"
      );
    });
  });
});
