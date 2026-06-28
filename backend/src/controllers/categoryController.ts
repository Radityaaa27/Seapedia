import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export const categoryController = {
  getAll: async (_req: Request, res: Response) => {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
    res.json(ApiResponse.success("Categories retrieved.", categories));
  },

  create: async (req: Request, res: Response) => {
    const { name, iconUrl } = req.body;
    if (!name) throw ApiError.badRequest("Category name is required.");

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const category = await prisma.category.create({
      data: { name, slug, iconUrl },
    });
    res.status(201).json(ApiResponse.success("Category created.", category));
  },
};