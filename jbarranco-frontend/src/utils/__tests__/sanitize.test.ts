import { describe, expect, it } from "vitest";
import { sanitizeHtml, sanitizeText, sanitizeUserInput } from "../sanitize";

describe("sanitize", () => {
    describe("sanitizeHtml", () => {
        it("allows safe tags", () => {
            const input = "<b>Bold</b> and <i>Italic</i>";
            expect(sanitizeHtml(input)).toBe("<b>Bold</b> and <i>Italic</i>");
        });

        it("removes script tags (XSS)", () => {
            const input = "Hello <script>alert('xss')</script>";
            expect(sanitizeHtml(input)).toBe("Hello ");
        });

        it("allows safe attributes", () => {
            const input =
                '<a href="https://example.com" target="_blank">Link</a>';
            expect(sanitizeHtml(input)).toBe(
                '<a href="https://example.com" target="_blank">Link</a>',
            );
        });

        it("removes unsafe attributes", () => {
            const input = '<a onclick="alert(1)">Click</a>';
            expect(sanitizeHtml(input)).toBe("<a>Click</a>"); // or similar
        });
    });

    describe("sanitizeText", () => {
        it("removes all tags", () => {
            const input = "<p>Paragraph</p> with <b>bold</b>";
            expect(sanitizeText(input)).toBe("Paragraph with bold");
        });
    });

    describe("sanitizeUserInput", () => {
        it("allows basic formatting but removes links", () => {
            const input = "<b>Bold</b> <a href='#'>Link</a>";
            expect(sanitizeUserInput(input)).toBe("<b>Bold</b> Link");
        });
    });
});
