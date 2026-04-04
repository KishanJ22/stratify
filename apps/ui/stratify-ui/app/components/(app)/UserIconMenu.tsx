"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useSessionContext } from "@/app/(screens)/app/SessionProvider";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";

const UserIconMenu = () => {
    const { session, logout } = useSessionContext();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const initials = session?.userDetails?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target as Node)
            ) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <div ref={userMenuRef} className="flex flex-col">
            <Avatar
                className="bg-primary-lightest text-primary-darkest font-sans cursor-pointer"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div
                className={cn(
                    "flex flex-col rounded-xl bg-muted-lightest border border-primary-dark mt-12 absolute right-10 w-44 font-sans text-sm leading-5 animate-in fade-in-50",
                    isUserMenuOpen ? "block" : "hidden",
                )}
            >
                <div className="px-4 py-2 font-semibold text-primary-darker border-b border-primary-lighter">
                    {session?.userDetails?.displayUsername ||
                        session?.userDetails?.username}
                </div>
                <div
                    className="px-4 py-2 flex flex-row items-center text-negative-base font-medium cursor-pointer hover:bg-negative-base hover:text-white transition-colors rounded-b-xl"
                    onClick={() => logout()}
                >
                    <LogOut className="mr-2" size={16} />
                    {"Log out"}
                </div>
            </div>
        </div>
    );
};

export default UserIconMenu;
