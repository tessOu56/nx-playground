import nx from "@nx/eslint-plugin"

/** Lint for sandbox MFE source — boundaries only. */
export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/javascript"],
  {
    ignores: ["**/out-tsc/**", "**/dist/**"],
  },
  {
    files: ["**/*.js", "**/*.jsx", "**/*.mjs"],
    rules: {
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: "*",
              onlyDependOnLibsWithTags: ["*"],
            },
          ],
        },
      ],
    },
  },
]
