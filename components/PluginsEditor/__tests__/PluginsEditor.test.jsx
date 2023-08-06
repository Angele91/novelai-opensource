import { render, screen } from '@testing-library/react';
import { PluginsEditor } from '..';

describe('PluginsEditor', () => {
  it('renders PluginList and PluginEditor components', () => {
    render(<PluginsEditor />);
    const pluginList = screen.getByTestId('plugin-list');
    const pluginEditor = screen.getByTestId('plugin-editor');
    expect(pluginList).toBeInTheDocument();
    expect(pluginEditor).toBeInTheDocument();
  });
});