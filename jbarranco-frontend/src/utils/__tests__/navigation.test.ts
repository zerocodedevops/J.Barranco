import { describe, expect, it } from "vitest";
import { DASHBOARD_ROUTES, getDashboardRoute } from "../navigation";

describe("navigation utils", () => {
    describe("DASHBOARD_ROUTES", () => {
        it("has route for admin role", () => {
            expect(DASHBOARD_ROUTES.admin).toBe("/admin");
        });

        it("has route for cliente role", () => {
            expect(DASHBOARD_ROUTES.cliente).toBe("/client");
        });

        it("has route for empleado role", () => {
            expect(DASHBOARD_ROUTES.empleado).toBe("/employee");
        });

        it("has default route for unknown roles", () => {
            expect(DASHBOARD_ROUTES.default).toBe("/");
        });
    });

    describe("getDashboardRoute", () => {
        it("returns admin dashboard for admin role", () => {
            expect(getDashboardRoute("admin")).toBe("/admin");
        });

        it("returns client dashboard for cliente role", () => {
            expect(getDashboardRoute("cliente")).toBe("/client");
        });

        it("returns employee route for empleado role", () => {
            expect(getDashboardRoute("empleado")).toBe("/employee");
        });

        it("returns default route for unknown role", () => {
            expect(getDashboardRoute("unknown")).toBe("/");
        });

        it("returns default route for null role", () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect(getDashboardRoute(null as any)).toBe("/");
        });

        it("returns default route for undefined role", () => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            expect(getDashboardRoute(undefined as any)).toBe("/");
        });

        it("is case-sensitive for roles", () => {
            // Si roles están en minúsculas, Admin (mayúscula) no debe funcionar
            expect(getDashboardRoute("Admin")).toBe("/");
        });
    });
});
