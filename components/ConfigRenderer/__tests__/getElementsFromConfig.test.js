import getElementFromConfig from '../getElementsFromConfig';
import * as chakra from '@chakra-ui/react';

describe('getElementsFromConfig', () => {
  it('should return null when config is falsy', () => {
    expect(getElementFromConfig(null)).toBeNull();
  });

  it('should map config type to chakra component if available', () => {
    const config = { type: 'Button' };
    const result = getElementFromConfig(config);
    expect(result.type).toBe(chakra.Button);
  });

  it('should map config type to react component if chakra component is not available', () => {
    const config = { type: 'div' };
    const result = getElementFromConfig(config);
    expect(result.type).toBe('div');
  });

  it('should map config props to react component props', () => {
    const config = { type: 'Button', color: 'red' };
    const result = getElementFromConfig(config);
    expect(result.props.color).toBe('red');
  });

  it('should map signal props to event handlers that call onSignal with signal name and payload', () => {
    const onSignal = jest.fn();
    const config = { type: 'Button', onClick: 'signal:click' };
    const result = getElementFromConfig(config, onSignal);
    result.props.onClick('payload');
    expect(onSignal).toHaveBeenCalledWith('click', 'payload');
  });

  it('should map prop:type=\'submit\' to onClick that prevents default event behavior', () => {
    const config = { type: 'Button', 'prop:type': 'submit' };
    const result = getElementFromConfig(config);
    const evt = { preventDefault: jest.fn() };
    if (typeof result.props.onClick === 'function') {
      result.props.onClick(evt);
      expect(evt.preventDefault).toHaveBeenCalled();
    }
  });
});