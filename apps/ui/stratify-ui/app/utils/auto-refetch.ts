import { useEffect } from "react";

export const useAutoRefetch = (refetch: () => void, interval: number) => {
    useEffect(() => {
        const refetchInterval = setInterval(() => {
            refetch();
        }, interval);

        return () => clearInterval(refetchInterval);
    });
};
