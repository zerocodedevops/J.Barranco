import { expect, test } from "@playwright/test";

test.describe("Authentication Flow", () => {
    test("should display login page correctly", async ({ page }) => {
        await page.goto("/login");
        // From Login.tsx analysis: Inputs have labels, matching by label is better
        await expect(page.getByLabel("Email", { exact: true })).toBeVisible();
        // exact: true because there might be "Ingresa tu email" or similar logic elsewhere, but strict label is "Email"
        await expect(page.getByLabel("Contraseña")).toBeVisible();
        // Button text might be "Iniciar Sesión" or similar
        await expect(page.getByRole("button", { name: /iniciar sesión/i }))
            .toBeVisible();
    });

    test("should show error with invalid credentials", async ({ page }) => {
        await page.goto("/login");
        await page.getByLabel("Email", { exact: true }).fill(
            "wrong@example.com",
        );
        await page.getByLabel("Contraseña").fill("wrongpassword");
        await page.getByRole("button", { name: /iniciar sesión/i }).click();

        // The app uses react-hot-toast, which usually renders a div with role 'status' or specific classes
        // We'll check for the generic error message or toast presence
        await expect(page.getByText(/incorrectos/i)).toBeVisible({
            timeout: 15000,
        });
    });

    test("should allow navigation to password recovery", async ({ page }) => {
        await page.goto("/login");
        // Button text "Olvidé mi contraseña" or similar
        await page.getByText("¿Olvidaste tu contraseña?").click();
        // check url
        await expect(page).toHaveURL(/\/login/); // It toggles state, URL stays same
        await expect(page.getByText("Recuperar Contraseña")).toBeVisible();
    });
});
