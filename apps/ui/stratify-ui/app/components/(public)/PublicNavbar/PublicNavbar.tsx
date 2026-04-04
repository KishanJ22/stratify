"use client";

import Link from "next/link";
import { Button } from "../../ui/button";
import { useRouter } from "next/navigation";
import StratifyIcon from "../../Common/StratifyIcon";

type NavLink = {
    label: string;
    href: string;
};

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/features" },
] satisfies NavLink[];

interface PublicNavbarProps {
    showLoginSignUpButtons?: boolean;
}

const PublicNavbar = ({ showLoginSignUpButtons = true }: PublicNavbarProps) => {
    const { push } = useRouter();

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
            <div className="flex-1 justify-end flex flex-row gap-x-2">
                {showLoginSignUpButtons ? (
                    <>
                        <Button
                            variant="link"
                            size="lg"
                            onClick={() => push("/login")}
                        >
                            Login
                        </Button>
                        <Button
                            variant="default"
                            size="lg"
                            onClick={() => push("/sign-up")}
                        >
                            Sign Up
                        </Button>
                    </>
                ) : null}
            </div>
        </nav>
    );
};

export default PublicNavbar;
