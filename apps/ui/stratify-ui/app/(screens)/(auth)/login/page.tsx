"use client";

import StratifyIcon from "@/app/components/Common/StratifyIcon";
import { Button } from "@/app/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import LoginForm from "./LoginForm";
import { toast } from "sonner";
import { useEffect } from "react";

export default function LoginPage() {
    const { push } = useRouter();
    const searchParams = useSearchParams();

    const loggedOut = searchParams.get("loggedOut");
    const sessionInvalid = searchParams.get("sessionInvalid");

    useEffect(() => {
        setTimeout(() => {
            if (loggedOut) {
                toast.success("You have been logged out successfully.");
            }

            if (sessionInvalid) {
                toast.error("Session is invalid. Please log in again.");
            }
        });
    }, [loggedOut, sessionInvalid]);

    return (
        <div className="font-sans items-center justify-items-center h-full">
            <div className="flex flex-col h-full justify-center items-center">
                <StratifyIcon
                    width={650}
                    height={650}
                    className="blur-sm z-0 absolute"
                />
                <div className="relative bg-primary-lightest/80 rounded-3xl mx-8 pt-14 min-w-lg">
                    <h1 className="text-4xl text-secondary-darker text-center font-bold pb-8">
                        Log In
                    </h1>
                    <LoginForm />
                    <div className="flex flex-row justify-center py-6">
                        <div className="text-sm text-secondary-darker">
                            {"Don't have an account?"}
                        </div>
                        <div
                            className="mx-1 flex flex-row items-center hover:underline hover:underline-offset-1 hover:cursor-pointer"
                            onClick={() => push("/sign-up")}
                        >
                            <Button
                                variant="link"
                                className="text-secondary-darker hover:text-secondary-base transition-colors -my-2"
                            >
                                Sign Up
                                <ChevronRight size={14} />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
