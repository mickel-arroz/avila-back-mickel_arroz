import { Product, IProduct } from "../models/product.model";
import { ApiError } from "../utils/apiError";

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

  static async getProducts(options: PaginationOptions) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Product.find({ stock: { $gt: 0 } })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Product.countDocuments({ stock: { $gt: 0 } }),
    ]);

    return { items, total, page, limit };
  }

  static async getProductsAll(options: PaginationOptions) {
    const page = options.page && options.page > 0 ? options.page : 1;
    const limit = options.limit && options.limit > 0 ? options.limit : 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Product.find().skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Product.estimatedDocumentCount(),
    ]);

    return { items, total, page, limit };
  }

  static async getProduct(id: string) {
    const product = await Product.findById(id).lean();

    if (!product) {
      throw new ApiError(404, "Producto no encontrado", "PRODUCT_NOT_FOUND", {
        id,
      });
    }

    return { item: product };
  }

  static async updateProduct(
    id: string,
    data: Partial<Pick<IProduct, "name" | "description" | "price" | "stock">>
  ) {
    const product = await Product.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean();

    if (!product) {
      throw new ApiError(404, "Producto no encontrado", "PRODUCT_NOT_FOUND", {
        id,
      });
    }

    return product;
  }

  static async deleteProduct(id: string) {
    const result = await Product.findByIdAndDelete(id).lean();

    if (!result) {
      throw new ApiError(404, "Producto no encontrado", "PRODUCT_NOT_FOUND", {
        id,
      });
    }

    return { id: result._id.toString() };
  }
}
