import api from "./api";
import { DeliveryJob, DriverEarnings } from "../types/driverTypes";

export const driverService = {
  getAvailableJobs: async (page = 1): Promise<{ data: DeliveryJob[]; meta: any }> => {
    const res = await api.get("/driver/jobs", { params: { page } });
    return res.data;
  },

  getJobDetail: async (id: string): Promise<DeliveryJob> => {
    const res = await api.get<{ data: DeliveryJob }>(`/driver/jobs/${id}`);
    return res.data.data;
  },

  getActiveJob: async (): Promise<DeliveryJob | null> => {
    const res = await api.get<{ data: DeliveryJob | null }>("/driver/jobs/active");
    return res.data.data;
  },

  getMyJobs: async (page = 1): Promise<{ data: DeliveryJob[]; meta: any }> => {
    const res = await api.get("/driver/jobs/history", { params: { page } });
    return res.data;
  },

  getEarnings: async (): Promise<DriverEarnings> => {
    const res = await api.get<{ data: DriverEarnings }>("/driver/earnings");
    return res.data.data;
  },

  takeJob: async (id: string): Promise<DeliveryJob> => {
    const res = await api.patch<{ data: DeliveryJob }>(`/driver/jobs/${id}/take`);
    return res.data.data;
  },

  completeJob: async (id: string): Promise<DeliveryJob> => {
    const res = await api.patch<{ data: DeliveryJob }>(`/driver/jobs/${id}/complete`);
    return res.data.data;
  },
};