import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default tseslint.config(
   { ignores: ['dist', 'vite.config.ts'] },
   {
      extends: [js.configs.recommended, ...tseslint.configs.recommended],
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
         ecmaVersion: 2020,
         globals: globals.browser,
      },
      plugins: {
         'react-hooks': reactHooks,
         'react-refresh': reactRefresh,
         prettier: eslintPluginPrettier,
      },
      rules: {
         ...reactHooks.configs.recommended.rules,
         'react-refresh/only-export-components': [
            'warn',
            { allowConstantExport: true },
         ],
         'prettier/prettier': [
            // 'warn',
            // {
            //   arrowParens: "always",
            //   semi: false,
            //   trailingComma: "none",
            //   tabWidth: 2,
            //   endOfLine: "auto",
            //   useTabs: false,
            //   singleQuote: true,
            //   printWidth: 120,
            //   jsxSingleQuote: true,
            // },
            // {
            //    arrowParens: 'always',
            //    bracketSameLine: false,
            //    bracketSpacing: true,
            //    embeddedLanguageFormatting: 'auto',
            //    htmlWhitespaceSensitivity: 'css',
            //    insertPragma: false,
            //    printWidth: 80,
            //    quoteProps: 'as-needed',
            //    requirePragma: false,
            //    semi: true,
            //    singleQuote: true,
            //    tabWidth: 3,
            //    useTabs: false,
            //    vueIndentScriptAndStyle: false,
            //    endOfLine: 'lf',
            //    tsxSingleQuote: false,
            //    trailingComma: 'all',
            // },
         ],
      },
   },
);
