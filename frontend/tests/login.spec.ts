import { expect, test } from "@playwright/test"

test.describe("Login Page", () => {
  test("should display login form", async ({ page }) => {
    await page.goto("/login")

    // Check for the main heading
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible()

    // Check for email and password fields
    await expect(page.getByLabel("Email address")).toBeVisible()
    await expect(page.getByLabel("Password")).toBeVisible()

    // Check for the sign-in button
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible()

    // Check for signup link
    await expect(page.getByRole("link", { name: "Create one" })).toBeVisible()
  })

  test("should have required attributes on inputs", async ({ page }) => {
    await page.goto("/login")

    // Check for required attributes
    await expect(page.getByLabel("Email address")).toHaveAttribute("required", "")
    await expect(page.getByLabel("Password")).toHaveAttribute("required", "")
  })

  test("should handle invalid email format", async ({ page }) => {
    await page.goto("/login")

    // Fill invalid email
    await page.getByLabel("Email address").fill("invalid-email")
    await page.getByLabel("Password").fill("password123")

    // Try to submit - browser will prevent submission due to invalid email format
    await page.getByRole("button", { name: "Sign in" }).click()

    // Check that the form didn't submit (still on login page)
    await expect(page).toHaveURL("/login")
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible()
  })

  test("should navigate to signup page", async ({ page }) => {
    await page.goto("/login")

    // Click signup link
    await page.getByRole("link", { name: "Create one" }).click()

    // Check if redirected to signup page
    await expect(page).toHaveURL("/signup")
    await expect(page.getByRole("heading", { name: "Create an account" })).toBeVisible()
  })
})
