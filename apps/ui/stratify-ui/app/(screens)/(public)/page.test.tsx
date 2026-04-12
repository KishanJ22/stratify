import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import LandingPage from "./page";
import userEvent from "@testing-library/user-event";
import { mockNextLink } from "@/app/tests/_mocks/mockNextLink";
import { NextIntlClientProvider } from "next-intl";

mockNextLink();

const user = userEvent.setup();

describe("Landing page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderPage = () =>
        render(
            <NextIntlClientProvider locale="en" messages={{}}>
                <LandingPage />
            </NextIntlClientProvider>,
        );

    it("AB#127 - should display the call to action", () => {
        renderPage();

        expect(
            screen.getByText("LandingPage.callToAction.allOfYourInvestments"),
        ).toBeInTheDocument();

        expect(
            screen.getByText("LandingPage.callToAction.onePlace"),
        ).toBeInTheDocument();

        expect(
            screen.getByText("LandingPage.callToAction.description"),
        ).toBeInTheDocument();
    });

    it("AB#128 - should direct to the sign up page when clicking on the Get Started button", async () => {
        renderPage();

        const signUpButton = screen.getByText("LandingPage.getStarted");
        expect(signUpButton).toBeInTheDocument();

        await user.click(signUpButton);
        expect(signUpButton.closest("a")).toHaveAttribute("href", "/sign-up");
    });

    it("should direct to the features page when clicking on the Learn More button", async () => {
        renderPage();

        const learnMoreButton = screen.getByText("LandingPage.learnMore");
        expect(learnMoreButton).toBeInTheDocument();

        await user.click(learnMoreButton);
        expect(learnMoreButton.closest("a")).toHaveAttribute(
            "href",
            "/features",
        );
    });

    it("AB#129 - should display the key features", () => {
        renderPage();

        const keyFeatureTitles = [
            "LandingPage.keyFeatures.realTimeTracking.title",
            "LandingPage.keyFeatures.interactiveLearning.title",
            "LandingPage.keyFeatures.goalTracking.title",
        ];

        keyFeatureTitles.forEach((title) => {
            expect(screen.getByText(title)).toBeInTheDocument();
        });

        const keyFeatureDescriptions = [
            "LandingPage.keyFeatures.realTimeTracking.description",
            "LandingPage.keyFeatures.interactiveLearning.description",
            "LandingPage.keyFeatures.goalTracking.description",
        ];

        keyFeatureDescriptions.forEach((description) => {
            expect(screen.getByText(description)).toBeInTheDocument();
        });
    });
});
