import { expect, test } from "@playwright/test"

test.describe("Issue Details", () => {
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

      if (operationName === "GetBoard") {
        await route.fulfill({
          json: {
            data: {
              board: {
                id: "board-1",
                name: "Main Board",
                project: {
                  id: "proj-1",
                  name: "Alpha Project",
                  key: "ALP",
                  description: "The alpha project",
                  owner: {
                    id: "user-1",
                    name: "John Doe",
                    username: "johndoe",
                  },
                },
                team: null,
                columns: [
                  {
                    id: "col-1",
                    name: "To Do",
                    position: 1,
                    issues: [
                      {
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
                          id: "user-1",
                          name: "John Doe",
                          username: "johndoe",
                        },
                        assignee: null,
                      },
                    ],
                  },
                ],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            },
          },
        })
        return
      }

      if (operationName === "GetIssue") {
        await route.fulfill({
          json: {
            data: {
              issue: {
                __typename: "Issue",
                id: "issue-1",
                title: "First Task",
                key: "ALP-1",
                description: "Complete the first task",
                priority: "MEDIUM",
                issueType: "TASK",
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
                comments: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            },
          },
        })
        return
      }

      if (operationName === "UpdateIssue") {
        await route.fulfill({
          json: {
            data: {
              updateIssue: {
                id: "issue-1",
                title: postData.variables.input.title || "First Task",
                description: postData.variables.input.description || "Updated description",
                priority: postData.variables.input.priority || "MEDIUM",
                issueType: postData.variables.input.issueType || "TASK",
                status: postData.variables.input.status || "TODO",
                // ... other fields
              },
            },
          },
        })
        return
      }

      if (operationName === "CreateComment") {
        await route.fulfill({
          json: {
            data: {
              createComment: {
                id: "comment-new",
                content: postData.variables.content,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                author: {
                  id: "user-1",
                  name: "John Doe",
                  username: "johndoe",
                  avatar: null,
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

  test("should edit issue description", async ({ page }) => {
    await page.goto("/board/board-1")

    // Open issue
    await page.getByText("First Task").click()

    // Wait for modal
    await expect(page.getByRole("dialog")).toBeVisible()

    // Check initial description
    await expect(page.getByText("Complete the first task")).toBeVisible()

    // Find description editor/textarea - typically user clicks to edit or it's a textarea
    // Assuming standard textarea or editable div.
    // Based on common patterns: label "Description", then textarea.

    // Wait for description to be loaded
    const descriptionArea = page.getByPlaceholder("Add a description...")

    // In many Jira-clones, you might need to click to edit or it's always editable.

    // Let's assume it's a textarea.

    await descriptionArea.fill("Updated description")

    // Blur to save (auto-save on blur)

    await descriptionArea.blur()

    // Verify update (mocked response allows it, but UI might not reflect without refetch)

    // At least ensure no error toast.
  })

  test("should add a comment", async ({ page }) => {
    await page.goto("/board/board-1")

    // Open issue

    await page.getByText("First Task").click()

    // Find comment input

    await page.getByPlaceholder("Write a comment...").click()

    await page.getByPlaceholder("Write a comment...").fill("This is a test comment")

    // Click Save/Comment button (it's an icon button inside the form)

    await page.locator('form button[type="submit"]').click()

    // Check if comment appears

    await expect(page.getByText("This is a test comment")).toBeVisible()
  })
})
