import { beforeEach, describe, expect, it, vi } from "vitest";
import {
    addToGoogleCalendar,
    exportCalendarToICS,
    exportEventToICS,
    getGoogleCalendarURL,
} from "../calendarUtils";
import { createEvent, createEvents } from "ics";
import { saveAs } from "file-saver";

// Mock dependencies
vi.mock("ics", () => ({
    createEvent: vi.fn(),
    createEvents: vi.fn(),
}));

vi.mock("file-saver", () => ({
    saveAs: vi.fn(),
}));

// Mock window.open
const mockOpen = vi.fn();
window.open = mockOpen;

describe("calendarUtils", () => {
    const mockEvent = {
        title: "Test Event",
        description: "Test Description",
        start: new Date(2023, 10, 15, 10, 0), // Nov 15, 2023 10:00
        end: new Date(2023, 10, 15, 11, 0), // Nov 15, 2023 11:00
        location: "Test Location",
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("getGoogleCalendarURL", () => {
        it("generates correct URL for Google Calendar", () => {
            const url = getGoogleCalendarURL(mockEvent);

            expect(url).toContain("calendar.google.com/calendar/render");
            expect(url).toContain("action=TEMPLATE");
            expect(url).toContain("text=Test+Event");
            expect(url).toContain("details=Test+Description");
            expect(url).toContain("location=Test+Location");
            // Dates in UTC format (with Z suffix)
            expect(url).toContain("20231115T");
            expect(url).toContain("dates=");
        });

        it("handles missing optional fields", () => {
            const simpleEvent = {
                title: "Simple Event",
                start: new Date(2023, 10, 15, 10, 0),
                end: new Date(2023, 10, 15, 11, 0),
            };

            const url = getGoogleCalendarURL(simpleEvent);
            expect(url).toContain("text=Simple+Event");
            // Description falls back to empty string, not title
            expect(url).toContain("dates=");
        });
    });

    describe("addToGoogleCalendar", () => {
        it("opens Google Calendar URL in new tab", () => {
            addToGoogleCalendar(mockEvent);
            expect(mockOpen).toHaveBeenCalledWith(
                expect.stringContaining("calendar.google.com"),
                "_blank",
            );
        });
    });

    describe("exportEventToICS", () => {
        it("successfully exports event", async () => {
            vi.mocked(createEvent).mockImplementation(
                (() => {
                    // createEvent can work with callback or return object in some versions,
                    // but our utils use the synchronous return { error, value } style or callback?
                    // Let's check the implementation in calendarUtils.js
                    // It uses: const { error, value } = createEvent(icsEvent);
                    return { error: null, value: "BEGIN:VCALENDAR..." };
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }) as any,
            );

            const result = await exportEventToICS(mockEvent, "test-event");

            expect(vi.mocked(createEvent)).toHaveBeenCalled();
            expect(vi.mocked(saveAs)).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it("handles export error", async () => {
            // Mock createEvent error
            vi.mocked(createEvent).mockReturnValue(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                { error: new Error("Export failed"), value: null } as any,
            );

            const consoleSpy = vi.spyOn(console, "error").mockImplementation(
                () => undefined,
            );

            const result = await exportEventToICS(mockEvent);

            expect(result).toBe(false);
            expect(vi.mocked(saveAs)).not.toHaveBeenCalled();

            consoleSpy.mockRestore();
        });
    });

    describe("exportCalendarToICS", () => {
        it("successfully exports multiple events", async () => {
            vi.mocked(createEvents).mockReturnValue(
                {
                    error: null,
                    value: "BEGIN:VEVENT\nSUMMARY:Test\nEND:VEVENT",
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any,
            );

            const events = [mockEvent, { ...mockEvent, title: "Event 2" }];
            const result = await exportCalendarToICS(events, "test-calendar");

            expect(vi.mocked(createEvents)).toHaveBeenCalled();
            expect(vi.mocked(saveAs)).toHaveBeenCalled();
            expect(result).toBe(true);
        });

        it("handles empty events list", async () => {
            const result = await exportCalendarToICS([]);
            // With empty events, no file should be created
            expect(vi.mocked(saveAs)).not.toHaveBeenCalled();
            expect(result).toBe(false);
        });
    });
});
