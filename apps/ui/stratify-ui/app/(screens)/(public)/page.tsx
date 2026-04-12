import { useTranslations } from "next-intl";
import CallToAction from "../../components/(public)/LandingPage/CallToAction";
import KeyFeature from "../../components/(public)/LandingPage/KeyFeature";

export default function LandingPage() {
    const translate = useTranslations("LandingPage.keyFeatures");
    return (
        <div className="font-sans items-center justify-items-center h-full">
            <CallToAction />
            <div className="flex flex-row py-8 px-16 gap-x-12">
                <KeyFeature
                    title={translate("realTimeTracking.title")}
                    description={translate("realTimeTracking.description")}
                />
                <KeyFeature
                    title={translate("interactiveLearning.title")}
                    description={translate("interactiveLearning.description")}
                />
                <KeyFeature
                    title={translate("goalTracking.title")}
                    description={translate("goalTracking.description")}
                />
            </div>
        </div>
    );
}
