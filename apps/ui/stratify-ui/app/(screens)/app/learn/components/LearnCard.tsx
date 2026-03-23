import { Button } from "@/app/components/ui/button";
import { useRouter } from "next/navigation";

interface LearnCardProps {
    title: string;
    description: string;
    isComingSoon?: boolean;
    linkToPage?: string;
}

const LearnCard = ({
    title,
    description,
    linkToPage = "",
    isComingSoon = false,
}: LearnCardProps) => {
    const { push } = useRouter();
    return (
        <div className="flex flex-col gap-y-3 bg-primary-lightest font-sans rounded-xl border border-primary-light px-3 py-2.5">
            <div className="font-medium text-2xl leading-6 text-secondary-dark">
                {title}
            </div>
            <div className="text-secondary-base text-xl">{description}</div>
            <Button
                variant="secondary"
                disabled={isComingSoon}
                size="sm"
                className="self-start"
                onClick={() => push(linkToPage)}
                data-testid={
                    isComingSoon
                        ? "learn-card-button-disabled"
                        : "learn-card-button"
                }
            >
                {isComingSoon ? "Coming Soon" : "Open"}
            </Button>
        </div>
    );
};

export default LearnCard;
