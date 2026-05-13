// __tests__/Button-test.tsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text, TouchableOpacity } from 'react-native';

const Button = ({ onPress, title }: any) => (
  <TouchableOpacity onPress={onPress} testID="button">
    <Text>{title}</Text>
  </TouchableOpacity>
);

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button title="Click me" onPress={() => {}} />);
    expect(screen.getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button title="Press" onPress={onPress} />);
    
    fireEvent.press(screen.getByTestId('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});