"use client";

import Link from "next/link";
import { Button } from "../../ui/button";
import { useTranslations } from "next-intl";

const CallToAction = () => {
    const translate = useTranslations("LandingPage");

    return (
        <section className="font-sans flex flex-col px-16 items-center text-center gap-6 py-16">
            <div className="flex flex-col gap-y-8 items-center">
                <div className="text-primary-base font-bold text-6xl leading-tight">
                    <span className="block">
                        {translate("callToAction.allOfYourInvestments")}
                    </span>
                    <span className="block">
                        {translate("callToAction.onePlace")}
                    </span>
                </div>
                <div className="w-6xl font-medium text-primary-dark text-2xl leading-10">
                    {translate("callToAction.description")}
                </div>
            </div>
            <div className="flex flex-row gap-x-4 pt-12">
                <Link href="/sign-up">
                    <Button variant="default" size="lg">
                        {translate("getStarted")}
                    </Button>
                </Link>
                <Link href="/features">
                    <Button variant="primaryLighter" size="lg">
                        {translate("learnMore")}
                    </Button>
                </Link>
            </div>
        </section>
    );
};

export default CallToAction;
