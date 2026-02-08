import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-sans font-semibold",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary-lighter text-primary-darker shadow",
                secondary:
                    "border-transparent bg-secondary-lighter text-secondary-darker shadow",
                destructive:
                    "border-transparent bg-negative-base text-negative-lightest shadow",
                outline: "text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

export interface BadgeProps
    extends
        React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
