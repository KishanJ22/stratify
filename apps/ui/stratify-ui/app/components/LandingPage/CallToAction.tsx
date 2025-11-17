import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

const CallToAction = () => {
    const { push } = useRouter();

    return (
        <section className="font-sans flex flex-col px-16 items-center text-center gap-6 py-16">
            <div className="flex flex-col gap-y-8 items-center">
                <div className="text-primary-base font-bold text-[64px] leading-tight">
                    <span className="block">All of your investments.</span>
                    <span className="block">One place.</span>
                </div>
                <div className="w-6xl font-medium text-primary-dark text-2xl">
                    {
                        "Track your stock and cryptocurrency holdings together in one platform. Learn to trade, monitor your investments and track your journey to financial freedom."
                    }
                </div>
            </div>
            <div className="flex flex-row gap-x-4 pt-12">
                <Button
                    variant="default"
                    size="lg"
                    onClick={() => push("/sign-up")}
                >
                    Get Started
                </Button>
                <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => push("/learn")}
                >
                    Learn More
                </Button>
            </div>
        </section>
    );
};

export default CallToAction;
