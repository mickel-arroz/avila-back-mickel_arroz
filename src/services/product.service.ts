import { Product, IProduct } from "../models/product.model";

interface PaginationOptions {
  page?: number;
  limit?: number;
}

export class ProductService {
  static async createProduct(data: {
    name: string;
    description: string;
    price: number;
    stock: number;
  }): Promise<IProduct> {
    const product = new Product(data);
    return await product.save();
  }

  static async getProducts(options: PaginationOptions): Promise<{
    items: IProduct[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Product.find({ stock: { $gt: 0 } })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Product.countDocuments({ stock: { $gt: 0 } }),
    ]);

    return { items, total, page, limit };
  }

  static async getProductsAll(options: PaginationOptions): Promise<{
    items: IProduct[];
    total: number;
    page: number;
    limit: number;
  }> {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Product.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Product.countDocuments({ stock: { $gt: 0 } }),
    ]);

    return { items, total, page, limit };
  }

  static async getProduct(id: string): Promise<{
    item: IProduct;
  }> {
    const product = await Product.findById(id);

    if (!product) {
      throw new Error(
        JSON.stringify({
          errorType: "PRODUCT_NOT_FOUND",
          message: "Producto no encontrado",
          details: { id },
        })
      );
    }
    return { item: product };
  }

  static async updateProduct(
    id: string,
    data: Partial<Pick<IProduct, "name" | "description" | "price" | "stock">>
  ): Promise<IProduct> {
    const product = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      throw new Error(
        JSON.stringify({
          errorType: "PRODUCT_NOT_FOUND",
          message: "Producto no encontrado",
          details: { id },
        })
      );
    }
    return product;
  }

  static async deleteProduct(id: string): Promise<{ id: string }> {
    const result = await Product.findByIdAndDelete(id);
    if (!result) {
      throw new Error(
        JSON.stringify({
          errorType: "PRODUCT_NOT_FOUND",
          message: "Producto no encontrado",
          details: { id },
        })
      );
    }
    return { id: result._id.toString() };
  }
}
