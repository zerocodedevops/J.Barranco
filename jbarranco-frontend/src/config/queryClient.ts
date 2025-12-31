import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 15, // 15 minutes (optimizado para reducir requests)
            gcTime: 1000 * 60 * 60, // 1 hour (formerly cacheTime)
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: 1,
            // Network mode para funcionar offline con cache
            networkMode: "offlineFirst",
        },
    },
});
