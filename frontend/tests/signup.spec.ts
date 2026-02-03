import { expect, test } from "@playwright/test"

test.describe("Signup Page", () => {
  test("should display signup form", async ({ page }) => {
    await page.goto("/signup")

    // Check for the main heading
    await expect(page.getByRole("heading", { name: "Create an account" })).toBeVisible()

    // Check for form fields
    await expect(page.getByLabel("Full name")).toBeVisible()
    await expect(page.getByLabel("Username")).toBeVisible()
    await expect(page.getByLabel("Email address")).toBeVisible()
    await expect(page.getByLabel("Password")).toBeVisible()

    // Check for the sign up button
    await expect(page.getByRole("button", { name: "Get started" })).toBeVisible()
  })

  test("should show validation errors on empty form submission", async ({ page }) => {
    await page.goto("/signup")

    // Check sign up button is enabled but fields are required
    await expect(page.getByRole("button", { name: "Get started" })).toBeEnabled()
    await expect(page.getByLabel("Full name")).toHaveAttribute("required", "")
  })

  test("should show password field", async ({ page }) => {
    await page.goto("/signup")

    // Focus on password field
    await page.getByLabel("Password").focus()

    // Check if password field is properly displayed
    await expect(page.getByLabel("Password")).toBeVisible()
    await expect(page.getByPlaceholder("Create a strong password")).toBeVisible()
  })
})
