import api from "./api";
import { Delivery, DriverEarnings } from "../types/driverTypes";

export const driverService = {
  getAvailableJobs: async (): Promise<Delivery[]> => {
    const res = await api.get<{ data: Delivery[] }>("/driver/jobs/available");
    return res.data.data;
  },

  getMyJobs: async (): Promise<Delivery[]> => {
    const res = await api.get<{ data: Delivery[] }>("/driver/jobs/my");
    return res.data.data;
  },

  acceptJob: async (deliveryId: string): Promise<Delivery> => {
    const res = await api.post<{ data: Delivery }>(
      `/driver/jobs/${deliveryId}/accept`
    );
    return res.data.data;
  },

  pickUpOrder: async (deliveryId: string): Promise<Delivery> => {
    const res = await api.patch<{ data: Delivery }>(
      `/driver/jobs/${deliveryId}/pickup`
    );
    return res.data.data;
  },

  completeDelivery: async (deliveryId: string): Promise<Delivery> => {
    const res = await api.patch<{ data: Delivery }>(
      `/driver/jobs/${deliveryId}/complete`
    );
    return res.data.data;
  },

  getEarnings: async (): Promise<DriverEarnings> => {
    const res = await api.get<{ data: DriverEarnings }>("/driver/earnings");
    return res.data.data;
  },
};