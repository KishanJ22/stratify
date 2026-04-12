import { ReactNode } from "react";

interface FeatureCardProps {
    title: string;
    icon: ReactNode;
    description: string;
}

const FeatureCard = ({ title, icon, description }: FeatureCardProps) => {
    return (
        <div className="flex flex-col font-sans gap-y-2.5 py-2.5 px-3 rounded-xl bg-primary-lightest border border-primary-base">
            <div className="flex flex-row items-center gap-x-1 text-secondary-base font-semibold text-xl leading-6">
                {icon}
                <span>{title}</span>
            </div>
            <div className="text-secondary-dark text-base leading-5">
                {description}
            </div>
        </div>
    );
};

export default FeatureCard;
