import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import MockEnvironmentProvider from "@/app/tests/_mocks/MockEnvironmentProvider";
import { useSetGoal } from "./useSetGoal";

const mockSetGoal = vi.fn();

const mockKyClient = {
    POST: mockSetGoal,
};

vi.mock("@/lib/api/ky-client", () => ({
    useKyClient: () => mockKyClient,
}));

describe("useSetGoal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderSetGoalHook = () => {
        return renderHook(() => useSetGoal(), {
            wrapper: ({ children }) => (
                <MockEnvironmentProvider>{children}</MockEnvironmentProvider>
            ),
        });
    };

    it("should call POST /goal successfully", async () => {
        mockSetGoal.mockResolvedValue({
            data: {
                success: true,
            },
        });

        const { result } = renderSetGoalHook();

        const goalData = {
            targetAmount: 15000,
        };

        result.current.mutate(goalData);

        await waitFor(() => {
            expect(mockKyClient.POST).toHaveBeenCalledWith("/goal", {
                body: goalData,
            });

            expect(result.current.isSuccess).toBe(true);
        });
    });
});
