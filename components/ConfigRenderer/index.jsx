import { Fragment } from 'react';
import getElementFromConfig from './getElementsFromConfig';

const ConfigRenderer = ({ config, onSignal }) => {
  const actualConfig = Array.isArray(config) ? config : [config];

  return actualConfig.map((config, index) => {
    const element = getElementFromConfig(config, onSignal);

    return (
      <Fragment key={index}>
        {element}
      </Fragment>
    );
  });
}

export default ConfigRenderer;