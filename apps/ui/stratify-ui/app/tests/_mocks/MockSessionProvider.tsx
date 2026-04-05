import {
    SessionContext,
    UserSession,
} from "@/app/(screens)/app/SessionProvider";
import { useState } from "react";

interface MockSessionProviderProps {
    children: React.ReactNode;
    session?: UserSession | null;
}

export const defaultSession = {
    userDetails: {
        id: "test-user",
        name: "Test User",
        username: "Test User",
        displayUsername: "Test User",
        email: "test@test.com",
        currency: "GBP",
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // in 1 hour
    },
} satisfies UserSession;

const MockSessionProvider = ({
    children,
    session,
}: MockSessionProviderProps) => {
    const [mockSession, setMockSession] = useState<UserSession | null>(
        session ?? defaultSession,
    );

    return (
        <SessionContext.Provider
            value={{
                session: mockSession,
                setSession: setMockSession,
                logout: () => {},
            }}
        >
            {children}
        </SessionContext.Provider>
    );
};

export default MockSessionProvider;
