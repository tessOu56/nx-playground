import { lazy, Suspense } from "react"

const Button = lazy(() =>
  import("mfe-ui/Button").then(mod => ({ default: mod.Button }))
)

export function App() {
  return (
    <h1>
      Hello from Web3!{" "}
      <Suspense fallback={<span>Loading button…</span>}>
        <Button />
      </Suspense>
    </h1>
  )
}

export default App
