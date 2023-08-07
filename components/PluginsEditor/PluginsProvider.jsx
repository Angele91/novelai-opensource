import { useLiveQuery } from "dexie-react-hooks";
import getPluginLiveState from "../../lib/plugins/getPluginLiveState";
import { useEffect, createContext, useRef, useState, useMemo, useCallback } from "react";
import loadPlugins from "@/lib/plugins/loadPlugins";
import executeHook from "@/lib/plugins/executeHook";
import triggerEvent from "@/lib/plugins/triggerEvent";
import { useRecoilState } from "recoil";
import { pluginsStateAtom } from "@/state/atoms/pluginsState";

export const PluginsContext = createContext({
  plugins: [],
  // eslint-disable-next-line no-unused-vars
  hook: (hookName, payload) => null,
  // eslint-disable-next-line no-unused-vars
  event: (eventName, payload) => null,
  configs: [],
  onSignal: null,
})

export const PluginsProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [pluginConfigs, setPluginConfigs] = useState([]);
  const [pluginsState, setPluginsState] = useRecoilState(pluginsStateAtom);
  const plugins = useLiveQuery(getPluginLiveState());
  const workerRef = useRef(null);

  const loadWorker = useCallback(async () => {
    try {
      const worker = new Worker("/plugin-executor.js");
      workerRef.current = worker;
      console.debug('Worker loaded');
      await loadPlugins({
        plugins,
        event,
        states: pluginsState,
        worker: workerRef.current,
      });
      setInitialized(true);
    } catch (error) {
      console.error('Error loading worker', error);
    }
  }, [plugins, event, pluginsState]);

  const unloadWorker = useCallback(async () => {
    try {
      await workerRef.current?.terminate();
      workerRef.current = null;
      console.debug('Worker unloaded');
    } catch (error) {
      console.error('Error terminating worker', error);
    }
  }, []);

  const hook = useCallback(async (hookName, payload) => {
    try {
      console.debug(`Executing hook ${hookName} with worker`);
      const result = await executeHook({
        hookName,
        payload,
        worker: workerRef.current,
      });
      console.debug(`Hook ${hookName} executed with result`, result);
      return result;
    } catch (error) {
      console.error(`Error executing hook ${hookName}`, error);
      throw error;
    }
  }, []);

  const event = useCallback(async (eventName, payload) => {
    try {
      console.debug(`Triggering event ${eventName}`);
      const result = await triggerEvent({
        eventName,
        payload,
        worker: workerRef.current,
      });
      console.debug(`Event ${eventName} triggered with result`, result);
    } catch (error) {
      console.error(`Error triggering event ${eventName}`, error);
    }
  }, []);

  const onSignal = useCallback(async (signalName, payload) => {
    try {
      console.debug(`Triggering signal ${signalName}`);
      workerRef.current.postMessage({
        to: 'worker',
        type: 'signal',
        payload: {
          signal_name: signalName,
          payload,
        },
      });
    } catch (error) {
      console.error(`Error sending signal ${signalName}`, error);
    }
  }, []);

  useEffect(() => {
    if (!workerRef.current && plugins && pluginsState) {
      loadWorker();

      workerRef.current.addEventListener('message', async (event) => {
        console.debug('Message received', event.data);
        const { type, payload, to } = event.data;
        if (to !== 'client') return;

        switch (type) {
          case 'plugin_config':
            setPluginConfigs((prev) => [
              ...prev,
              {
                config: payload.config,
                name: payload.plugin_name,
              },
            ]);
            console.debug('Plugin config received', payload);
            break;
          case 'plugin_state':
            setPluginsState((prev) => ({
              ...prev,
              [payload.plugin_name]: {
                ...prev[payload.plugin_name],
                ...payload.state,
              },
            }));
            break;
          default:
            console.debug(`Unhandled message type ${type}`);
        }
      });
    }
  }, [initialized, loadWorker, plugins, pluginsState, setPluginsState, unloadWorker]);

  useEffect(() => {
    const handleError = (error) => {
      console.error('Error loading plugins', error);
    };

    if (initialized) {
      loadPlugins({
        plugins,
        event,
        states: pluginsState,
      }).catch(handleError);
    }

    return () => {
      // Cleanup code if needed
    };
  }, [initialized, plugins, event, pluginsState]);

  const value = useMemo(() => ({
    plugins,
    configs: pluginConfigs,
    hook,
    event,
    onSignal,
  }), [plugins, pluginConfigs, hook, event, onSignal]);

  if (!pluginsState || !plugins) return null;

  return (
    <PluginsContext.Provider value={value}>
      {children}
    </PluginsContext.Provider>
  );
};
