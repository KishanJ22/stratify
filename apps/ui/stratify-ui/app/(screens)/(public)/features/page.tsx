import {
    BadgeInfo,
    BookOpenText,
    ChartColumnIncreasing,
    ChartNoAxesCombined,
    Flame,
} from "lucide-react";
import FeatureCard from "./FeatureCard";
import { useTranslations } from "next-intl";

export default function FeaturesPage() {
    const translate = useTranslations("Features");

    return (
        <div className="h-full px-10">
            <div className="font-sans text-5xl text-primary-base font-semibold">
                {translate("title")}
            </div>
            <div className="flex flex-col gap-y-5 mt-10">
                <FeatureCard
                    title={translate("manageInvestments.title")}
                    icon={
                        <ChartColumnIncreasing
                            size={20}
                            data-testid="manage-investments-icon"
                        />
                    }
                    description={translate("manageInvestments.description")}
                />
                <FeatureCard
                    title={translate("monitorPortfolios.title")}
                    icon={
                        <ChartNoAxesCombined
                            size={20}
                            data-testid="monitor-portfolios-icon"
                        />
                    }
                    description={translate("monitorPortfolios.description")}
                />
                <FeatureCard
                    title={translate("discoverTrendingAssets.title")}
                    icon={
                        <Flame
                            size={20}
                            data-testid="discover-trending-assets-icon"
                        />
                    }
                    description={translate(
                        "discoverTrendingAssets.description",
                    )}
                />
                <FeatureCard
                    title={translate("viewDetailedAssetInfo.title")}
                    icon={
                        <BadgeInfo
                            size={20}
                            data-testid="view-detailed-asset-info-icon"
                        />
                    }
                    description={translate("viewDetailedAssetInfo.description")}
                />
                <FeatureCard
                    title={translate("learnInvestingStrategies.title")}
                    icon={
                        <BookOpenText
                            size={20}
                            data-testid="learn-investing-strategies-icon"
                        />
                    }
                    description={translate(
                        "learnInvestingStrategies.description",
                    )}
                />
            </div>
        </div>
    );
}
