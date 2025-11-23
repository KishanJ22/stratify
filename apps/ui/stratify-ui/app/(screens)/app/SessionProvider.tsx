"use client";

import { useAuthClient } from "@/lib/auth/auth";
import { getSessionTokenFromCookies } from "@/lib/auth/get-auth-token";
import { getUserSession } from "@/lib/auth/get-session";
import { logoutUser } from "@/lib/auth/logout";
import { useRouter } from "next/navigation";
import {
    createContext,
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from "react";

export interface UserSession {
    token: string;
    userDetails: {
        id: string;
        name: string;
        username: string;
        displayUsername: string;
        email: string;
    };
}

interface SessionContextType {
    session: UserSession | null;
    setSession: Dispatch<SetStateAction<UserSession | null>>;
    logout: () => void;
}

export const SessionContext = createContext<SessionContextType | null>(null);

interface SessionProviderProps {
    children: React.ReactNode;
}

export const SessionProvider = ({ children }: SessionProviderProps) => {
    const [session, setSession] = useState<UserSession | null>(null);

    const authClient = useAuthClient();
    const { push } = useRouter();

    const logout = async () => {
        const bearer = await getSessionTokenFromCookies();

        if (bearer) {
            await logoutUser(bearer, authClient);

            //? loggedOut will allow for showing a logged out message on the login page
            setSession(null);
            push("/login?loggedOut=true");
        }
    };

    useEffect(() => {
        const loadSession = async () => {
            const bearer = await getSessionTokenFromCookies();

            if (bearer) {
                const session = await getUserSession(bearer, authClient);

                if (session?.data) {
                    setSession(session.data);
                } else {
                    //? If session retrieval fails, redirect to login
                    setSession(null);
                    push("/login?sessionInvalid=true");
                }
            } else {
                //? If no bearer token is found, redirect to login
                setSession(null);
                push("/login");
            }
        };

        loadSession();
    }, []);

    return (
        <SessionContext.Provider value={{ session, setSession, logout }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSessionContext = () => {
    const context = useContext(SessionContext);

    if (context === null) {
        throw new Error(
            "useSessionContext must be used within a SessionProvider",
        );
    }

    return context;
};
