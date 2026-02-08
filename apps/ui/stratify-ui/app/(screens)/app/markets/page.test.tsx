import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import MarketsPage from "./page";
import { renderWithContext } from "@/app/tests/utils";

describe("MarketPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderPage = () => renderWithContext({ children: <MarketsPage /> });

    it("should render the page correctly", () => {
        renderPage();

        expect(screen.getByText("Markets")).toBeInTheDocument();
    });
});
