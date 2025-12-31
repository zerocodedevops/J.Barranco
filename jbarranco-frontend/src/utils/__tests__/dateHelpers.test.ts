import { describe, expect, it } from "vitest";
import { formatFirestoreDate } from "../dateHelpers";
import { Timestamp } from "firebase/firestore";

describe("dateHelpers", () => {
    describe("formatFirestoreDate", () => {
        it("returns '-' for null or undefined", () => {
            expect(formatFirestoreDate(null)).toBe("-");
            expect(formatFirestoreDate(undefined)).toBe("-");
        });

        it("formats JavaScript Date objects", () => {
            const date = new Date(2023, 0, 1); // 1 Jan 2023
            // Note: Locale Date String output depends on system locale if not forced.
            // Function uses default 'es-ES'
            expect(formatFirestoreDate(date)).toMatch(
                /1\/1\/2023|01\/01\/2023/,
            );
        });

        it("formats Firestore Timestamps", () => {
            const date = new Date(2023, 11, 25); // 25 Dec 2023
            const timestamp = { toDate: () => date } as Timestamp;
            expect(formatFirestoreDate(timestamp)).toMatch(/25\/12\/2023/);
        });

        it("formats valid date strings", () => {
            expect(formatFirestoreDate("2023-05-15")).toMatch(
                /15\/5\/2023|15\/05\/2023/,
            );
        });

        it("formats valid numbers (timestamps)", () => {
            const date = new Date(2023, 5, 20); // 20 June 2023
            expect(formatFirestoreDate(date.getTime())).toMatch(
                /20\/6\/2023|20\/06\/2023/,
            );
        });

        it("returns 'Fecha inválida' for invalid dates", () => {
            expect(formatFirestoreDate("invalid-date-string")).toBe(
                "Fecha inválida",
            );
        });
    });
});
