import CostAveragingReturnsCard from "./CostAveragingReturnsCard";
import CostAveragingSimulatorChart from "./CostAveragingSimulatorChart";
import CostAveragingSimulatorForm from "./CostAveragingSimulatorForm";
import { useCostAveragingSimulator } from "./useCostAveragingSimulator";

const CostAveragingSimulator = () => {
    const {
        mutate: executeSimulation,
        reset: resetSimulation,
        isPending,
        data,
    } = useCostAveragingSimulator();

    return (
        <div className="flex flex-col gap-y-2.5">
            <div className="font-medium text-4xl leading-14 text-primary-dark">
                {"See cost averaging in action"}
            </div>
            <div className="flex flex-row gap-x-5">
                <CostAveragingSimulatorForm
                    executeSimulation={executeSimulation}
                    resetSimulation={resetSimulation}
                    isPending={isPending}
                />
                <div className="flex flex-col w-full h-full gap-y-2.5">
                    <CostAveragingSimulatorChart
                        data={data?.results ?? []}
                        isLoading={isPending}
                    />
                    <CostAveragingReturnsCard
                        returns={data?.returns}
                        isLoading={isPending}
                    />
                </div>
            </div>
        </div>
    );
};

export default CostAveragingSimulator;
