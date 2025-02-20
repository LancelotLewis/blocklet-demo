module.exports = {
  printWidth: 120,
  useTabs: false,
  tabWidth: 2,
  trailingComma: 'all',
  bracketSameLine: true,
  semi: true,
  singleQuote: true,
  importOrder: ['^@core/(.*)$', '^@server/(.*)$', '^@ui/(.*)$', '^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
};
