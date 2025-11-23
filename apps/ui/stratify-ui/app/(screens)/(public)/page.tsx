import CallToAction from "../../components/LandingPage/CallToAction";
import KeyFeature from "../../components/LandingPage/KeyFeature";

export default function LandingPage() {
    return (
        <div className="font-sans items-center justify-items-center min-h-screen">
            <CallToAction />
            <div className="flex flex-row py-8 px-16 gap-x-12">
                <KeyFeature
                    title="Real-time Portfolio Tracking"
                    description="Monitor and analyse all of your stock and cryptocurrency holdings in one place with live updates and intuitive performance metrics."
                />
                <KeyFeature
                    title="Trading Simulator"
                    description="Practice trading in realistic market scenarios without risking real money. Learn by doing, build confidence through personal feedback."
                />
                <KeyFeature
                    title="Stratify Learn"
                    description="Discover core concepts and real-world scenarios that help build practical investing skills through interactive and bite-sized lessons."
                />
            </div>
        </div>
    );
}
