import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FeaturesPage from "./page";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en/messages.json";

describe("Features page", () => {
    const renderPage = () =>
        render(
            <NextIntlClientProvider locale="en" messages={{}}>
                <FeaturesPage />
            </NextIntlClientProvider>,
        );

    it("should render the features page", () => {
        renderPage();

        expect(screen.getByText("Features.title")).toBeInTheDocument();

        const cardTitles = [
            "Features.manageInvestments.title",
            "Features.monitorPortfolios.title",
            "Features.discoverTrendingAssets.title",
            "Features.viewDetailedAssetInfo.title",
            "Features.learnInvestingStrategies.title",
        ];

        cardTitles.forEach((title) => {
            expect(screen.getByText(title)).toBeInTheDocument();
        });

        const cardDescriptions = [
            "Features.manageInvestments.description",
            "Features.monitorPortfolios.description",
            "Features.discoverTrendingAssets.description",
            "Features.viewDetailedAssetInfo.description",
            "Features.learnInvestingStrategies.description",
        ];

        cardDescriptions.forEach((description) => {
            expect(screen.getByText(description)).toBeInTheDocument();
        });

        const iconTestIds = [
            "manage-investments-icon",
            "monitor-portfolios-icon",
            "discover-trending-assets-icon",
            "view-detailed-asset-info-icon",
            "learn-investing-strategies-icon",
        ];

        iconTestIds.forEach((testId) => {
            expect(screen.getByTestId(testId)).toBeInTheDocument();
        });
    });
});
