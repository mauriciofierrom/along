import { fixupConfigRules } from "@eslint/compat";
import shopifyEslintPlugin from '@shopify/eslint-plugin';
import pluginJest from 'eslint-plugin-jest';
import globals from 'globals';
import pluginCypress from 'eslint-plugin-cypress/flat';

export default [
  ...fixupConfigRules(shopifyEslintPlugin.configs.esnext),
  ...fixupConfigRules(shopifyEslintPlugin.configs.prettier),
  pluginCypress.configs.globals,
  {
    ignores: ["**/setup.js", "eslint.config.mjs", "**/cypress/support/", "cypress.config.js", "**/controllers/index.js", "**/application.js"],
  },
  {
    files: ["app/javascript/controllers/**/*.js"],
    rules: {
      "import/no-unresolved": "off",
      "import/no-anonymous-default-export": "off",
    },
    languageOptions: {
      globals: {
        ...globals.browser,
      }
    }
  },
  {
    rules: {
      "prettier/prettier": "off",
      "no-console": ["error", { "allow": ["error"]}]
    }
  },
  {
    // update this to match your test files
    files: ['test/javascript/**/*_test.js'],
    plugins: { jest: pluginJest },
    languageOptions: {
      globals: {
        ...pluginJest.environments.globals.globals,
        ...globals.browser,
      },
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
      'no-warning-comments': 'off',
    },
  },
  {
    files: ['cypress/e2e/**/*.cy.js'],
    plugins: { cypresss: pluginCypress },
    rules: {
      ...fixupConfigRules(pluginCypress.configs.recommended).rules,
      'promise/catch-or-return': 'off',
      'promise/no-nesting': 'off',
      'no-warning-comments': 'off',
    }
  }
];
