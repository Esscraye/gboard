import { expect, test } from "@playwright/test"

test.describe("Boards Index Page", () => {
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

      if (operationName === "GetProjects") {
        await route.fulfill({
          json: {
            data: {
              projects: [
                {
                  id: "proj-1",
                  name: "Project One",
                  key: "ONE",
                  description: "First project",
                  boards: [
                    { id: "board-1", name: "Board Alpha" },
                    { id: "board-2", name: "Board Beta" },
                  ],
                },
                {
                  id: "proj-2",
                  name: "Project Two",
                  key: "TWO",
                  description: "Second project",
                  boards: [],
                },
              ],
            },
          },
        })
        return
      }

      if (operationName === "CreateBoard") {
        await route.fulfill({
          json: {
            data: {
              createBoard: {
                id: "board-new",
                name: "New Board",
                project: {
                  id: "proj-2",
                },
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

  test("should display projects and boards", async ({ page }) => {
    await page.goto("/boards")

    await expect(page.getByRole("heading", { name: "Boards" })).toBeVisible()

    // Project One
    await expect(page.getByText("Project One")).toBeVisible()
    await expect(page.getByText("ONE", { exact: true })).toBeVisible()
    await expect(page.getByText("2 Boards")).toBeVisible()
    await expect(page.getByText("Board Alpha")).toBeVisible()
    await expect(page.getByText("Board Beta")).toBeVisible()

    // Project Two
    await expect(page.getByText("Project Two")).toBeVisible()
    await expect(page.getByText("0 Boards")).toBeVisible()
  })

  test("should create a new board", async ({ page }) => {
    await page.goto("/boards")

    // Find Project Two card and click "Create New Board"
    // The cards are direct children of a grid container
    const projectTwoCard = page.locator(".grid > div").filter({ hasText: "Project Two" })
    await projectTwoCard.getByRole("button", { name: "Create New Board" }).click()

    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByRole("heading", { name: "Create Board" })).toBeVisible()

    await page.getByLabel("Board Name").fill("New Board")
    await page.getByRole("button", { name: "Create Board" }).click()

    // The component redirects to /boards/[projectId] according to the code I read.
    // Even if that route is 404, the URL should change.
    await expect(page).toHaveURL(/\/boards\/proj-2/)
  })
})
