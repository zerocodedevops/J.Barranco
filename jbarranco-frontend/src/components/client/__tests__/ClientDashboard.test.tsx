import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ClientDashboard from "../ClientDashboard";
import { MemoryRouter } from "react-router-dom";
import * as clientHook from "../../../hooks/useClientDashboardData";

// Mock Auth Context
vi.mock("../../../context/AuthContext", () => ({
    useAuth: () => ({
        user: { uid: "test-client-id", displayName: "Test Cliente" },
        loading: false,
    }),
}));

// Mock Hook
vi.mock("../../../hooks/useClientDashboardData", () => ({
    useClientDashboardData: vi.fn(),
}));

describe("ClientDashboard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders greeting and quick actions", () => {
        (clientHook.useClientDashboardData as Mock).mockReturnValue({
            nextJob: null,
            loading: false,
        });

        render(
            <MemoryRouter>
                <ClientDashboard />
            </MemoryRouter>,
        );

        expect(screen.getByText(/Test Cliente/i)).toBeInTheDocument();
        expect(screen.getByText("Mi Calendario")).toBeInTheDocument();
        expect(screen.getByText("Solicitar / Quejas")).toBeInTheDocument();
    });

    it("displays next job status when available", () => {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 1);

        (clientHook.useClientDashboardData as Mock).mockReturnValue({
            nextJob: {
                id: "job1",
                fecha: futureDate,
                tipo: "mantenimiento",
            },
            loading: false,
        });

        render(
            <MemoryRouter>
                <ClientDashboard />
            </MemoryRouter>,
        );

        expect(screen.getByText(/programada para el/i)).toBeInTheDocument();
        expect(screen.getByText("Servicio Activo")).toBeInTheDocument();
    });

    it("displays empty state when no next job", () => {
        (clientHook.useClientDashboardData as Mock).mockReturnValue({
            nextJob: null,
            loading: false,
        });

        render(
            <MemoryRouter>
                <ClientDashboard />
            </MemoryRouter>,
        );

        expect(screen.getByText(/No hay visitas/i)).toBeInTheDocument();
        expect(screen.getByText("Sin actividad pendiente")).toBeInTheDocument();
    });

    it("displays loading state", () => {
        (clientHook.useClientDashboardData as Mock).mockReturnValue({
            nextJob: null,
            loading: true,
        });

        render(
            <MemoryRouter>
                <ClientDashboard />
            </MemoryRouter>,
        );

        expect(screen.getByText("Cargando información...")).toBeInTheDocument();
    });
});
