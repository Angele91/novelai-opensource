import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddEntryButton } from './AddEntryButton';

describe('AddEntryButton', () => {
  it('renders the component with children', () => {
    render(<AddEntryButton>Test Button</AddEntryButton>);

    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('renders the component with the correct props', () => {
    render(
      <AddEntryButton
        as="a"
        href="#"
        onAddChild={() => {}}
        data-testid="add-entry-button"
      >
        Test Button
      </AddEntryButton>
    );

    const buttonElement = screen.getByTestId('add-entry-button');

    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveAttribute('href', '#');
    expect(buttonElement).toHaveAttribute('data-no-dnd', 'true');
  });

  it('opens the menu when the button is clicked', async () => {
    render(<AddEntryButton onAddChild={() => {}} />);

    const buttonElement = screen.getByLabelText('Add');
    fireEvent.click(buttonElement);

    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    })
  });

  it('calls the onAddChild function with the correct argument when a menu item is clicked', () => {
    const onAddChild = jest.fn();
    render(<AddEntryButton onAddChild={(cat) => onAddChild(cat)} />);

    const categoryMenuItem = screen.getByText('Category');
    fireEvent.click(categoryMenuItem);

    expect(onAddChild).toHaveBeenCalledWith('category');

    const itemMenuItem = screen.getByText('Item');
    fireEvent.click(itemMenuItem);

    expect(onAddChild).toHaveBeenCalledWith('item');
  });
});