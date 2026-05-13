// jest.setup.js
import '@testing-library/react-native/extend-expect';

// Mock common Expo modules that cause issues in tests
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
  useSegments: () => [],
  Stack: {
    Screen: jest.fn(),
  },
}));

// Mock expo-secure-store if you use it
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Suppress console errors/warnings during tests (optional)
const originalError = console.error;
console.error = (...args) => {
  if (args[0]?.includes?.('Warning:')) return;
  originalError(...args);
};