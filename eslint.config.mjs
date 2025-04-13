import eslintConfig from "@danimexivasco/eslint-config";

export default [
  ...eslintConfig,
  {
    rules: {
      "camelcase": "off"
    }
  }
];