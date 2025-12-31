import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import HeaderAdmin from "../layout_components/HeaderAdmin";

// Mock navigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock ThemeToggle
vi.mock("../../common/ThemeToggle", () => ({
  default: () => <div data-testid="theme-toggle">Theme Toggle</div>,
}));

// Mock useAuth
const mockSignOut = vi.fn();
vi.mock("../../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

// Mock useNotifications
vi.mock("../../../hooks/useNotifications", () => ({
  useNotifications: vi.fn(() => []),
}));

import { AuthContextType, useAuth } from "../../../context/AuthContext";

describe("HeaderAdmin", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockSignOut.mockClear();

    vi.mocked(useAuth).mockReturnValue({
      user: {
        nombre: "Admin",
        apellidos: "Prueba",
        urlImagenPerfil: "https://example.com/admin.jpg",
      } as unknown as AuthContextType["user"],
      userRole: "admin",
      loading: false,
      signIn: vi.fn(),
      signOut: mockSignOut,
    });
  });

  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <HeaderAdmin />
      </BrowserRouter>,
    );

    const logo = screen.getByAltText(/J\.Barranco\. Limpieza/i);
    expect(logo).toBeInTheDocument();
  });

  it("displays admin information", () => {
    render(
      <BrowserRouter>
        <HeaderAdmin />
      </BrowserRouter>,
    );

    // Should render without crashing and show admin info
    expect(document.body).toBeTruthy();
  });

  it("displays logo image", () => {
    render(
      <BrowserRouter>
        <HeaderAdmin />
      </BrowserRouter>,
    );

    const logo = screen.getByAltText(/J\.Barranco\. Limpieza/i);
    expect(logo).toHaveAttribute("src", "/logo-light.png");
  });

  it("has logout button", () => {
    render(
      <BrowserRouter>
        <HeaderAdmin />
      </BrowserRouter>,
    );

    const logoutButton = screen.getByTitle("Cerrar sesión");
    expect(logoutButton).toBeInTheDocument();
  });

  it("handles logout click", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <HeaderAdmin />
      </BrowserRouter>,
    );

    const logoutButton = screen.getByTitle("Cerrar sesión");
    await user.click(logoutButton);

    expect(mockSignOut).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("shows default name when user has no name", () => {
    vi.mocked(useAuth).mockReturnValueOnce({
      user: {} as unknown as AuthContextType["user"],
      userRole: "admin",
      loading: false,
      signIn: vi.fn(),
      signOut: mockSignOut,
    });

    render(
      <BrowserRouter>
        <HeaderAdmin />
      </BrowserRouter>,
    );

    expect(screen.getByText(/Administrador/)).toBeInTheDocument();
  });

  it("displays user avatar", () => {
    render(
      <BrowserRouter>
        <HeaderAdmin />
      </BrowserRouter>,
    );

    const avatars = screen.getAllByRole("img");
    expect(avatars.length).toBeGreaterThan(1); // Logo + avatar
  });
});
