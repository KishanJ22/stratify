// Source - https://stackoverflow.com/a
// Posted by Jasperan, modified by community. See post 'Timeline' for change history
// Retrieved 2026-01-27, License - CC BY-SA 4.0

import { vi } from "vitest";

// required mocks to open Shadcn Select component
export class MockPointerEvent extends Event {
    button: number | undefined;
    ctrlKey: boolean | undefined;

    constructor(type: string, props: PointerEventInit | undefined) {
        super(type, props);
        if (props) {
            if (props.button != null) {
                this.button = props.button;
            }
            if (props.ctrlKey != null) {
                this.ctrlKey = props.ctrlKey;
            }
        }
    }
}
window.PointerEvent = MockPointerEvent as any;
window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();
