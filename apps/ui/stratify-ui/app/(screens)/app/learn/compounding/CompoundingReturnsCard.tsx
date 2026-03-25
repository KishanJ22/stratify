import SimulationReturnItem from "../components/SimulationReturnItem";
import { CompoundingSimulatorSuccessResponse } from "./useCompoundingSimulator";

export interface CompoundingReturnsCardProps {
    returns?: CompoundingSimulatorSuccessResponse["data"]["returns"];
    isLoading: boolean;
}

const CompoundingReturnsCard = ({
    returns,
    isLoading,
}: CompoundingReturnsCardProps) => {
    return (
        <div className="flex flex-row w-full justify-between py-2.5 px-3 rounded-xl bg-primary-lightest border border-primary-light">
            <SimulationReturnItem
                title="No compounding"
                badgeColour="var(--accent-base)"
                returnDetails={returns?.noCompounding}
                isLoading={isLoading}
            />
            <SimulationReturnItem
                title="Compounding"
                badgeColour="var(--secondary-base)"
                returnDetails={returns?.compounding}
                isLoading={isLoading}
            />

            <SimulationReturnItem
                title="Compounding with dividends"
                badgeColour="var(--primary-base)"
                returnDetails={returns?.compoundingWithDividends}
                isLoading={isLoading}
            />
        </div>
    );
};

export default CompoundingReturnsCard;
