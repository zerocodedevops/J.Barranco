import { expect, test } from "@playwright/test";

test.describe("Admin Flow (Unauthenticated)", () => {
    test("should redirect to login when accessing dashboard", async ({ page }) => {
        await page.goto("/admin");
        await expect(page).toHaveURL(/\/login/); // Verify redirect
        await expect(page.getByRole("button", { name: /iniciar sesión/i }))
            .toBeVisible();
    });

    test("should redirect to login when accessing clients", async ({ page }) => {
        await page.goto("/admin/clients");
        await expect(page).toHaveURL(/\/login/);
    });

    test("should redirect to login when accessing documents", async ({ page }) => {
        await page.goto("/admin/documents");
        await expect(page).toHaveURL(/\/login/);
    });
});
