import Image from "next/image";

interface StratifyIconProps {
    width?: number;
    height?: number;
    className?: string;
}

const StratifyIcon = ({ width, height, className }: StratifyIconProps) => (
    <Image
        src="/stratify.png"
        alt="Stratify Logo"
        className={`object-cover ${className}`}
        width={width}
        height={height}
    />
);

export default StratifyIcon;
