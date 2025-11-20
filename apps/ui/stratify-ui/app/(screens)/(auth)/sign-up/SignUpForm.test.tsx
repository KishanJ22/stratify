import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithContext } from "@/app/tests/utils";
import SignUpForm from "./SignUpForm";

const mockRouterPush = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockRouterPush,
    }),
}));

describe("Sign up form", () => {
    beforeEach(() => {
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);

        vi.clearAllMocks();
    });

    const renderForm = () => renderWithContext({ children: <SignUpForm /> });

    it("AB#131 - should render the form fields", () => {
        renderForm();

        const fieldLabels = [
            "First name",
            "Last name",
            "Username",
            "Email address",
            "Password",
            "Confirm Password",
            "Sign Up",
        ];

        fieldLabels.forEach((label) => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });
    });
});
