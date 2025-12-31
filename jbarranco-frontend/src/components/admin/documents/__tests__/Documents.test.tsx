import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Documents from "../Documents";
import toast from "react-hot-toast";
import * as pdfService from "../../../../services/pdfService";
import * as storageService from "../../../../services/storageService";

// Mock Firebase
const mockGetDocs = vi.fn();
const mockCollection = vi.fn();
const mockAddDoc = vi.fn();

vi.mock("../../../../firebase/config", () => ({
  db: {},
}));

vi.mock("firebase/firestore", () => ({
  collection: (...args: unknown[]) => mockCollection(...args),
  getDocs: (...args: unknown[]) => mockGetDocs(...args),
  addDoc: (...args: unknown[]) => mockAddDoc(...args),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

// Mock PDF Service
vi.mock("../../../../services/pdfService", () => ({
  generateBudget: vi.fn(),
  generateInvoice: vi.fn(),
  generateJobReport: vi.fn(),
}));

// Mock Storage Service
vi.mock("../../../../services/storageService", () => ({
  uploadDocument: vi.fn(),
  listDocumentsByCategory: vi.fn(),
  deleteDocument: vi.fn(),
}));

// Mock Counter Service
vi.mock("../../../../services/counterService", () => ({
  getNextDocumentNumber: vi.fn().mockResolvedValue("2024-001"),
}));

// Mock AuthContext
vi.mock("../../../../context/AuthContext", () => ({
  useAuth: () => ({
    user: { uid: "test-uid", role: "admin" },
    loading: false,
    signOut: vi.fn(),
  }),
}));

describe("Documents Component", () => {
  const mockClients = [
    { id: "1", nombre: "Cliente A", direccion: "Dir A", cif: "A123" },
    { id: "2", nombre: "Cliente B", direccion: "Dir B", cif: "B456" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    mockGetDocs.mockResolvedValue({
      docs: mockClients.map((c) => ({
        id: c.id,
        data: () => c,
      })),
    });

    vi.mocked(storageService.listDocumentsByCategory).mockResolvedValue([]);
  });

  it("renders without crashing", () => {
    render(<Documents />);
    expect(document.body).toBeTruthy();
  });

  it("loads clients", async () => {
    render(<Documents />);
    await waitFor(() => {
      expect(mockGetDocs).toHaveBeenCalled();
    });
  });

  it("shows validation error on empty generate", async () => {
    const user = userEvent.setup();
    render(<Documents />);

    // Wait for loading to finish
    await waitFor(() =>
      expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument()
    );

    // Button text depends on default state (budget)
    const generateBtn = screen.getByText(/Generar Presupuesto/i);
    await user.click(generateBtn);

    expect(toast.error).toHaveBeenCalled();
  });

  it("handles PDF generation", async () => {
    const user = userEvent.setup();
    render(<Documents />);

    await waitFor(() =>
      expect(screen.queryByText(/Cargando/i)).not.toBeInTheDocument()
    );

    // Fill form data
    const descInput = screen.getByLabelText(/Descripción/i);
    await user.type(descInput, "Limpieza mensual");

    const priceInput = screen.getByLabelText(/Precio/i);
    await user.type(priceInput, "100");

    // Select client if possible (first combobox usually)
    const selects = screen.getAllByRole("combobox");
    if (selects.length > 0 && selects[0]) {
      // Assuming first select is client.
      // We mock clients with id '1' and '2'.
      await user.selectOptions(selects[0], "1");
    }

    // Click generate
    const generateBtn = screen.getByText(/Generar Presupuesto/i);
    await user.click(generateBtn);

    expect(pdfService.generateBudget).toHaveBeenCalled();
  });
});
