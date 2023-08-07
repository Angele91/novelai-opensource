import { Promise } from "core-js";
import sendMessageToWorker from "./sendMessageToWorker";

/**
 * Loads the specified plugins into the worker and triggers the PluginLoaded event.
 * @param {Object} options - An object containing the following properties:
 *   - plugins: An array of plugin objects containing the plugin code and name.
 *   - event: The function to trigger the PluginLoaded event.
 *   - states: The states of the plugins.
 *   - worker: The worker to load the plugins into.
 * @returns {Promise} - A Promise that resolves when all plugins have been loaded.
 */
export default async function loadPlugins(options) {
  const { plugins, event, states, worker } = options;
  console.debug("Loading plugins");
  await Promise.allSettled(
    plugins.map(async (plugin) => {
      const { code, name } = plugin;
      await sendMessageToWorker({
        type: "load_plugin",
        successType: "plugin_loaded",
        worker,
        payload: {
          plugin_name: name,
          plugin_code: code,
          plugin_state: states[name],
        },
      });

      await event("PluginLoaded", { name });
      console.debug(`Loaded plugin ${name}`);
    })
  );
};