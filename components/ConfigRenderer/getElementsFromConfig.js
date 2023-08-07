import * as chakra from '@chakra-ui/react';
import { omit } from 'lodash';
import { cloneElement, createElement } from 'react';

const getElementFromConfig = (config, onSignal) => {
  if (!config) return null;
  const { type, collect, children, ...otherProps } = config;
  const Component = typeof type === 'string' && (chakra[type] ?? type);

  if (!Component) return null;

  const props = Object.entries(otherProps).reduce((acc, [key, value]) => {
    if (typeof value === 'string' && value.startsWith('signal:')) {
      const signalName = value.replace('signal:', '');
      return Object.assign(acc, {
        [key]: () => {
          const values = collect?.reduce((acc, collectKey) => {
            const el = document.getElementById(collectKey);
            if (!el) return acc;

            return Object.assign(acc, {
              [collectKey]: el.value,
            });
          }, {});

          onSignal?.(signalName, values)
        },
      });
    }

    if (key.startsWith('prop:')) {
      const propName = key.replace('prop:', '');
      acc = Object.assign(acc, {
        [propName]: value,
      });
      key = propName;
    }

    return Object.assign(acc, {
      [key]: value,
    });
  }, {});

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