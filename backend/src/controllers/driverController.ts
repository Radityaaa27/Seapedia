import { Request, Response } from "express";
import { driverService } from "../services/driverService";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";

export const driverController = {
  getAvailableJobs: async (req: Request, res: Response) => {
    const jobs = await driverService.getAvailableJobs();
    res.json(ApiResponse.success("Available jobs retrieved.", jobs));
  },

  getMyJobs: async (req: Request, res: Response) => {
    const driverId = (req as any).user.userId;
    const jobs = await driverService.getMyJobs(driverId);
    res.json(ApiResponse.success("My jobs retrieved.", jobs));
  },

  acceptJob: async (req: Request, res: Response) => {
    const driverId = (req as any).user.userId;
    const deliveryId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const delivery = await driverService.acceptJob(driverId, deliveryId);
    res.json(ApiResponse.success("Job accepted successfully.", delivery));
  },

  pickUpOrder: async (req: Request, res: Response) => {
    const driverId = (req as any).user.userId;
    const deliveryId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const delivery = await driverService.pickUpOrder(driverId, deliveryId);
    res.json(ApiResponse.success("Pickup confirmed.", delivery));
  },

  completeDelivery: async (req: Request, res: Response) => {
    const driverId = (req as any).user.userId;
    const deliveryId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;
    const delivery = await driverService.completeDelivery(
      driverId,
      deliveryId
    );
    res.json(
      ApiResponse.success("Delivery completed. Earnings credited.", delivery)
    );
  },

  getEarnings: async (req: Request, res: Response) => {
    const driverId = (req as any).user.userId;
    const earnings = await driverService.getEarnings(driverId);
    res.json(ApiResponse.success("Earnings retrieved.", earnings));
  },
};