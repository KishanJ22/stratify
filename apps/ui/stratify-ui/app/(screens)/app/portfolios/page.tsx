"use client";

import { useEffect, useRef, useState } from "react";
import CreatePortfolioButton from "./components/CreatePortfolio/CreatePortfolioButton";
import PortfolioSelector from "./components/SelectedPortfolio/PortfolioSelector";
import { usePortfolioList } from "./components/SelectedPortfolio/usePortfolioList";
import InvestmentsTable from "./components/InvestmentsTable/InvestmentsTable";
import AddInvestmentButton from "./components/AddInvestment/AddInvestmentButton";
import PortfolioValueChart from "./components/PortfolioValueChart/PortfolioValueChart";
import PortfolioMetrics from "./components/PortfolioMetrics/PortfolioMetrics";
import AssetAllocationCard from "./components/AssetAllocationCard/AssetAllocationCard";
import CreatePortfolioModal from "./components/CreatePortfolio/CreatePortfolioModal";
import { useSearchParams } from "next/navigation";
import ManagePortfolioButton from "./components/ManagePortfolio/ManagePortfolioButton";
import ManagePortfolioMenu from "./components/ManagePortfolio/ManagePortfolioMenu";
import RenamePortfolioModal from "./components/ManagePortfolio/RenamePortfolioModal";
import DeletePortfolioModal from "./components/ManagePortfolio/DeletePortfolioModal";
import { useTranslations } from "next-intl";

export default function PortfoliosPage() {
    const translate = useTranslations();
    const searchParams = useSearchParams();
    const createPortfolioParam = searchParams.get("createPortfolio");
    const portfolioIdParam = searchParams.get("portfolioId");

    const [isCreatePortfolioModalOpen, setIsCreatePortfolioModalOpen] =
        useState(createPortfolioParam === "true");

    const [selectedPortfolioId, setSelectedPortfolioId] = useState<
        number | null
    >(portfolioIdParam ? parseInt(portfolioIdParam) : null);
    const [selectedPortfolioName, setSelectedPortfolioName] =
        useState<string>("");

    const [isManagePortfolioMenuOpen, setIsManagePortfolioMenuOpen] =
        useState(false);
    const managePortfolioRef = useRef<HTMLDivElement>(null);

    const [isRenamePortfolioModalOpen, setIsRenamePortfolioModalOpen] =
        useState(false);

    const [isDeletePortfolioModalOpen, setIsDeletePortfolioModalOpen] =
        useState(false);

    const { data, isLoading } = usePortfolioList();

    useEffect(() => {
        if (data && data.length > 0) {
            if (!selectedPortfolioId) setSelectedPortfolioId(data[0].id);
            if (!selectedPortfolioName) setSelectedPortfolioName(data[0].name);
        }
    }, [data, selectedPortfolioId, selectedPortfolioName]);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (
                managePortfolioRef.current &&
                !managePortfolioRef.current.contains(event.target as Node)
            ) {
                setIsManagePortfolioMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <div className="min-h-screen px-10">
            <div className="font-sans text-5xl text-primary-base font-semibold w-full text-left">
                {translate("Portfolios.title")}
            </div>
            <div className="flex flex-row w-full mt-4">
                <div className="flex flex-col w-full">
                    <div className="flex flex-row">
                        <div className="flex flex-col">
                            <CreatePortfolioButton
                                setIsCreatePortfolioModalOpen={
                                    setIsCreatePortfolioModalOpen
                                }
                            />
                            <div className="mt-7 flex flex-col gap-y-2">
                                <div className="font-sans text-primary-base text-xl">
                                    {translate("Portfolios.selectedPortfolio")}
                                </div>
                                <div className="flex flex-row justify-between gap-x-2 items-center">
                                    <PortfolioSelector
                                        portfolioList={data}
                                        isLoading={isLoading}
                                        selectedPortfolioId={
                                            selectedPortfolioId
                                        }
                                        setSelectedPortfolioId={
                                            setSelectedPortfolioId
                                        }
                                        setSelectedPortfolioName={
                                            setSelectedPortfolioName
                                        }
                                    />
                                    <div
                                        className="relative"
                                        ref={managePortfolioRef}
                                    >
                                        <ManagePortfolioButton
                                            isManagePortfolioMenuOpen={
                                                isManagePortfolioMenuOpen
                                            }
                                            setIsManagePortfolioMenuOpen={
                                                setIsManagePortfolioMenuOpen
                                            }
                                            isLoading={isLoading}
                                        />
                                        <ManagePortfolioMenu
                                            isManagePortfolioMenuOpen={
                                                isManagePortfolioMenuOpen
                                            }
                                            setIsRenamePortfolioModalOpen={
                                                setIsRenamePortfolioModalOpen
                                            }
                                            setIsDeletePortfolioModalOpen={
                                                setIsDeletePortfolioModalOpen
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="ml-4 w-full">
                            <PortfolioValueChart
                                portfolioId={selectedPortfolioId}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col mt-2">
                        <div className="flex flex-row items-center justify-between">
                            <div className="font-sans text-3xl text-primary-base font-semibold">
                                {translate("Investments.title")}
                            </div>
                            <AddInvestmentButton
                                portfolioId={selectedPortfolioId}
                            />
                        </div>
                        <InvestmentsTable portfolioId={selectedPortfolioId} />
                    </div>
                </div>
                <div className="flex flex-col ml-10 mt-4 gap-y-5">
                    <PortfolioMetrics portfolioId={selectedPortfolioId} />
                    <AssetAllocationCard portfolioId={selectedPortfolioId} />
                </div>
                <CreatePortfolioModal
                    isOpen={isCreatePortfolioModalOpen}
                    handleClose={() => setIsCreatePortfolioModalOpen(false)}
                    setSelectedPortfolioId={setSelectedPortfolioId}
                    setSelectedPortfolioName={setSelectedPortfolioName}
                />
                <RenamePortfolioModal
                    isOpen={isRenamePortfolioModalOpen}
                    handleClose={() => setIsRenamePortfolioModalOpen(false)}
                    selectedPortfolioId={selectedPortfolioId}
                    selectedPortfolioName={selectedPortfolioName}
                    setSelectedPortfolioName={setSelectedPortfolioName}
                />
                <DeletePortfolioModal
                    isOpen={isDeletePortfolioModalOpen}
                    handleClose={() => setIsDeletePortfolioModalOpen(false)}
                    selectedPortfolioId={selectedPortfolioId}
                    selectedPortfolioName={selectedPortfolioName}
                    setSelectedPortfolioId={setSelectedPortfolioId}
                    setSelectedPortfolioName={setSelectedPortfolioName}
                />
            </div>
        </div>
    );
}
