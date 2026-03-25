import { renderWithContext } from "@/app/tests/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CompoundingSimulatorForm, {
    CompoundingSimulatorFormProps,
} from "./CompoundingSimulatorForm";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockSearchAsset } from "../../markets/AssetSearch/_mocks/mockAssetSearch";

const mockExecuteSimulation = vi.fn();

const mockResetSimulation = vi.fn();

const mockUseAssetSearch = {
    searchResults: [mockSearchAsset],
    search: vi.fn(),
    isSearching: false,
    searchStatus: "success",
    resetSearch: vi.fn(),
};

vi.mock("../../markets/AssetSearch/useAssetSearch", () => ({
    useAssetSearch: () => mockUseAssetSearch,
}));

const defaultProps = {
    executeSimulation: mockExecuteSimulation,
    resetSimulation: mockResetSimulation,
    isPending: false,
} satisfies CompoundingSimulatorFormProps;

const user = userEvent.setup();

describe("CompoundingSimulatorForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (props?: Partial<CompoundingSimulatorFormProps>) =>
        renderWithContext({
            children: <CompoundingSimulatorForm {...defaultProps} {...props} />,
        });

    it("should render the form correctly", () => {
        renderComponent();

        const fieldLabels = [
            "Simulate with",
            "Initial Investment",
            "Monthly Contribution",
            "Time Period (Years)",
            "Annual Dividend Yield",
        ];

        fieldLabels.forEach((label) => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });
    });

    it("should render the default values correctly", () => {
        renderComponent();

        const fieldTestIds = [
            "initial-investment-field",
            "monthly-contribution-field",
            "time-period-years-field",
        ];

        fieldTestIds.forEach((testId) => {
            within(screen.getByTestId(testId)).getByDisplayValue("0");
        });
    });

    it("should render the submit button", () => {
        renderComponent();

        expect(screen.getByText("Simulate")).toBeInTheDocument();
    });

    it("should submit the form successfully with valid inputs", async () => {
        mockUseAssetSearch.searchStatus = "success";

        renderComponent();

        await user.click(
            screen.getByPlaceholderText(
                "Search for an asset by name or symbol",
            ),
        );

        await user.click(screen.getByTestId("asset-name-card"));

        const initialInvestmentInput = within(
            screen.getByTestId("initial-investment-field"),
        ).getByDisplayValue("0");
        await user.clear(initialInvestmentInput);
        await user.type(initialInvestmentInput, "10000");

        const monthlyContributionInput = within(
            screen.getByTestId("monthly-contribution-field"),
        ).getByDisplayValue("0");
        await user.clear(monthlyContributionInput);
        await user.type(monthlyContributionInput, "500");

        const timePeriodInput = within(
            screen.getByTestId("time-period-years-field"),
        ).getByDisplayValue("0");
        await user.clear(timePeriodInput);
        await user.type(timePeriodInput, "20");

        const dividendYieldInput = within(
            screen.getByTestId("annual-dividend-yield-field"),
        ).getByPlaceholderText("Optional");
        await user.clear(dividendYieldInput);
        await user.type(dividendYieldInput, "5");

        await user.click(screen.getByText("Simulate"));

        expect(mockExecuteSimulation).toHaveBeenCalledWith(
            {
                assetId: 1,
                initialInvestment: 10000,
                monthlyContribution: 500,
                timePeriodYears: 20,
                dividendYield: 5,
            },
            {
                onError: expect.any(Function),
            },
        );
    });

    it("should reset the form and call resetSimulation when clicking the clear button", async () => {
        mockUseAssetSearch.searchStatus = "success";

        renderComponent();

        await user.click(
            screen.getByPlaceholderText(
                "Search for an asset by name or symbol",
            ),
        );

        await user.click(screen.getByTestId("asset-name-card"));

        const initialInvestmentInput = within(
            screen.getByTestId("initial-investment-field"),
        ).getByDisplayValue("0");
        await user.clear(initialInvestmentInput);
        await user.type(initialInvestmentInput, "10000");

        const monthlyContributionInput = within(
            screen.getByTestId("monthly-contribution-field"),
        ).getByDisplayValue("0");
        await user.clear(monthlyContributionInput);
        await user.type(monthlyContributionInput, "500");

        const timePeriodInput = within(
            screen.getByTestId("time-period-years-field"),
        ).getByDisplayValue("0");
        await user.clear(timePeriodInput);
        await user.type(timePeriodInput, "20");

        const dividendYieldInput = within(
            screen.getByTestId("annual-dividend-yield-field"),
        ).getByPlaceholderText("Optional");
        await user.clear(dividendYieldInput);
        await user.type(dividendYieldInput, "5");

        expect(screen.getByDisplayValue("10000")).toBeInTheDocument();
        expect(screen.getByDisplayValue("500")).toBeInTheDocument();
        expect(screen.getByDisplayValue("20")).toBeInTheDocument();
        expect(screen.getByDisplayValue("5")).toBeInTheDocument();

        await user.click(screen.getByText("Clear"));

        expect(mockResetSimulation).toHaveBeenCalled();

        expect(screen.getAllByDisplayValue("0")).toHaveLength(3);
    });

    it("should disable the simulate button when isPending is true", () => {
        renderComponent({ isPending: true });

        expect(
            screen.getByTestId("submit-button-disabled"),
        ).toBeInTheDocument();
    });

    it("should display a loading spinner when isPending is true", () => {
        renderComponent({ isPending: true });

        const submitButton = screen.getByText("Simulate");

        expect(within(submitButton).getByRole("status")).toBeInTheDocument();
    });

    it("should disable the simulate button when the form is invalid", async () => {
        renderComponent();

        const initialInvestmentInput = within(
            screen.getByTestId("initial-investment-field"),
        ).getByDisplayValue("0");
        await user.clear(initialInvestmentInput);
        await user.type(initialInvestmentInput, "-100");

        expect(
            screen.getByTestId("submit-button-disabled"),
        ).toBeInTheDocument();
    });
});
