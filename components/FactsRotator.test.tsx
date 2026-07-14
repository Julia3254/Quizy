import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { FactsRotator } from "./FactsRotator";
import { AI_FACTS } from "@/data/facts";

describe("FactsRotator", () => {
  it("renders first fact", () => {
    render(<FactsRotator />);
    expect(screen.getByText(AI_FACTS[0])).toBeInTheDocument();
  });

  it("renders compact variant", () => {
    render(<FactsRotator compact />);
    expect(screen.getByText(/ciekawostka/i)).toBeInTheDocument();
  });
});
