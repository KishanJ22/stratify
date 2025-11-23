import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithContext } from "@/app/tests/utils";
import LoginForm from "./LoginForm";

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

describe("Login form", () => {
    beforeEach(() => {
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);

        vi.clearAllMocks();
    });

    const renderForm = () => renderWithContext({ children: <LoginForm /> });

    it("AB#149 - should render the form fields", () => {
        renderForm();

        const fieldLabels = ["Email or Username", "Password", "Log In"];

        fieldLabels.forEach((label) => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });
    });
});
