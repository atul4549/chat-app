module.exports = {
  // Change this! Use jest-expo instead of @testing-library/react-native
  preset: "jest-expo",
  
  // Only needed if you must use @testing-library/react-native preset
  // but jest-expo is strongly recommended for Expo projects
  
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg)"
  ],
  
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Optional but helpful additions
  testMatch: [
    '**/__tests__/**/*.test.(ts|tsx|js|jsx)',
    '**/?(*.)+(spec|test).(ts|tsx|js|jsx)'
  ],
  
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    'components/**/*.{ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**'
  ]
}