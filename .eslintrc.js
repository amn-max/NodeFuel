module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: "standard-with-typescript",
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    quotes: 0,
    "comma-dangle": 0,
    semi: 0,
    "linebreak-style": 0,
    "space-before-function-paren": 0,
  },
};
