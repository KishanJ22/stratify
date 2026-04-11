import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";
import { useGoal } from "./useGoal";

const mockGetGoal = vi.fn();

const mockKyClient = {
    GET: mockGetGoal,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("useGoal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderGetGoalHook = () => {
        return renderHook(() => useGoal(), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call GET /goal successfully", async () => {
        mockGetGoal.mockResolvedValue({
            data: {
                data: {
                    targetAmount: 10000,
                },
            },
        });

        const { result } = renderGetGoalHook();

        await waitFor(() => {
            expect(mockKyClient.GET).toHaveBeenCalledWith("/goal");

            expect(result.current.data).toEqual({
                targetAmount: 10000,
            });

            expect(result.current.isLoading).toBe(false);
        });
    });
});
