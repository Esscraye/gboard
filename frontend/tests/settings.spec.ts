import { expect, test } from "@playwright/test"

test.describe("Settings Page", () => {
  test.beforeEach(async ({ page }) => {
    // Mock GraphQL requests
    await page.route("**/query", async (route) => {
      const postData = route.request().postDataJSON()
      const operationName = postData.operationName || ""

      if (operationName === "Me") {
        await route.fulfill({
          json: {
            data: {
              me: {
                id: "user-1",
                name: "John Doe",
                username: "johndoe",
                email: "john@example.com",
              },
            },
          },
        })
        return
      }

      if (operationName === "UpdateUser") {
        const variables = postData.variables
        await route.fulfill({
          json: {
            data: {
              updateUser: {
                id: "user-1",
                name: variables.input.name || "John Doe",
                username: variables.input.username || "johndoe",
                email: variables.input.email || "john@example.com",
              },
            },
          },
        })
        return
      }

      await route.continue()
    })

    // Simulate authentication
    await page.addInitScript(() => {
      localStorage.setItem("auth_token", "fake-token")
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "user-1",
          name: "John Doe",
          username: "johndoe",
          email: "john@example.com",
        })
      )
    })
  })

  test("should display user settings", async ({ page }) => {
    await page.goto("/settings")

    await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible()
    await expect(page.getByLabel("Full Name")).toHaveValue("John Doe")
    await expect(page.getByLabel("Username")).toHaveValue("johndoe")
    await expect(page.getByLabel("Email Address")).toHaveValue("john@example.com")
  })

  test("should update profile", async ({ page }) => {
    await page.goto("/settings")

    await page.getByLabel("Full Name").fill("Jane Doe")
    await page.getByRole("button", { name: "Save Changes" }).click()

    await expect(page.getByText("Profile updated successfully!")).toBeVisible()
  })
})
