"use client";

import StratifyIcon from "@/app/components/Common/StratifyIcon";
import { Button } from "@/app/components/ui/button";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import SignUpForm from "./SignUpForm";

export default function SignUpPage() {
    const { push } = useRouter();

    return (
        <div className="font-sans items-center justify-items-center min-h-screen">
            <div className="flex flex-col min-h-screen justify-center items-center">
                <StratifyIcon
                    width={650}
                    height={650}
                    className="blur-sm z-0 absolute"
                />
                <div className="relative bg-primary-lightest/65 rounded-3xl mx-8 pt-14">
                    <h1 className="text-4xl text-secondary-darker text-center font-bold pb-8">
                        Create Your Account
                    </h1>
                    <SignUpForm />
                    <div className="flex flex-row justify-center py-6">
                        <div className="text-sm text-primary-base">
                            Already have an account?
                        </div>
                        <div
                            className="mx-1 flex flex-row items-center hover:underline hover:underline-offset-1 hover:cursor-pointer"
                            onClick={() => push("/login")}
                        >
                            <Button
                                variant="link"
                                className="text-primary-base -my-2"
                            >
                                Log In
                            </Button>
                            <ChevronRight
                                size={14}
                                className="text-primary-base"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
