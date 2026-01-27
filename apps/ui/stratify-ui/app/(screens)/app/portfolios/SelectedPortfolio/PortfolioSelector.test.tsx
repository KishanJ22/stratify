import { beforeEach, describe, expect, it, vi } from "vitest";
import PortfolioSelector, { PortfolioSelectorProps } from "./PortfolioSelector";
import { fireEvent, render, screen } from "@testing-library/react";
import { MockPointerEvent } from "@/app/tests/_mocks/MockPointerEvent";

const defaultPortfolioSelectorProps = {
    portfolioList: [
        { id: 1, name: "Portfolio 1" },
        { id: 2, name: "Portfolio 2" },
    ],
    isLoading: false,
} satisfies PortfolioSelectorProps;

describe("PortfolioSelector", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (props: PortfolioSelectorProps) =>
        render(<PortfolioSelector {...props} />);

    it("should render the portfolio selector button", () => {
        renderComponent(defaultPortfolioSelectorProps);

        const selectButton = screen.getByText("Select a portfolio");

        expect(selectButton).toBeInTheDocument();
    });

    it("should render the portfolio options when clicking on the selector", async () => {
        renderComponent(defaultPortfolioSelectorProps);

        const selectButton = screen.getByText("Select a portfolio");
        fireEvent.click(
            selectButton,
            new MockPointerEvent("pointerdown", { button: 0 }),
        );

        expect(await screen.findByText("Portfolio 1")).toBeInTheDocument();
        expect(await screen.findByText("Portfolio 2")).toBeInTheDocument();
    });

    it("should disable the selector when the user has no portfolios", () => {
        renderComponent({
            portfolioList: [],
            isLoading: false,
        });

        const selectButton = screen.getByText("Create a portfolio");

        fireEvent.click(
            selectButton,
            new MockPointerEvent("pointerdown", { button: 0 }),
        );

        expect(screen.queryByText("Portfolio 1")).not.toBeInTheDocument();
        expect(screen.queryByText("Portfolio 2")).not.toBeInTheDocument();
    });

    it("should show a loading skeleton when portfolios are loading", () => {
        renderComponent({
            portfolioList: [],
            isLoading: true,
        });

        const skeleton = screen.getByTestId("loading-skeleton");
        expect(skeleton).toBeInTheDocument();
    });

    it("should set the chosen portfolio as the selected value", async () => {
        renderComponent(defaultPortfolioSelectorProps);

        const selectButton = screen.getByText("Select a portfolio");
        fireEvent.click(
            selectButton,
            new MockPointerEvent("pointerdown", { button: 0 }),
        );

        expect(await screen.findByText("Portfolio 1")).toBeInTheDocument();
        expect(await screen.findByText("Portfolio 2")).toBeInTheDocument();

        fireEvent.click(screen.getByText("Portfolio 2"));

        const updatedSelectButton = screen.getByTestId(
            "portfolio-select-value",
        );

        expect(updatedSelectButton).toHaveTextContent("Portfolio 2");
    });
});
