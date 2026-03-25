interface LearnContentProps {
    title: string;
    textContent: string;
}

const LearnContent = ({ title, textContent }: LearnContentProps) => {
    return (
        <div className="flex flex-col gap-y-2.5 font-sans">
            <div className="font-medium text-4xl leading-14 text-primary-dark">
                {title}
            </div>
            <div className="text-2xl leading-6 text-secondary-base">
                {textContent}
            </div>
        </div>
    );
};

export default LearnContent;
