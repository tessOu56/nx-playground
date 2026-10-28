import { render, screen } from "@testing-library/react"
import { expect, test } from "vitest"

import { Button } from "./Button"

test("renders the shared button", () => {
  render(<Button />)
  const button = screen.getByRole("button", { name: "UI:Click Me" })
  expect(button).toBeInTheDocument()
  expect(button).toHaveAttribute("type", "button")
})
