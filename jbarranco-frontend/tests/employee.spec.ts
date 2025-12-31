import { expect, test } from "@playwright/test";

test.describe("Employee Flow (Unauthenticated)", () => {
    test("should redirect to login when accessing routes", async ({ page }) => {
        await page.goto("/employee/route");
        await expect(page).toHaveURL(/\/login/);
        await expect(page.getByRole("button", { name: /iniciar sesión/i }))
            .toBeVisible();
    });

    test("should redirect to login when accessing dashboard", async ({ page }) => {
        await page.goto("/employee");
        await expect(page).toHaveURL(/\/login/);
    });

    test("should redirect to login when accessing settings", async ({ page }) => {
        await page.goto("/employee/settings");
        await expect(page).toHaveURL(/\/login/);
    });
});
