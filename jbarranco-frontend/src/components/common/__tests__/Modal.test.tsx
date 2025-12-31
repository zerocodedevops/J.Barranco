import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "../Modal";

describe("Modal", () => {
  it("renders when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={() => undefined} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.getByText("Modal content")).toBeInTheDocument();
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={() => undefined} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
  });

  it("calls onClose when clicking close button", async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );

    const closeButton = screen.getByRole("button", { name: /cerrar/i });
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalled();
  });

  it("applies different size classes", () => {
    const { container, rerender } = render(
      <Modal
        isOpen={true}
        onClose={() => undefined}
        title="Test Modal"
        size="sm"
      >
        <p>Small modal</p>
      </Modal>,
    );

    expect(container.querySelector(".max-w-sm")).toBeInTheDocument();

    rerender(
      <Modal
        isOpen={true}
        onClose={() => undefined}
        title="Test Modal"
        size="xl"
      >
        <p>Large modal</p>
      </Modal>,
    );

    expect(container.querySelector(".max-w-xl")).toBeInTheDocument();
  });

  it("renders modal with dialog role", () => {
    render(
      <Modal isOpen={true} onClose={() => undefined} title="Test Modal">
        <p>Modal content</p>
      </Modal>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
