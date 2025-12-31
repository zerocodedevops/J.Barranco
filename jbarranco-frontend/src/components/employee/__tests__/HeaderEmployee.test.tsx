import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import HeaderEmployee from "../HeaderEmployee";

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

import { AuthContextType, useAuth } from "../../../context/AuthContext";

describe("HeaderEmployee", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockSignOut.mockClear();

    vi.mocked(useAuth).mockReturnValue({
      user: {
        nombre: "Juan",
        apellidos: "Pérez",
        urlImagenPerfil: "https://example.com/avatar.jpg",
      } as unknown as AuthContextType["user"],
      userRole: "empleado",
      loading: false,
      signIn: vi.fn(),
      signOut: mockSignOut,
    });
  });

  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <HeaderEmployee />
      </BrowserRouter>,
    );

    expect(screen.getByAltText("J.Barranco")).toBeInTheDocument();
  });

  it("displays logo image", () => {
    render(
      <BrowserRouter>
        <HeaderEmployee />
      </BrowserRouter>,
    );

    const logo = screen.getByAltText("J.Barranco");
    expect(logo).toHaveAttribute("src", "/logo-light.png");
  });

  it("has logout button", () => {
    render(
      <BrowserRouter>
        <HeaderEmployee />
      </BrowserRouter>,
    );

    const logoutButton = screen.getByTitle("Cerrar sesión");
    expect(logoutButton).toBeInTheDocument();
  });

  it("handles logout click", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <HeaderEmployee />
      </BrowserRouter>,
    );

    const logoutButton = screen.getByTitle("Cerrar sesión");
    await user.click(logoutButton);

    expect(mockSignOut).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
