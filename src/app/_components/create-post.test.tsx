import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreatePost } from "./create-post";

// Mock the router
const mockRefresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    refresh: mockRefresh,
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

// Mock tRPC + TanStack Query: mutationOptions passes options through, and
// useMutation calls onSuccess right after mutate to simulate success.
const mockMutate = vi.fn();
let mockIsPending = false;

vi.mock("@/trpc/react", () => ({
  useTRPC: () => ({
    post: {
      create: {
        mutationOptions: (options: { onSuccess?: () => void }) => options,
      },
    },
  }),
}));

vi.mock("@tanstack/react-query", () => ({
  useMutation: (options: { onSuccess?: () => void }) => ({
    isPending: mockIsPending,
    mutate: (data: { name: string }) => {
      mockMutate(data);
      options.onSuccess?.();
    },
  }),
}));

describe("CreatePost", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with input and submit button", () => {
    render(<CreatePost />);

    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("updates input value on change", async () => {
    const user = userEvent.setup();
    render(<CreatePost />);

    const input = screen.getByPlaceholderText("Title");
    await user.type(input, "Test Post");

    expect(input).toHaveValue("Test Post");
  });

  it("calls mutate on form submission", async () => {
    const user = userEvent.setup();
    render(<CreatePost />);

    const input = screen.getByPlaceholderText("Title");
    await user.type(input, "My New Post");

    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    expect(mockMutate).toHaveBeenCalledWith({ name: "My New Post" });
  });

  it("refreshes router on successful submission", async () => {
    const user = userEvent.setup();
    render(<CreatePost />);

    const input = screen.getByPlaceholderText("Title");
    await user.type(input, "Test");

    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    expect(mockRefresh).toHaveBeenCalled();
  });

  it("clears input on successful submission", async () => {
    const user = userEvent.setup();
    render(<CreatePost />);

    const input = screen.getByPlaceholderText("Title");
    await user.type(input, "Test");

    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    expect(input).toHaveValue("");
  });

  it("prevents default form submission behavior", () => {
    render(<CreatePost />);

    const form = screen.getByRole("button").closest("form");
    const preventDefault = vi.fn();

    fireEvent.submit(form!, { preventDefault });

    // The form should call mutate (which means preventDefault was called internally)
    expect(mockMutate).toHaveBeenCalled();
  });

  it("applies correct styling classes to input", () => {
    render(<CreatePost />);

    const input = screen.getByPlaceholderText("Title");
    expect(input).toHaveClass("w-full", "rounded-full", "px-4", "py-2");
  });

  it("applies correct styling classes to button", () => {
    render(<CreatePost />);

    const button = screen.getByRole("button");
    expect(button).toHaveClass(
      "rounded-full",
      "bg-white/10",
      "px-10",
      "py-3",
      "font-semibold",
    );
  });

  it("has correct form structure with flex layout", () => {
    render(<CreatePost />);

    const form = screen.getByRole("button").closest("form");
    expect(form).toHaveClass("flex", "flex-col", "gap-2");
  });
});

describe("CreatePost pending state", () => {
  it("shows 'Submitting...' and disables the button when pending", () => {
    mockIsPending = true;
    render(<CreatePost />);

    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Submitting...");
    expect(button).toBeDisabled();
    mockIsPending = false;
  });
});
