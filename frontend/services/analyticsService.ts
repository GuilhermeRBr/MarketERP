import api from "./api";
import { Analytics, ChartsData, ChartRange } from "@/types/Analytics";

class AnalyticsService {
  private readonly basePath = "/analytics";

  async get(): Promise<Analytics> {
    const response = await api.get<Analytics>(this.basePath);
    return response.data;
  }

  async getCharts(range: ChartRange): Promise<ChartsData> {
    const response = await api.get<ChartsData>(`${this.basePath}/charts`, {
      params: { range },
    });
    return response.data;
  }
}

export const analyticsService = new AnalyticsService();
