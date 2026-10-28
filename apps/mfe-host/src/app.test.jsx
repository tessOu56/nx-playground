import { render, screen } from "@testing-library/react"
import { expect, test } from "vitest"

import { App } from "./app"

test("renders the Web3 host heading and federated button", async () => {
  render(<App />)
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Hello from Web3!"
  )
  expect(await screen.findByTestId("federated-button")).toHaveTextContent(
    "UI:Click Me"
  )
})
