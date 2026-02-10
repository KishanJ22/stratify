interface KeyFeatureProps {
    title: string;
    description: string;
}

const KeyFeature = ({ title, description }: KeyFeatureProps) => {
    return (
        <div className="flex-1 bg-secondary-lightest rounded-lg border-t-2 border-secondary-base">
            <div className="flex flex-col gap-y-2 pt-3 px-4 pb-4">
                <div className="font-semibold text-2xl text-secondary-darkest">
                    {title}
                </div>
                <div className="font-medium text-sm text-secondary-dark">
                    {description}
                </div>
            </div>
        </div>
    );
};

export default KeyFeature;
