import api from "./api";
import { Analytics } from "@/types/Analytics";

class AnalyticsService {
  private readonly basePath = "/analytics";

  async get(): Promise<Analytics> {
    const response = await api.get<Analytics>(this.basePath);
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();
