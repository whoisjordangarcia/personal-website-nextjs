import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CreditsFooter from "./CreditsFooter";

describe("CreditsFooter", () => {
  it("renders the credits footer", () => {
    render(<CreditsFooter />);

    expect(screen.getByText(/Designed in/)).toBeInTheDocument();
  });

  it("renders Figma link with correct attributes", () => {
    render(<CreditsFooter />);

    const figmaLink = screen.getByText("Figma");
    expect(figmaLink).toHaveAttribute("href", "https://figma.com");
    expect(figmaLink).toHaveAttribute("target", "_blank");
    expect(figmaLink).toHaveClass("font-bold", "hover:underline");
  });

  it("renders Neovim link with correct attributes", () => {
    render(<CreditsFooter />);

    const neovimLink = screen.getByText("Neovim");
    expect(neovimLink).toHaveAttribute("href", "https://neovim.io");
    expect(neovimLink).toHaveAttribute("target", "_blank");
  });

  it("renders Next.js link with correct attributes", () => {
    render(<CreditsFooter />);

    const nextjsLink = screen.getByText("Next.js");
    expect(nextjsLink).toHaveAttribute("href", "https://nextjs.org");
    expect(nextjsLink).toHaveAttribute("target", "_blank");
  });

  it("renders Tailwind CSS link with correct attributes", () => {
    render(<CreditsFooter />);

    const tailwindLink = screen.getByText("Tailwind CSS");
    expect(tailwindLink).toHaveAttribute("href", "https://tailwindcss.com");
    expect(tailwindLink).toHaveAttribute("target", "_blank");
  });

  it("renders Vercel link with correct attributes", () => {
    render(<CreditsFooter />);

    const vercelLink = screen.getByText("Vercel");
    expect(vercelLink).toHaveAttribute("href", "https://vercel.com");
    expect(vercelLink).toHaveAttribute("target", "_blank");
  });

  it("renders Catppuccin link with correct attributes", () => {
    render(<CreditsFooter />);

    const catppuccinLink = screen.getByText("Catppuccin");
    expect(catppuccinLink).toHaveAttribute("href", "https://catppuccin.com");
    expect(catppuccinLink).toHaveAttribute("target", "_blank");
  });

  it("renders JetBrains Mono link with correct attributes", () => {
    render(<CreditsFooter />);

    const jetbrainsLink = screen.getByText("JetBrains Mono");
    expect(jetbrainsLink).toHaveAttribute(
      "href",
      "https://www.jetbrains.com/lp/mono",
    );
    expect(jetbrainsLink).toHaveAttribute("target", "_blank");
  });

  it("applies correct styling classes", () => {
    const { container } = render(<CreditsFooter />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass(
      "mx-auto",
      "w-auto",
      "max-w-[1000px]",
      "text-xs",
    );
  });

  it("contains all expected text content", () => {
    render(<CreditsFooter />);

    expect(screen.getByText(/Designed in/)).toBeInTheDocument();
    expect(screen.getByText(/and coded in/)).toBeInTheDocument();
    expect(screen.getByText(/Built with/)).toBeInTheDocument();
    expect(screen.getByText(/deployed with/)).toBeInTheDocument();
    expect(screen.getByText(/Styled using/)).toBeInTheDocument();
    expect(
      screen.getByText(/Most of the text is set using/),
    ).toBeInTheDocument();
    expect(screen.getByText(/typeset/)).toBeInTheDocument();
  });
});
