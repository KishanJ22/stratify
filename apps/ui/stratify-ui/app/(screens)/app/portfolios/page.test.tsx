import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PortfoliosPage from "./page";
import { renderWithContext } from "@/app/tests/utils";
import MockSessionProvider from "@/app/tests/_mocks/MockSessionProvider";

describe("Portfolios page", () => {
    const renderPage = () =>
        renderWithContext({
            children: (
                <MockSessionProvider>
                    <PortfoliosPage />
                </MockSessionProvider>
            ),
        });

    it("should render the portfolios page", () => {
        renderPage();

        expect(screen.getByText("Portfolios")).toBeInTheDocument();
        expect(screen.getByText("Investments")).toBeInTheDocument();
    });
});
