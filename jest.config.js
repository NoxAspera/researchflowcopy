
const { createJsWithBabelPreset } = require('ts-jest')

const jsWithBabelPreset = createJsWithBabelPreset({
  tsconfig: 'tsconfig.json',
  babelConfig: true,
})

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'react-native',
  transform: jsWithBabelPreset.transform,
  transformIgnorePatterns: [
    "node_modules/(?!(?:.pnpm/)?((jest-)?react-native||@react-native(-community)?||expo(nent)?||@expo(nent)?/.*||@expo-google-fonts/.*||react-navigation|@react-navigation/.*||@sentry/react-native||native-base||react-native-svg||@ui-kitten/.*||@react-native/js-polyfills/.*))"
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
}