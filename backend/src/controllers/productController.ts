import { Request, Response } from "express";
import { productService } from "../services/productService";
import {
  createProductSchema,
  updateProductSchema,
  productQuerySchema,
} from "../validators/productValidator";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export const productController = {
  getProducts: async (req: Request, res: Response) => {
    const parsed = productQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      throw ApiError.badRequest(parsed.error.issues[0].message);
    }
    const result = await productService.getProducts(parsed.data);
    res.json(
      ApiResponse.success("Products retrieved.", result.products, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      })
    );
  },

getProductBySlug: async (req: Request, res: Response) => {
  const storeSlug = Array.isArray(req.params.storeSlug)
    ? req.params.storeSlug[0]
    : req.params.storeSlug;
  const productSlug = Array.isArray(req.params.productSlug)
    ? req.params.productSlug[0]
    : req.params.productSlug;
  const product = await productService.getProductBySlug(storeSlug, productSlug);
  res.json(ApiResponse.success("Product retrieved.", product));
},

  createProduct: async (req: Request, res: Response) => {
    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) {
      throw ApiError.badRequest(parsed.error.issues[0].message);
    }
    const userId = (req as any).user.userId;
    const product = await productService.createProduct(userId, parsed.data);
    res.status(201).json(ApiResponse.success("Product created.", product));
  },

  updateProduct: async (req: Request, res: Response) => {
  const parsed = updateProductSchema.safeParse(req.body);
  if (!parsed.success) {
    throw ApiError.badRequest(parsed.error.issues[0].message);
  }
  const userId = (req as any).user.userId;
  const productId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  const product = await productService.updateProduct(
    userId,
    productId,
    parsed.data
  );
  res.json(ApiResponse.success("Product updated.", product));
},

deleteProduct: async (req: Request, res: Response) => {
  const userId = (req as any).user.userId;
  const productId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;
  await productService.deleteProduct(userId, productId);
  res.json(ApiResponse.success("Product deleted."));
},
};