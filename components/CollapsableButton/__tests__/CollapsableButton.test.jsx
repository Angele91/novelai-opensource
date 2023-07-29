import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CollapsableButton from '..';

describe('CollapsableButton', () => {
  it('renders button with label', () => {
    render(<CollapsableButton isOpen label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('renders icon button with icon', () => {
    render(<CollapsableButton icon="plus" isOpen />);
    expect(screen.getByText('plus')).toBeInTheDocument();
  });

  it('renders button with abbreviated label as icon', () => {
    render(<CollapsableButton label="Click me now" />);
    expect(screen.getByText('CLI')).toBeInTheDocument();
  });

  it('renders tooltip with label when not open', async () => {
    render(<CollapsableButton label="Click me" />);
    expect(screen.queryByText('Click me')).not.toBeInTheDocument();
    userEvent.hover(screen.getByText('CLI'));
    await waitFor(() => {
      expect(screen.queryByText('Click me')).toBeVisible();
    });
  });

  it('does not render tooltip with label when open', async () => {
    render(<CollapsableButton label="Click me" isOpen />);
    userEvent.hover(screen.getByText('Click me'));
    await waitFor(() => {
      expect(screen.queryByTestId('collapsable-button-tooltip')).not.toBeInTheDocument();
    });
  });

  it('calls onClick when button is clicked', async () => {
    const handleClick = jest.fn();
    render(<CollapsableButton label="Click me" onClick={handleClick} />);
    userEvent.click(screen.getByTestId('collapsable-button'));
    await waitFor(() => {
      expect(handleClick).toHaveBeenCalled();
    });
  });
});