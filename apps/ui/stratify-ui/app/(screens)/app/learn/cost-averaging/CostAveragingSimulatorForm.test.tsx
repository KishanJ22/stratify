import { renderWithContext } from "@/app/tests/utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import CostAveragingSimulatorForm, {
    CostAveragingSimulatorFormProps,
} from "./CostAveragingSimulatorForm";
import { screen, waitFor, within } from "@testing-library/react";
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
} satisfies CostAveragingSimulatorFormProps;

const user = userEvent.setup();

describe("CostAveragingSimulatorForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (
        props?: Partial<CostAveragingSimulatorFormProps>,
    ) =>
        renderWithContext({
            children: (
                <CostAveragingSimulatorForm {...defaultProps} {...props} />
            ),
        });

    it("should render the form correctly", () => {
        renderComponent();

        const fieldLabels = [
            "Simulate with",
            "Total Investment",
            "Contribution Frequency",
            "Time Period (Years)",
            "Amount per Month",
        ];

        fieldLabels.forEach((label) => {
            expect(screen.getByText(label)).toBeInTheDocument();
        });
    });

    it("should render the default values correctly", () => {
        renderComponent();

        const fieldTestIds = [
            "total-investment-field",
            "time-period-years-field",
            "amount-per-contribution-field",
        ];

        fieldTestIds.forEach((testId) => {
            within(screen.getByTestId(testId)).getByDisplayValue("0");
        });

        expect(
            within(
                screen.getByTestId("contribution-frequency-select-value"),
            ).getByText("Monthly"),
        ).toBeInTheDocument();
    });

    it("should render teh submit button", () => {
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

        const totalInvestmentInput = within(
            screen.getByTestId("total-investment-field"),
        ).getByDisplayValue("0");
        await user.clear(totalInvestmentInput);
        await user.type(totalInvestmentInput, "12000");

        const timePeriodInput = within(
            screen.getByTestId("time-period-years-field"),
        ).getByDisplayValue("0");
        await user.clear(timePeriodInput);
        await user.type(timePeriodInput, "2");
        await user.tab();

        await waitFor(() =>
            expect(
                screen.getByTestId("submit-button-enabled"),
            ).toBeInTheDocument(),
        );

        await user.click(screen.getByText("Simulate"));

        expect(mockExecuteSimulation).toHaveBeenCalledWith(
            {
                assetId: 1,
                totalInvestment: 12000,
                contributionFrequency: "monthly",
                timePeriodYears: 2,
                amountPerContribution: 500,
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

        const totalInvestmentInput = within(
            screen.getByTestId("total-investment-field"),
        ).getByDisplayValue("0");
        await user.clear(totalInvestmentInput);
        await user.type(totalInvestmentInput, "12000");

        const timePeriodInput = within(
            screen.getByTestId("time-period-years-field"),
        ).getByDisplayValue("0");
        await user.clear(timePeriodInput);
        await user.type(timePeriodInput, "2");
        await user.tab();

        const displayValues = ["12000", "2", "500", "Monthly"];

        displayValues.forEach((value) => {
            expect(screen.getAllByDisplayValue(value)).toHaveLength(1);
        });

        await user.click(screen.getByText("Clear"));

        expect(mockResetSimulation).toHaveBeenCalled();
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

        const totalInvestmentInput = within(
            screen.getByTestId("total-investment-field"),
        ).getByDisplayValue("0");
        await user.clear(totalInvestmentInput);
        await user.type(totalInvestmentInput, "-100");

        expect(
            screen.getByTestId("submit-button-disabled"),
        ).toBeInTheDocument();
    });
});
