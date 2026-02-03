import { expect, test } from "@playwright/test"

test.describe("Dashboard", () => {
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
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            },
          },
        })
        return
      }

      if (operationName === "GetProjects") {
        await route.fulfill({
          json: {
            data: {
              projects: [
                {
                  id: "proj-1",
                  name: "Alpha Project",
                  key: "ALP",
                  description: "The alpha project",
                  owner: {
                    id: "user-1",
                    name: "John Doe",
                    username: "johndoe",
                  },
                  boards: [
                    {
                      id: "board-1",
                      name: "Alpha Board",
                    },
                  ],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
                {
                  id: "proj-2",
                  name: "Beta Project",
                  key: "BETA",
                  description: "The beta project",
                  owner: {
                    id: "user-1",
                    name: "John Doe",
                    username: "johndoe",
                  },
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
            },
          },
        })
        return
      }

      if (operationName === "GetBoard") {
        await route.fulfill({
          json: {
            data: {
              board: {
                __typename: "Board",
                id: "board-1",
                name: "Main Board",
                project: {
                  __typename: "Project",
                  id: "proj-1",
                  name: "Alpha Project",
                  key: "ALP",
                  description: "The alpha project",
                  owner: {
                    __typename: "User",
                    id: "user-1",
                    name: "John Doe",
                    username: "johndoe",
                  },
                },
                columns: [],
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

  test("should display dashboard with user name and projects", async ({ page }) => {
    await page.goto("/")

    // Check welcome message
    await expect(page.getByText("Welcome back, John")).toBeVisible()

    // Check project listing
    await expect(page.getByRole("heading", { name: "Alpha Project" })).toBeVisible()
    await expect(page.getByText("ALP", { exact: true })).toBeVisible()
    await expect(page.getByRole("heading", { name: "Beta Project" })).toBeVisible()
    await expect(page.getByText("BETA", { exact: true })).toBeVisible()
  })

  test("should display stats cards", async ({ page }) => {
    await page.goto("/")

    // Check stats cards
    await expect(page.getByText("Active Projects")).toBeVisible()
    await expect(page.getByText("Team Members")).toBeVisible()
    await expect(page.getByText("This Week")).toBeVisible()
    await expect(page.locator("p").filter({ hasText: /^12$/ })).toBeVisible()
    await expect(page.getByText("8")).toBeVisible()
    await expect(page.getByText("+23%")).toBeVisible()
  })

  test("should navigate to project board", async ({ page }) => {
    await page.goto("/")

    // Click on a project card
    await page.getByRole("heading", { name: "Alpha Project" }).click()

    // Check if redirected to board page
    await expect(page).toHaveURL("/board/board-1")
    await expect(page.getByRole("heading", { name: "Main Board" })).toBeVisible()
  })

  test("should open create project modal", async ({ page }) => {
    await page.goto("/")

    // Click create project button
    await page.locator("main").getByRole("button", { name: "New Project" }).click()

    // Check if modal opens
    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByRole("heading", { name: "Create project" })).toBeVisible()
  })

  test("should show user menu", async ({ page }) => {
    await page.goto("/")

    // Click user avatar to open menu
    await page.getByRole("button", { name: "John Doe" }).click()

    // Check if menu opens
    await expect(page.getByRole("menu")).toBeVisible()
    await expect(page.getByRole("menu").getByText("john@example.com")).toBeVisible()
    await expect(page.getByRole("menuitem", { name: "Profile" })).toBeVisible()
    await expect(page.getByRole("menuitem", { name: "Settings" })).toBeVisible()
    await expect(page.getByRole("menuitem", { name: "Log out" })).toBeVisible()
  })
})
