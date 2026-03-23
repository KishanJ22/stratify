import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import AssetNameCard from "./AssetNameCard";
import { mockSearchAsset } from "../../../markets/AssetSearch/_mocks/mockAssetSearch";

const mockOnSelect = vi.fn();

describe("AssetNameCard", () => {
    const renderComponent = () =>
        render(
            <AssetNameCard asset={mockSearchAsset} onSelect={mockOnSelect} />,
        );

    it("renders asset name card successfully", () => {
        renderComponent();

        expect(
            screen.getByText(
                `${mockSearchAsset.name} (${mockSearchAsset.symbol})`,
            ),
        ).toBeInTheDocument();

        expect(screen.getByText("Stock")).toBeInTheDocument();
    });

    it("should call onSelect when the card is clicked", () => {
        renderComponent();

        const card = screen.getByTestId("asset-name-card");
        card.click();

        expect(mockOnSelect).toHaveBeenCalled();
    });
});
