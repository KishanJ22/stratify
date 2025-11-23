import "@testing-library/jest-dom";
import "@testing-library/jest-dom/vitest";

import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
    cleanup();
});

// Fix for ResizeObserver not being defined in the test environment
const mockResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
};

vi.stubGlobal("ResizeObserver", mockResizeObserver);
