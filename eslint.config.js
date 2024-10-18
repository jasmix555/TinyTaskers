import pluginJs from '@eslint/js';
import pluginPrettier from 'eslint-config-prettier';
import pluginReactConfig from 'eslint-plugin-react/configs/recommended.js';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.strict,
  {
    ignores: ['./dist'],
    plugins: {
      react: pluginReactConfig.plugins.react,
      'react-hooks': pluginReactHooks,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...pluginReactConfig.rules,
      'react/react-in-jsx-scope': 'off',
      'react/button-has-type': 'error',
      'react/function-component-definition': [
        2,
        { namedComponents: 'arrow-function' },
      ],
      'react/jsx-no-leaked-render': [
        'error',
        {
          validStrategies: ['ternary'],
        },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
  pluginPrettier,
];
