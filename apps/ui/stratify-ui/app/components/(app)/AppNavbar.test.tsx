import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { beforeEach, describe } from "vitest";
import AppNavbar from "./AppNavbar";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import userEvent from "@testing-library/user-event";
import { mockNextLink } from "@/app/tests/_mocks/mockNextLink";

const user = userEvent.setup();

// Mock Image component from next/image
vi.mock("next/image", () => ({
    default: (props: { alt?: string }) => <img alt={props.alt} />,
}));

mockNextLink();

describe("AppNavbar", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = () =>
        render(
            <MockSessionProvider>
                <AppNavbar />
            </MockSessionProvider>,
        );

    it("should render the navbar correctly", () => {
        renderComponent();

        expect(screen.getByAltText("Stratify Logo")).toBeInTheDocument();

        const navLinks = ["Dashboard", "Portfolios", "Markets", "Learn"];

        navLinks.forEach((link) => {
            expect(screen.getByText(link)).toBeInTheDocument();
        });
    });

    it("should render the user icon correctly", () => {
        renderComponent();

        expect(screen.getByTestId("user-icon")).toBeInTheDocument();
    });

    it("should open the user menu when clicking on the user icon", async () => {
        renderComponent();

        const userIcon = screen.getByTestId("user-icon");
        await user.click(userIcon);

        expect(screen.getByTestId("user-menu")).toBeInTheDocument();
        expect(screen.getByText("Test User")).toBeInTheDocument();
        expect(screen.getByText("Log out")).toBeInTheDocument();
    });
});
