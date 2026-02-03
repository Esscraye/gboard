import { expect, test } from "@playwright/test"

test.describe("Create Project", () => {
  test.beforeEach(async ({ page }) => {
    const projects: any[] = []

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
              projects: [...projects],
            },
          },
        })
        return
      }

      if (operationName === "CreateProject") {
        const newProject = {
          __typename: "Project",
          id: "proj-new",
          name: postData.variables.input.name,
          key: postData.variables.input.key,
          description: postData.variables.input.description,
          owner: {
            __typename: "User",
            id: "user-1",
            name: "John Doe",
            username: "johndoe",
          },
          boards: [
            {
              __typename: "Board",
              id: "board-new",
              name: "Main Board",
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        projects.push(newProject)

        await route.fulfill({
          json: {
            data: {
              createProject: newProject,
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

  test("should open create project modal", async ({ page }) => {
    await page.goto("/")

    // Click create project button
    await page.locator("main").getByRole("button", { name: "New Project" }).click()

    // Check if modal opens
    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByRole("heading", { name: "Create project" })).toBeVisible()
  })

  test("should show validation errors on empty form submission", async ({ page }) => {
    await page.goto("/")

    // Open modal
    await page.locator("main").getByRole("button", { name: "New Project" }).click()

    // Check create button is disabled
    await expect(page.getByRole("button", { name: "Create project" })).toBeDisabled()
  })

  test("should create a new project successfully", async ({ page }) => {
    await page.goto("/")

    // Open modal
    await page.locator("main").getByRole("button", { name: "New Project" }).click()

    // Fill the form
    await page.getByLabel("Project Name").fill("New Test Project")
    await page.getByLabel("Project Key").fill("NTP")
    await page.getByLabel("Description").fill("This is a test project")

    // Submit the form
    await page.getByRole("button", { name: "Create project" }).click()

    // Wait for the project to be created and modal to close
    await expect(page.getByRole("dialog")).not.toBeVisible()

    // Check if project appears in the list
    await expect(page.getByRole("heading", { name: "New Test Project" })).toBeVisible()
    await expect(page.getByText("NTP", { exact: true })).toBeVisible()
  })

  test("should close modal when clicking cancel", async ({ page }) => {
    await page.goto("/")

    // Open modal
    await page.locator("main").getByRole("button", { name: "New Project" }).click()

    // Click cancel button
    await page.getByRole("button", { name: "Cancel" }).click()

    // Check if modal closes
    await expect(page.getByRole("dialog")).not.toBeVisible()
  })
})
