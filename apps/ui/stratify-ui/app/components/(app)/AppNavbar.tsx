"use client";

import Link from "next/link";
import StratifyIcon from "../Common/StratifyIcon";
import UserIconMenu from "./UserIconMenu";

interface NavLink {
    label: string;
    href: string;
}

const navLinks = [
    { label: "Dashboard", href: "/app/dashboard" },
    { label: "Portfolios", href: "/app/portfolios" },
    { label: "Markets", href: "/app/markets" },
    { label: "Learn", href: "/app/learn" },
] satisfies NavLink[];

const AppNavbar = () => {
    return (
        <nav className="sticky top-0 bg-background-light flex flex-row justify-between px-10 py-6 items-center">
            <Link
                href="/app/dashboard"
                className="flex-1 justify-start flex flex-row gap-x-2 py-2"
            >
                <StratifyIcon width={40} height={40} />
                <div className="font-sans font-semibold text-primary-base text-4xl">
                    Stratify
                </div>
            </Link>
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
                <UserIconMenu />
            </div>
        </nav>
    );
};

export default AppNavbar;
