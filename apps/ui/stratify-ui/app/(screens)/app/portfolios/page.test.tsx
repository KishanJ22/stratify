import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PortfoliosPage from "./page";
import { renderWithContext } from "@/app/tests/utils";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";
import { TooltipProvider } from "@/app/components/ui/tooltip";

describe("Portfolios page", () => {
    const renderPage = () =>
        renderWithContext({
            children: (
                <MockSessionProvider>
                    <TooltipProvider>
                        <PortfoliosPage />
                    </TooltipProvider>
                </MockSessionProvider>
            ),
        });

    it("should render the portfolios page", () => {
        renderPage();

        expect(screen.getByText("Portfolios")).toBeInTheDocument();
        expect(screen.getByText("Investments")).toBeInTheDocument();
    });
});
