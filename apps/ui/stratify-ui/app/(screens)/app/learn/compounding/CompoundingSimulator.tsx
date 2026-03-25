import { useCompoundingSimulator } from "./useCompoundingSimulator";
import CompoundingSimulatorChart from "./CompoundingSimulatorChart";
import CompoundingReturnsCard from "./CompoundingReturnsCard";
import CompoundingSimulatorForm from "./CompoundingSimulatorForm";

const CompoundingSimulator = () => {
    const {
        mutate: executeSimulation,
        reset: resetSimulation,
        isPending,
        data,
    } = useCompoundingSimulator();

    return (
        <div className="flex flex-col gap-y-2.5">
            <div className="font-medium text-4xl leading-14 text-primary-dark">
                {"See compounding in action"}
            </div>
            <div className="flex flex-row gap-x-5">
                <CompoundingSimulatorForm
                    executeSimulation={executeSimulation}
                    resetSimulation={resetSimulation}
                    isPending={isPending}
                />
                <div className="flex flex-col w-full h-full gap-y-2.5">
                    <CompoundingSimulatorChart
                        data={data?.results ?? []}
                        isLoading={isPending}
                    />
                    <CompoundingReturnsCard
                        returns={data?.returns}
                        isLoading={isPending}
                    />
                </div>
            </div>
        </div>
    );
};

export default CompoundingSimulator;
