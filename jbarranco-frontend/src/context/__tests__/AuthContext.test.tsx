import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../AuthContext";
import * as firebaseAuth from "firebase/auth";
import * as firebaseFirestore from "firebase/firestore";

// Mock dependencies
vi.mock("../../firebase/config", () => ({
  auth: { currentUser: null },
  db: {},
}));

vi.mock("firebase/auth", () => ({
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  getDocs: vi.fn(),
}));

// Test component to access context
function TestComponent() {
  const { user, userRole, loading, signIn, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div data-testid="user-email">{user?.email}</div>
      <div data-testid="user-role">{userRole}</div>
      <button onClick={() => signIn("test@example.com", "password")}>
        Sign In
      </button>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("provides initial loading state", () => {
    vi.mocked(firebaseAuth.onAuthStateChanged).mockImplementation(() => () =>
      undefined
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("handles unauthenticated user", async () => {
    vi.mocked(firebaseAuth.onAuthStateChanged).mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_auth: any, callback: any) => {
        callback(null);
        return () => undefined;
      },
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("user-email")).toBeEmptyDOMElement();
    expect(screen.getByTestId("user-role")).toBeEmptyDOMElement();
  });

  it('handles authenticated user with role in "usuarios"', async () => {
    const mockUser = { uid: "123", email: "admin@test.com" };
    const mockUserData = { rol: "admin", nombre: "Admin" };

    vi.mocked(firebaseAuth.onAuthStateChanged).mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_auth: any, callback: any) => {
        callback(mockUser);
        return () => undefined;
      },
    );

    vi.mocked(firebaseFirestore.getDoc).mockResolvedValue({
      exists: () => true,
      data: () => mockUserData,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-role")).toHaveTextContent("admin");
    });
    expect(screen.getByTestId("user-email")).toHaveTextContent(
      "admin@test.com",
    );
  });

  it("handles fallback to email search for employee", async () => {
    const mockUser = { uid: "123", email: "emp@test.com" };

    vi.mocked(firebaseAuth.onAuthStateChanged).mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_auth: any, callback: any) => {
        callback(mockUser);
        return () => undefined;
      },
    );

    // Mock fetches:
    // 1. usuarios (UID) -> null
    // 2. empleados (UID) -> null
    // 3. empleados (Email) -> found
    vi.mocked(firebaseFirestore.getDoc)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({ exists: () => false } as any) // usuarios
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .mockResolvedValueOnce({ exists: () => false } as any); // empleados UID

    vi.mocked(firebaseFirestore.getDocs).mockResolvedValueOnce({
      empty: false,
      docs: [{
        id: "emp-doc-id",
        data: () => ({ nombre: "Empleado", rol: "empleado" }),
      }],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("user-role")).toHaveTextContent("empleado");
    });
  });

  it("handles signIn success", async () => {
    const user = userEvent.setup();
    vi.mocked(firebaseAuth.onAuthStateChanged).mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_auth: any, callback: any) => {
        callback(null);
        return () => undefined;
      },
    );
    vi.mocked(firebaseAuth.signInWithEmailAndPassword).mockResolvedValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { user: { uid: "123" } } as any,
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    );

    await user.click(screen.getByText("Sign In"));

    expect(firebaseAuth.signInWithEmailAndPassword).toHaveBeenCalled();
  });

  it("handles signOut success", async () => {
    const user = userEvent.setup();
    vi.mocked(firebaseAuth.onAuthStateChanged).mockImplementation(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (_auth: any, callback: any) => {
        callback({ uid: "123" });
        return () => undefined;
      },
    );
    vi.mocked(firebaseFirestore.getDoc).mockResolvedValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { exists: () => false } as any,
    ); // Simplify
    vi.mocked(firebaseFirestore.getDocs).mockResolvedValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { empty: true } as any,
    ); // Simplify

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    await waitFor(() =>
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
    );

    await user.click(screen.getByText("Sign Out"));

    expect(firebaseAuth.signOut).toHaveBeenCalled();
  });
});
