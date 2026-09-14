import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analyticsService";

export const analyticsKeys = {
  all: ["analytics"] as const,
  data: () => [...analyticsKeys.all, "data"] as const,
};

export function useAnalytics() {
  return useQuery({
    queryKey: analyticsKeys.data(),
    queryFn: () => analyticsService.get(),
    staleTime: 5 * 60 * 1000, // 5 minutos — dados de analytics não precisam de refresh constante
  });
}
