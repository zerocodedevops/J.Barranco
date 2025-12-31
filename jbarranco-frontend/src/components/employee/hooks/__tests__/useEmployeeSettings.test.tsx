/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook, waitFor } from "@testing-library/react";
import { useEmployeeSettings } from "../useEmployeeSettings";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import * as firestore from "firebase/firestore";
import { useAuth } from "../../../../context/AuthContext";
import toast from "react-hot-toast";

// Mocks
const mockReauthenticate = vi.fn();
const mockUpdateEmail = vi.fn();
const mockUpdatePassword = vi.fn();
const mockSendPasswordResetEmail = vi.fn();
const mockCredential = vi.fn();

vi.mock("firebase/auth", () => ({
    getAuth: vi.fn(),
    EmailAuthProvider: {
        credential: (...args: any[]) => mockCredential(...args),
    },
    reauthenticateWithCredential: (...args: any[]) =>
        mockReauthenticate(...args),
    updateEmail: (...args: any[]) => mockUpdateEmail(...args),
    updatePassword: (...args: any[]) => mockUpdatePassword(...args),
    sendPasswordResetEmail: (...args: any[]) =>
        mockSendPasswordResetEmail(...args),
}));

vi.mock("firebase/firestore", () => ({
    doc: vi.fn(),
    getDoc: vi.fn(),
    updateDoc: vi.fn(),
}));

vi.mock("../../../../context/AuthContext", () => ({
    useAuth: vi.fn(),
}));

vi.mock("react-hot-toast", () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock("../../../../firebase/config", () => ({
    auth: { currentUser: { email: "employee@test.com", uid: "emp123" } },
    db: {},
}));

describe("useEmployeeSettings", () => {
    const mockUser = {
        uid: "emp123",
        email: "employee@test.com",
        firestoreId: "emp123",
        telefono: "123456789",
    };

    beforeEach(() => {
        vi.clearAllMocks();
        (useAuth as Mock).mockReturnValue({ user: mockUser });
        (firestore.doc as Mock).mockReturnValue("docRef");

        // Setup default behaviors
        mockReauthenticate.mockResolvedValue(true);
        mockCredential.mockReturnValue("mock-cred");
    });

    it("should initialize with user data", async () => {
        const { result } = renderHook(() => useEmployeeSettings());

        await waitFor(() => {
            expect(result.current.formData.email).toBe(mockUser.email);
            expect(result.current.formData.telefono).toBe(mockUser.telefono);
        });
    });

    it("should fetch phone if missing in user object (from empleados collection)", async () => {
        (useAuth as Mock).mockReturnValue({
            user: { ...mockUser, telefono: undefined },
        });
        (firestore.getDoc as Mock).mockResolvedValue({
            exists: () => true,
            data: () => ({ telefono: "987654321" }),
        });

        const { result } = renderHook(() => useEmployeeSettings());

        await waitFor(() => {
            expect(result.current.formData.telefono).toBe("987654321");
        });

        // Verify it queries 'empleados' collection
        expect(firestore.doc).toHaveBeenCalledWith(
            expect.anything(),
            "empleados",
            "emp123",
        );
    });

    it("should handle profile update success", async () => {
        const { result } = renderHook(() => useEmployeeSettings());

        act(() => {
            result.current.handleChange({
                target: { name: "telefono", value: "555555555" },
            } as any);
        });

        await act(async () => {
            await result.current.handleUpdateProfile({
                preventDefault: vi.fn(),
            } as any);
        });

        expect(firestore.updateDoc).toHaveBeenCalledTimes(2); // Empleados & Usuarios
        expect(toast.success).toHaveBeenCalledWith(
            "Perfil actualizado correctamente",
        );
    });

    it("should require password for email change", async () => {
        const { result } = renderHook(() => useEmployeeSettings());

        act(() => {
            result.current.handleChange({
                target: { name: "email", value: "new@test.com" },
            } as any);
        });

        await act(async () => {
            await result.current.handleUpdateProfile({
                preventDefault: vi.fn(),
            } as any);
        });

        expect(toast.error).toHaveBeenCalledWith(
            "Para cambiar el email, introduce tu contraseña actual",
        );
        expect(mockUpdateEmail).not.toHaveBeenCalled();
    });

    it("should handle password validation failure", async () => {
        const { result } = renderHook(() => useEmployeeSettings());

        act(() => {
            result.current.handleChange({
                target: { name: "newPassword", value: "123" },
            } as any);
            result.current.handleChange({
                target: { name: "confirmPassword", value: "123" },
            } as any);
        });

        await act(async () => {
            await result.current.handleUpdateProfile({
                preventDefault: vi.fn(),
            } as any);
        });

        expect(toast.error).toHaveBeenCalledWith(
            "La contraseña debe tener al menos 6 caracteres",
        );
    });

    it("should handle password mismatch", async () => {
        const { result } = renderHook(() => useEmployeeSettings());

        act(() => {
            result.current.handleChange({
                target: { name: "newPassword", value: "123456" },
            } as any);
            result.current.handleChange({
                target: { name: "confirmPassword", value: "123457" },
            } as any);
        });

        await act(async () => {
            await result.current.handleUpdateProfile({
                preventDefault: vi.fn(),
            } as any);
        });

        expect(toast.error).toHaveBeenCalledWith(
            "Las nuevas contraseñas no coinciden",
        );
    });

    it("should handle reset password", async () => {
        const { result } = renderHook(() => useEmployeeSettings());
        vi.spyOn(globalThis, "confirm").mockReturnValue(true);

        await act(async () => {
            await result.current.handleResetPassword();
        });

        expect(mockSendPasswordResetEmail).toHaveBeenCalledWith(
            expect.anything(),
            mockUser.email,
        );
    });
});
