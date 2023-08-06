import { render, screen, fireEvent } from '@testing-library/react';
import PluginList from '../PluginList';

describe('PluginList', () => {
  const plugins = [
    { id: 1, name: 'Plugin 1', code: 'console.log("Plugin 1")' },
    { id: 2, name: 'Plugin 2', code: 'console.log("Plugin 2")' },
  ];

  it('renders a list of plugins', () => {
    render(<PluginList plugins={plugins} />);
    const pluginItems = screen.getAllByRole('listitem');
    expect(pluginItems.length).toBe(2);
  });

  it('selects a plugin when clicked', () => {
    const setSelectedPluginId = jest.fn();
    render(
      <PluginList
        plugins={plugins}
        selectedPluginId={1}
        setSelectedPluginId={setSelectedPluginId}
      />
    );
    const pluginItem = screen.getByText('Plugin 2');
    fireEvent.click(pluginItem);
    expect(setSelectedPluginId).toHaveBeenCalledWith(2);
  });

  it('deletes a plugin when delete button is clicked', () => {
    const deletePlugin = jest.fn();
    render(<PluginList plugins={plugins} onDeletePlugin={deletePlugin} />);
    const deleteButton = screen.getAllByLabelText('Delete')[0];
    fireEvent.click(deleteButton);
    expect(deletePlugin).toHaveBeenCalledWith(1);
  });
});