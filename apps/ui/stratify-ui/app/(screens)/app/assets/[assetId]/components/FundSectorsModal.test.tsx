import { beforeEach, describe, expect, it, vi } from "vitest";
import FundSectorsModal, { FundSectorsModalProps } from "./FundSectorsModal";
import { mockFundAssetDetails } from "../_mocks/mockFundAssetDetails";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en/messages.json";

const user = userEvent.setup();

const mockHandleClose = vi.fn();

const defaultProps = {
    sectors: mockFundAssetDetails.sector,
    isOpen: true,
    handleClose: mockHandleClose,
} satisfies FundSectorsModalProps;

describe("FundSectorsModal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderComponent = (props?: Partial<FundSectorsModalProps>) =>
        render(
            <NextIntlClientProvider locale="en" messages={messages}>
                <FundSectorsModal {...defaultProps} {...props} />
            </NextIntlClientProvider>,
        );

    it("should render the modal with a list of sectors and their percentage allocation", () => {
        renderComponent();

        expect(screen.getByText("Fund Sectors")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Below is a list of sectors that this fund invests in along with their percentage allocation within the fund.",
            ),
        ).toBeInTheDocument();

        expect(screen.getByText("Sector")).toBeInTheDocument();
        expect(screen.getByText("Allocation")).toBeInTheDocument();

        const sectors = ["Technology", "Communication Services", "Energy"];
        const allocations = ["0.95%", "0.03%", "0.02%"];

        sectors.forEach((sector) => {
            expect(screen.getByText(sector)).toBeInTheDocument();
        });

        allocations.forEach((allocation) => {
            expect(screen.getByText(allocation)).toBeInTheDocument();
        });
    });

    it("should call handleClose when the close icon is pressed", async () => {
        renderComponent();

        const closeIcon = screen.getByTestId("close-modal-icon");
        expect(closeIcon).toBeInTheDocument();

        await user.click(closeIcon);
        expect(mockHandleClose).toHaveBeenCalledTimes(1);
    });
});
