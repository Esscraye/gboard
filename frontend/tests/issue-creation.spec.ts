import { expect, test } from "@playwright/test"

test.describe("Issue Creation", () => {
  test.beforeEach(async ({ page }) => {
    const boardsData = [
      {
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
        columns: [
          {
            __typename: "Column",
            id: "col-1",
            name: "To Do",
            position: 1,
            issues: [
              {
                __typename: "Issue",
                id: "issue-1",
                title: "First Task",
                key: "ALP-1",
                description: "Complete the first task",
                priority: "MEDIUM",
                issueType: "TASK",
                status: "TODO",
                position: 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                reporter: {
                  __typename: "User",
                  id: "user-1",
                  name: "John Doe",
                  username: "johndoe",
                },
                assignee: null,
              },
            ],
          },
          {
            __typename: "Column",
            id: "col-2",
            name: "In Progress",
            position: 2,
            issues: [],
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]

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

      if (operationName === "GetBoard") {
        await route.fulfill({
          json: {
            data: {
              board: boardsData[0],
            },
          },
        })
        return
      }

      if (operationName === "CreateIssue") {
        const newIssue = {
          __typename: "Issue",
          id: "issue-new",
          title: postData.variables.input.title,
          description: postData.variables.input.description,
          key: "ALP-NEW",
          priority: postData.variables.input.priority,
          issueType: postData.variables.input.issueType || "TASK",
          status: "TODO",
          reporter: {
            __typename: "User",
            id: "user-1",
            name: "John Doe",
            username: "johndoe",
          },
          assignee: null,
          column: {
            __typename: "Column",
            id: "col-1",
            name: "To Do",
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        // Add to state
        const board = boardsData[0]
        const column = board.columns.find((c) => c.id === "col-1")
        if (column) {
          column.issues.push(newIssue)
        }

        await route.fulfill({
          json: {
            data: {
              createIssue: newIssue,
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

  test("should open create issue modal", async ({ page }) => {
    await page.goto("/board/board-1")

    // Click create issue button
    await page.getByRole("button", { name: "Add issue" }).first().click()

    // Check if modal opens
    await expect(page.getByRole("dialog")).toBeVisible()
    await expect(page.getByRole("heading", { name: "Create issue" })).toBeVisible()
  })

  test("should show validation errors on empty form submission", async ({ page }) => {
    await page.goto("/board/board-1")

    // Open modal
    await page.getByRole("button", { name: "Add issue" }).first().click()

    // Check create button is disabled
    await expect(page.getByRole("button", { name: "Create issue" })).toBeDisabled()
  })

  test("should create a new issue successfully", async ({ page }) => {
    await page.goto("/board/board-1")

    // Open modal
    await page.getByRole("button", { name: "Add issue" }).first().click()

    // Fill the form
    await page.getByLabel("Title").fill("Test Issue")
    await page.getByLabel("Description").fill("This is a test issue")

    await page.getByLabel("Priority").click()
    await page.getByRole("option", { name: "Medium" }).click()

    // Submit the form
    await page.getByRole("button", { name: "Create issue" }).click()

    // Wait for the issue to be created and modal to close
    await expect(page.getByRole("dialog")).not.toBeVisible()

    // Check if issue appears in the board
    await expect(page.getByText("Test Issue")).toBeVisible()
  })

  test("should close modal when clicking cancel", async ({ page }) => {
    await page.goto("/board/board-1")

    // Open modal
    await page.getByRole("button", { name: "Add issue" }).first().click()

    // Click cancel button
    await page.getByRole("button", { name: "Cancel" }).click()

    // Check if modal closes
    await expect(page.getByRole("dialog")).not.toBeVisible()
  })
})
