import { describe, expect, it } from "vitest"

import { useCounter } from "./useCounter.js"

describe("useCounter composable (T-2026-225)", () => {
  it("increments, decrements, and resets independently per caller", () => {
    const a = useCounter(2)
    const b = useCounter(0)

    a.increment()
    b.increment(3)

    expect(a.count.value).toBe(3)
    expect(a.doubled.value).toBe(6)
    expect(b.count.value).toBe(3)
    expect(b.isEven.value).toBe(false)

    a.reset()
    expect(a.count.value).toBe(2)
    expect(b.count.value).toBe(3)
  })
})
