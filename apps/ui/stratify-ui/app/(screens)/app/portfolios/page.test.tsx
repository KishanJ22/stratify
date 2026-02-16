import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PortfoliosPage from "./page";
import { renderWithContext } from "@/app/tests/utils";

describe("Portfolios page", () => {
    const renderPage = () =>
        renderWithContext({ children: <PortfoliosPage /> });

    it("should render the portfolios page", () => {
        renderPage();

        expect(screen.getByText("Portfolios")).toBeInTheDocument();
        expect(screen.getByText("Investments")).toBeInTheDocument();
    });
});
