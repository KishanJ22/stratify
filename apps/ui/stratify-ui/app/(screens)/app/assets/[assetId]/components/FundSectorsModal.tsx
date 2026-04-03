import { AssetDetails } from "../hooks/useAssetDetails";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/app/components/ui/dialog";
import { X } from "lucide-react";

interface FundSectorsModalProps {
    sectors: AssetDetails["sector"];
    isOpen: boolean;
    handleClose: () => void;
}

const FundSectorsModal = ({
    sectors,
    isOpen,
    handleClose,
}: FundSectorsModalProps) => {
    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="bg-muted-lightest border border-primary-base font-sans">
                <DialogHeader>
                    <div className="flex flex-row items-center justify-between">
                        <DialogTitle className="font-medium text-lg leading-7 text-secondary-darker">
                            Fund Sectors
                        </DialogTitle>
                        <X
                            size={20}
                            className="cursor-pointer text-muted-dark hover:text-primary-darker transition-colors"
                            onClick={() => handleClose()}
                            data-testid="close-modal-icon"
                        />
                    </div>
                </DialogHeader>
                <DialogDescription className="text-secondary-base leading-5">
                    Below is a list of sectors that this fund invests in along
                    with their percentage allocation within the fund.
                </DialogDescription>
                <div className="mt-2.5 flex flex-col gap-y-2">
                    <div className="flex flex-row justify-between font-semibold text-secondary-dark text-lg leading-6 border-b border-b-secondary-lighter pb-1">
                        <div>Sector</div>
                        <div>Allocation</div>
                    </div>
                    {sectors?.map((sector) => (
                        <div
                            key={sector.sector}
                            className="flex flex-row justify-between font-medium text-secondary-base text-lg leading-6"
                        >
                            <div>{sector.sector}</div>
                            <div>{`${sector.weight?.toFixed(2)}%`}</div>
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default FundSectorsModal;
