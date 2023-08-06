import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColorModeSwitch from '..';
import { useColorMode, useStyleConfig } from '@chakra-ui/react';

jest.mock('@chakra-ui/react', () => ({
  ...jest.requireActual('@chakra-ui/react'),
  useColorMode: jest.fn(),
  useStyleConfig: jest.fn(),
}));

describe('ColorModeSwitch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component', () => {
    useColorMode.mockReturnValueOnce({ colorMode: 'light', toggleColorMode: jest.fn() });
    useStyleConfig.mockReturnValueOnce({});

    render(<ColorModeSwitch />);

    expect(screen.getByTestId('color-mode-switch-container')).toBeInTheDocument();
    expect(screen.getByTestId('color-mode-switch')).toBeInTheDocument();
    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
  });

  it('toggles the color mode when the switch is clicked', async () => {
    const toggleColorMode = jest.fn();
    useColorMode.mockReturnValueOnce({ colorMode: 'light', toggleColorMode });
    useStyleConfig.mockReturnValueOnce({});

    render(<ColorModeSwitch />);

    const switchElement = screen.getByTestId('color-mode-switch');
    userEvent.click(switchElement);

    await waitFor(() => expect(toggleColorMode).toHaveBeenCalledTimes(1));
  });
});