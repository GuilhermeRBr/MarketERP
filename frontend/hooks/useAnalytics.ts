import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";
import { ChartRange } from "@/types/Analytics";

export const analyticsKeys = {
  all: ["analytics"] as const,
  data: () => [...analyticsKeys.all, "data"] as const,
  charts: (range: ChartRange) => [...analyticsKeys.all, "charts", range] as const,
};

export function useAnalytics() {
  return useQuery({
    queryKey: analyticsKeys.data(),
    queryFn: () => analyticsService.get(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCharts(range: ChartRange) {
  return useQuery({
    queryKey: analyticsKeys.charts(range),
    queryFn: () => analyticsService.getCharts(range),
    staleTime: 2 * 60 * 1000,
  });
}
