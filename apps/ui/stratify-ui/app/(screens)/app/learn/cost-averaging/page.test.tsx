import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithContext } from "@/app/tests/utils";
import CostAveragingPage from "./page";

describe("Learn Cost Averaging page", () => {
	const renderPage = () =>
		renderWithContext({ children: <CostAveragingPage /> });

	it("should render the page successfully", () => {
		renderPage();

		const subHeadings = [
			"Cost Averaging",
			"What is cost averaging?",
			"Why does cost averaging matter?",
			"See cost averaging in action",
		];

		subHeadings.forEach((heading) => {
			expect(screen.getByText(heading)).toBeInTheDocument();
		});
	});
});
