import { PluginsContext } from '@/components/PluginsEditor/PluginsProvider';
import { useContext } from 'react';

/**
 * Custom hook that provides access to the plugins, hook and event functions from the PluginsContext.
 * @returns {Object} An object containing the plugins, executeHook and triggerEvent functions.
 */
const usePlugins = () => {
  const { plugins, hook, event, onSignal, configs } = useContext(PluginsContext);

  /**
   * Executes a hook with the given name and payload.
   * @param {string} hookName - The name of the hook to execute.
   * @param {Object} payload - The payload to pass to the hook function.
   * @returns {Promise} A promise that resolves with the result of the hook function, or null if an error occurs.
   */
  const executeHook = async (hookName, payload) => {
    try {
      const result = await hook(hookName, payload);
      return result;
    } catch (error) {
      console.error(`Error executing hook ${hookName}:`, error);
      return null;
    }
  };

  /**
   * Triggers an event with the given name and payload.
   * @param {string} eventName - The name of the event to trigger.
   * @param {Object} payload - The payload to pass to the event function.
   * @returns {Promise} A promise that resolves when the event has been triggered, or rejects if an error occurs.
   */
  const triggerEvent = async (eventName, payload) => {
    try {
      await event(eventName, payload);
    } catch (error) {
      console.error(`Error triggering event ${eventName}:`, error);
    }
  };

  return {
    plugins,
    configs,
    onSignal,
    executeHook,
    triggerEvent,
  };
};

export default usePlugins;
