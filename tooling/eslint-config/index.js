/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "react", "react-hooks", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  settings: {
    react: { version: "detect" },
  },
  rules: {
    // Architecture boundary — no cross-feature imports
    "import/no-restricted-paths": [
      "error",
      {
        zones: [
          // engines must never import from UI
          {
            target: "./packages/engines",
            from: "./packages/design-system",
            message: "Engines must not import from the design system.",
          },
          {
            target: "./packages/engines",
            from: "./apps/web/src",
            message: "Engines must not import from the app.",
          },
        ],
      },
    ],

    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/consistent-type-imports": "error",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
  },
};
