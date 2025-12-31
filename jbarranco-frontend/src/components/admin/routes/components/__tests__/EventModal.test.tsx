import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import EventModal from "../EventModal";

describe("EventModal", () => {
    const mockProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSubmit: vi.fn((e) => e.preventDefault()),
        onDelete: vi.fn(),
        title: "Test Event",
        clients: [
            {
                id: "c1",
                nombre: "Client 1",
                telefono: "123",
                direccion: "Dir",
                codigoPostal: "28000",
                ciudad: "Madrid",
                nombreContacto: "Contact",
            },
        ],
        employees: [],
        formData: { clienteId: "", empleadoId: "", descripcion: "", fecha: "" },
        setFormData: vi.fn(),
        isEditing: false,
    };

    it("renders nothing when closed", () => {
        const { container } = render(
            <EventModal {...mockProps} isOpen={false} />,
        );
        expect(container).toBeEmptyDOMElement();
    });

    it("renders correctly when open", () => {
        render(<EventModal {...mockProps} />);
        expect(screen.getByText("Test Event")).toBeInTheDocument();
        expect(screen.getByLabelText("Cliente")).toBeInTheDocument();
        expect(screen.getByLabelText(/Descripción/)).toBeInTheDocument();
    });

    it("calls setFormData on input change", () => {
        render(<EventModal {...mockProps} />);
        const select = screen.getByLabelText("Cliente");
        fireEvent.change(select, { target: { value: "c1" } });
        expect(mockProps.setFormData).toHaveBeenCalledWith({
            ...mockProps.formData,
            clienteId: "c1",
        });
    });

    it("displays validation errors when provided", () => {
        render(
            <EventModal
                {...mockProps}
                errors={{ clienteId: "Error de cliente" }}
            />,
        );
        expect(screen.getByText("Error de cliente")).toBeInTheDocument();
        // Check if border applies (optional, but good for UI check)
        const select = screen.getByLabelText("Cliente");
        expect(select).toHaveClass("border-red-500");
    });

    it("calls onSubmit when form is submitted", () => {
        const validProps = {
            ...mockProps,
            formData: {
                clienteId: "c1",
                empleadoId: "emp1",
                descripcion: "Desc",
                fecha: "2023-01-01",
            },
        };
        render(<EventModal {...validProps} />);
        const submitBtn = screen.getByText("Guardar");
        const form = submitBtn.closest("form");
        if (form) fireEvent.submit(form);
        expect(mockProps.onSubmit).toHaveBeenCalled();
    });
});
