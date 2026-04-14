"use client";

import { ProgressProvider as BProgressProvider } from "@bprogress/next/app";

const ProgressProvider = ({ children }: { children: React.ReactNode }) => (
    <BProgressProvider height="4px" color="#2BB4B4" shallowRouting startOnLoad>
        {children}
    </BProgressProvider>
);

export default ProgressProvider;
