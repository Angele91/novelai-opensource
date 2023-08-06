import * as chakra from '@chakra-ui/react';
import { omit } from 'lodash';
import { cloneElement, createElement } from 'react';

const getElementFromConfig = (config, onSignal) => {
  if (!config) return null;
  const { type, children, ...otherProps } = config;
  const Component = chakra[type] ?? type;

  const props = Object.entries(otherProps).reduce((acc, [key, value]) => {
    if (typeof value === 'string' && value.startsWith('signal:')) {
      const signalName = value.replace('signal:', '');
      return Object.assign(acc, {
        [key]: (payload) => onSignal?.(signalName, payload),
      });
    }

    if (key.startsWith('prop:')) {
      const propName = key.replace('prop:', '');
      return Object.assign(acc, {
        [propName]: value,
      });
    }

    if (key === 'onClick' && acc.type === 'Button' && acc['prop:type'] === 'submit') {
      return Object.assign(acc, {
        onClick: (evt) => {
          evt.preventDefault();
          value(evt);
        },
      });
    }

    if (key === 'prop:type' && value === 'submit') {
      return Object.assign(acc, {
        onClick: (evt) => evt.preventDefault(),
      });
    }

    return Object.assign(acc, {
      [key]: value,
    });
  }, {});

  if (!Component) return null;

  const childrenIsString = typeof children === 'string';

  if (childrenIsString) {
    return createElement(Component, props, children);
  };

  const childrenArr = (Array.isArray(children) ? children : [children]).filter(Boolean);
  const childrenElements = childrenArr?.map((child, index) => {
    let sanitizedChild = child;

    if (
      ['Input', 'Textarea', 'input', 'textarea'].includes(sanitizedChild.type)
      && sanitizedChild?.children
    ) {
      sanitizedChild = omit(sanitizedChild, ['children']);
    }

    return cloneElement(
      getElementFromConfig(sanitizedChild, onSignal),
      {
        key: index,
      }
    );
  });

  return createElement(Component, props, childrenElements.length ? childrenElements : undefined);
};

export default getElementFromConfig;