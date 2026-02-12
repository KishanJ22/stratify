import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { ButtonProps } from "../ui/button";

interface SubmitButtonProps {
    label: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    className?: string;
    variant?: ButtonProps["variant"];
}

const SubmitButton = ({
    label,
    isDisabled,
    isLoading,
    className,
    variant = "secondary",
}: SubmitButtonProps) => {
    return (
        <Button
            type="submit"
            variant={variant}
            disabled={isDisabled}
            className={className}
        >
            <div className="flex flex-row gap-x-2 items-center">
                {isLoading && <Spinner />}
                {label}
            </div>
        </Button>
    );
};

export default SubmitButton;
