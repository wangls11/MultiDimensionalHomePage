module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  compilerOptions: {
    jsx: "react",
  },
  plugins: ["@typescript-eslint", "react"],
  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "no-irregular-whitespace": "off", //这禁止掉 空格报错检查
    "no-unused-vars": "off",
    "react/react-in-jsx-scope": 0,
    "@typescript-eslint/no-explicit-any": 0,
  },
};

