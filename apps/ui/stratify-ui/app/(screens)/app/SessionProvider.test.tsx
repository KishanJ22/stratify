import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { SessionProvider, useSessionContext } from "./SessionProvider";
import { defaultSession } from "@/app/tests/_mocks/MockSessionProvider";

const mockPush = vi.fn();
const mockGetSessionTokenFromCookies = vi.fn();
const mockGetUserSession = vi.fn();
const mockLogoutUser = vi.fn();

const user = userEvent.setup();

const mockUseRouter = {
    push: mockPush,
};

vi.mock("next/navigation", () => ({
    useRouter: () => mockUseRouter,
}));

vi.mock("@/lib/auth/auth", () => ({
    useAuthClient: () => ({}),
}));

vi.mock("@/lib/auth/get-auth-token", () => ({
    getSessionTokenFromCookies: () => mockGetSessionTokenFromCookies(),
}));

vi.mock("@/lib/auth/get-session", () => ({
    getUserSession: () => mockGetUserSession(),
}));

vi.mock("@/lib/auth/logout", () => ({
    logoutUser: (bearer: string, authClient: unknown) =>
        mockLogoutUser(bearer, authClient),
}));

const mockSessionData = {
    data: defaultSession,
};

const TestSessionComponent = () => {
    const { session, logout } = useSessionContext();
    return (
        <>
            <span data-testid="user-name">{session?.userDetails.username}</span>
            <span data-testid="user-currency">
                {session?.userDetails.currency}
            </span>
            <button onClick={logout}>Log out</button>
        </>
    );
};

describe("SessionProvider", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = () =>
        render(
            <SessionProvider>
                <TestSessionComponent />
            </SessionProvider>,
        );

    it("should redirect to /login when no bearer token is found", async () => {
        mockGetSessionTokenFromCookies.mockResolvedValue(null);

        renderComponent();

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith("/login");
        });
    });

    it("should set the session when a valid bearer token and session data are found", async () => {
        mockGetSessionTokenFromCookies.mockResolvedValue("bearer-token");
        mockGetUserSession.mockResolvedValue(mockSessionData);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId("user-name")).toHaveTextContent(
                "Test User",
            );
            expect(screen.getByTestId("user-currency")).toHaveTextContent(
                "GBP",
            );
        });
    });

    it("should redirect to /login?sessionInvalid=true when session retrieval fails", async () => {
        mockGetSessionTokenFromCookies.mockResolvedValue("bearer-token");
        mockGetUserSession.mockResolvedValue(null);

        renderComponent();

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith("/login?sessionInvalid=true");
        });
    });

    it("should redirect to /login?sessionInvalid=true when the session has expired", async () => {
        mockGetSessionTokenFromCookies.mockResolvedValue("bearer-token");
        mockGetUserSession.mockResolvedValue({
            data: {
                userDetails: {
                    ...mockSessionData.data.userDetails,
                    expiresAt: new Date(Date.now() - 1000),
                },
            },
        });

        renderComponent();

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith("/login?sessionInvalid=true");
        });
    });

    it("should call logoutUser and redirect to /login?loggedOut=true when logging out", async () => {
        mockGetSessionTokenFromCookies.mockResolvedValue("bearer-token");
        mockGetUserSession.mockResolvedValue(mockSessionData);
        mockLogoutUser.mockResolvedValue(undefined);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId("user-name")).toHaveTextContent(
                "Test User",
            );
        });

        await user.click(screen.getByText("Log out"));

        await waitFor(() => {
            expect(mockLogoutUser).toHaveBeenCalledWith("bearer-token", {});
            expect(mockPush).toHaveBeenCalledWith("/login?loggedOut=true");
        });
    });

    it("should not call logoutUser if no bearer token is present when logging out", async () => {
        mockGetSessionTokenFromCookies
            .mockResolvedValueOnce("bearer-token")
            .mockResolvedValueOnce(null);
        mockGetUserSession.mockResolvedValue(mockSessionData);

        renderComponent();

        await waitFor(() => {
            expect(screen.getByTestId("user-name")).toHaveTextContent(
                "Test User",
            );
        });

        await user.click(screen.getByText("Log out"));

        expect(mockLogoutUser).not.toHaveBeenCalled();
    });
});
