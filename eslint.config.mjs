import antfu from '@antfu/eslint-config'
import globals from 'globals'

export default antfu(
  {
    typescript: {
      tsconfigPath: 'tsconfig.json',
    },
  },
  { languageOptions: { globals: globals.node } },
  {
    rules: {
      'no-console': 'warn',
      'unused-imports/no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_[^_].*$|^_$',
          varsIgnorePattern: '^_[^_].*$|^_$',
          caughtErrorsIgnorePattern: '^_[^_].*$|^_$',
        },
      ],
    },
  },
)
