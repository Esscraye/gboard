import { expect, test } from "@playwright/test"

test.describe("Teams Page", () => {
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

      if (operationName === "GetTeams") {
        await route.fulfill({
          json: {
            data: {
              teams: [
                {
                  id: "team-1",
                  name: "Team Alpha",
                  description: "Alpha Team Description",
                  members: [{ id: "user-1", name: "John Doe" }],
                },
              ],
            },
          },
        })
        return
      }

      if (operationName === "CreateTeam") {
        await route.fulfill({
          json: {
            data: {
              createTeam: {
                id: "team-new",
                name: "New Team",
                description: "New Team Description",
                members: [],
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

  test("should display teams", async ({ page }) => {
    await page.goto("/teams")

    await expect(page.getByRole("heading", { name: "Teams" })).toBeVisible()
    await expect(page.getByText("Team Alpha")).toBeVisible()
    await expect(page.getByText("Alpha Team Description")).toBeVisible()
    await expect(page.getByText("1 members")).toBeVisible()
  })

  test("should create a new team", async ({ page }) => {
    await page.goto("/teams")

    await page.getByRole("button", { name: "New Team" }).click()

    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByRole("heading", { name: "Create Team" })).toBeVisible()

    await page.getByLabel("Team Name").fill("New Team")
    await page.getByLabel("Description").fill("New Team Description")
    await page.getByRole("button", { name: "Create Team" }).click()

    await expect(page).toHaveURL(/\/teams\/team-new/)
  })
})
