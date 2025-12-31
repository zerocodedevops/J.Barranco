import { expect, test } from "@playwright/test";

test.describe("Public Navigation & SEO", () => {
    test("should load landing page with correct title", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveTitle(/J.Barranco - Limpieza/i);
        await expect(page.locator("h1")).toContainText(/Limpieza/i);
    });

    test("should have essential SEO meta tags", async ({ page }) => {
        await page.goto("/");
        const description = page.locator('meta[name="description"]');
        await expect(description).toHaveAttribute("content", /limpieza/i);
    });

    test("should navigate to services section", async ({ page }) => {
        await page.goto("/");
        // Assuming there are navigation links
        const servicesLink = page.getByRole("link", { name: /servicios/i })
            .first();
        if (await servicesLink.isVisible()) {
            await servicesLink.click();
            await expect(page.url()).toContain("servicios");
        }
    });

    test("should display contact form", async ({ page }) => {
        await page.goto("/contact"); // Changed from /contacto to /contact based on routes.tsx
        await expect(page.getByLabel("Nombre *")).toBeVisible();
        await expect(page.getByLabel("Email *")).toBeVisible();
        await expect(page.getByRole("button", { name: /enviar/i }))
            .toBeVisible();
    });
});
