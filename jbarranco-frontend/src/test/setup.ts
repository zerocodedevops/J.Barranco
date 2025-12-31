import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";

// Cleanup después de cada test
afterEach(() => {
    cleanup();
});

// Mock de Firebase
vi.mock("../firebase/config", () => ({
    auth: {},
    db: {},
}));
