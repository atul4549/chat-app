// // // __tests__/HomeScreen-test.tsx
// // import { render, screen } from '@testing-library/react-native';
// // import HomeScreen from '@/app/index'; // Use the proper component name

// // describe('HomeScreen', () => {
// //   it('renders the welcome text', () => {
// //     render(<HomeScreen />);
// //     expect(screen.getByText('Welcome!')).toBeTruthy();
// //   });

// //   it('matches snapshot', () => {
// //     const { toJSON } = render(<HomeScreen />);
// //     expect(toJSON()).toMatchSnapshot();
// //   });
// // });

// // __tests__/HomeScreen-test.tsx

import { render, screen } from '@testing-library/react-native';
import Index from '../app/index'; // Capitalize the import name

describe('Index Component', () => {
  test("snapshot of index", () => {
    const { toJSON } = render(<Index />);
    expect(toJSON()).toMatchSnapshot();
  });
  
  test("renders welcome text", () => {
    render(<Index />);
    expect(screen.getByText('Welcome!')).toBeTruthy();
  });
});

// __tests__/HomeScreen-test.tsx
// import { render, screen } from '@testing-library/react-native';
// import HomeScreen from '@/app/index'; // Adjust path to your component

// describe('<HomeScreen />', () => {
//   it('renders the welcome text', () => {
//     render(<HomeScreen />);
//     // Check if an element with the text "Welcome!" is on the screen
//     expect(screen.getByText('Welcome!')).toBeTruthy();
//   });
// });