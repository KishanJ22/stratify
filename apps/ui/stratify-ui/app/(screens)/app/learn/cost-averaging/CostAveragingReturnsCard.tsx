import SimulationReturnItem from "../components/SimulationReturnItem";
import type { CostAveragingSimulatorSuccessResponse } from "./useCostAveragingSimulator";

export interface CostAveragingReturnsCardProps {
    returns?: CostAveragingSimulatorSuccessResponse["data"]["returns"];
    isLoading: boolean;
}

const CostAveragingReturnsCard = ({
    returns,
    isLoading,
}: CostAveragingReturnsCardProps) => {
    return (
        <div className="flex flex-row w-full justify-between py-2.5 px-3 rounded-xl bg-primary-lightest border border-primary-light">
            <SimulationReturnItem
                title="Cost averaging"
                badgeColour="var(--secondary-base)"
                returnDetails={returns?.costAveraging}
                isLoading={isLoading}
            />

            <SimulationReturnItem
                title="Lump sum"
                badgeColour="var(--primary-base)"
                returnDetails={returns?.lumpSum}
                isLoading={isLoading}
            />
        </div>
    );
};

export default CostAveragingReturnsCard;
