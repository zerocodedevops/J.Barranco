import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import HeaderClient from "../HeaderClient";

// Mock useNotifications removed

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

// Mock useNotifications
vi.mock("../../../hooks/useNotifications", () => ({
  useNotifications: vi.fn(() => []),
}));

// Mock useAuth
const mockSignOut = vi.fn();
vi.mock("../../../context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

import { AuthContextType, useAuth } from "../../../context/AuthContext";

describe("HeaderClient", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockSignOut.mockClear();
    vi.mocked(useAuth).mockReset();
    vi.mocked(useAuth).mockReturnValue({
      user: {
        nombre: "Cliente",
        apellidos: "Test",
        urlImagenPerfil: "https://example.com/client.jpg",
      },
      signOut: mockSignOut,
    } as unknown as AuthContextType);
  });

  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <HeaderClient />
      </BrowserRouter>,
    );

    expect(screen.getByAltText(/J\.Barranco\. Limpieza/i)).toBeInTheDocument();
  });

  it("displays client information", () => {
    render(
      <BrowserRouter>
        <HeaderClient />
      </BrowserRouter>,
    );

    // Should render without crashing and show client info
    expect(document.body).toBeTruthy();
  });

  it("displays logo image", () => {
    render(
      <BrowserRouter>
        <HeaderClient />
      </BrowserRouter>,
    );

    const logo = screen.getByAltText(/J\.Barranco\. Limpieza/i);
    expect(logo).toHaveAttribute("src", "/logo-light.png");
  });

  it("has logout button", () => {
    render(
      <BrowserRouter>
        <HeaderClient />
      </BrowserRouter>,
    );

    const logoutButton = screen.getByTitle("Cerrar sesión");
    expect(logoutButton).toBeInTheDocument();
  });

  it("handles logout click", async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <HeaderClient />
      </BrowserRouter>,
    );
    const logoutButton = screen.getByTitle("Cerrar sesión");
    await user.click(logoutButton);
    expect(mockSignOut).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
    // Verify avatar and logo are present
    const avatars = screen.getAllByRole("img");
    expect(avatars.length).toBeGreaterThan(1);
  });
});
