import nx from "@nx/eslint-plugin"

/** Lint for imported sandbox source — boundaries only; do not rewrite satellite style. */
export default [
  ...nx.configs["flat/base"],
  ...nx.configs["flat/javascript"],
  {
    ignores: ["**/out-tsc/**", "**/dist/**", "**/*.vue"],
  },
  {
    files: ["**/*.js", "**/*.mjs"],
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
      "no-unused-vars": "off",
      "no-empty": "off",
    },
  },
]
