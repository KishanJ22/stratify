import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithContext } from "@/app/tests/utils";
import CompoundingPage from "./page";

describe("Learn Compounding page", () => {
	const renderPage = () =>
		renderWithContext({ children: <CompoundingPage /> });

	it("should render the page successfully", () => {
		renderPage();

		expect(screen.getAllByText("Compounding")).toHaveLength(2);

		const subHeadings = [
			"What is compounding?",
			"Why does compounding matter?",
			"See compounding in action",
		];

		subHeadings.forEach((heading) => {
			expect(screen.getByText(heading)).toBeInTheDocument();
		});
	});
});
