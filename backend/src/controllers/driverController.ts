import { Request, Response } from "express";
import { driverService } from "../services/driverService";
import { ApiResponse } from "../utils/ApiResponse";

export const driverController = {
  getAvailableJobs: async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await driverService.getAvailableJobs(page, limit);
    res.json(
      ApiResponse.success("Available jobs retrieved.", result.jobs, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      })
    );
  },

  getJobDetail: async (req: Request, res: Response) => {
    const deliveryId = req.params.id;
    const job = await driverService.getJobDetail(deliveryId);
    res.json(ApiResponse.success("Job detail retrieved.", job));
  },

  getActiveJob: async (req: Request, res: Response) => {
    const driverId = (req as any).user.userId;
    const job = await driverService.getActiveJob(driverId);
    res.json(ApiResponse.success("Active job retrieved.", job));
  },

  getMyJobs: async (req: Request, res: Response) => {
    const driverId = (req as any).user.userId;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await driverService.getMyJobs(driverId, page, limit);
    res.json(
      ApiResponse.success("Job history retrieved.", result.jobs, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: Math.ceil(result.total / result.limit),
      })
    );
  },

  getEarnings: async (req: Request, res: Response) => {
    const driverId = (req as any).user.userId;
    const earnings = await driverService.getEarnings(driverId);
    res.json(ApiResponse.success("Earnings retrieved.", earnings));
  },

  takeJob: async (req: Request, res: Response) => {
    const driverId = (req as any).user.userId;
    const deliveryId = req.params.id;
    const job = await driverService.takeJob(driverId, deliveryId);
    res.json(ApiResponse.success("Job accepted! Head to the store for pickup.", job));
  },

  completeJob: async (req: Request, res: Response) => {
    const driverId = (req as any).user.userId;
    const deliveryId = req.params.id;
    const job = await driverService.completeJob(driverId, deliveryId);
    res.json(ApiResponse.success("Delivery completed! Earnings have been added to your wallet.", job));
  },
};