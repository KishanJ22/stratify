"use client";

import Link from "next/link";
import StratifyIcon from "../../Common/StratifyIcon";
import { useSessionContext } from "@/app/(screens)/app/SessionProvider";
import { Avatar, AvatarFallback } from "../../ui/avatar";

type NavLink = {
    label: string;
    href: string;
};

const navLinks = [
    { label: "Dashboard", href: "/app/dashboard" },
    { label: "Portfolio", href: "/app/portfolio" },
    { label: "Markets", href: "/app/markets" },
    { label: "Learn", href: "/app/learn" },
] satisfies NavLink[];

const AppNavbar = () => {
    const { session } = useSessionContext();

    const initials = session?.userDetails?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return (
        <nav className="sticky top-0 bg-background-light flex flex-row justify-between px-16 py-6 items-center">
            <div className="flex-1 justify-start flex flex-row gap-x-2 py-2">
                <StratifyIcon width={40} height={40} />
                <div className="font-sans font-semibold text-primary-base text-4xl">
                    Stratify
                </div>
            </div>
            <div className="font-sans bg-sidebar-light rounded-full px-10 py-4 w-fit flex flex-row gap-x-10 justify-self-center">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="text-primary-darkest font-medium hover:text-primary-base transition-colors"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
            <div className="flex-1 flex justify-end">
                <Avatar className="bg-primary-lightest text-primary-darkest font-sans">
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
            </div>
        </nav>
    );
};

export default AppNavbar;
