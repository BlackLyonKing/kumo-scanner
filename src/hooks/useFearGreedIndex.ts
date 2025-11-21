import { useQuery } from "@tanstack/react-query";

interface FearGreedData {
  value: string;
  value_classification: string;
  timestamp: string;
  time_until_update: string;
}

interface FearGreedResponse {
  name: string;
  data: FearGreedData[];
  metadata: {
    error?: string;
  };
}

const fetchFearGreedIndex = async (): Promise<number> => {
  try {
    const response = await fetch("https://api.alternative.me/fng/");
    
    if (!response.ok) {
      throw new Error("Failed to fetch Fear & Greed Index");
    }
    
    const data: FearGreedResponse = await response.json();
    
    if (data.data && data.data.length > 0) {
      return parseInt(data.data[0].value, 10);
    }
    
    throw new Error("No data available");
  } catch (error) {
    console.error("Error fetching Fear & Greed Index:", error);
    throw error;
  }
};

export const useFearGreedIndex = () => {
  return useQuery({
    queryKey: ["fearGreedIndex"],
    queryFn: fetchFearGreedIndex,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};
