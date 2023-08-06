import { useLiveQuery } from "dexie-react-hooks";
import getPluginLiveState from "../../lib/plugins/getPluginLiveState";
import { useEffect, createContext, useRef, useState, useMemo, useCallback } from "react";
import loadPlugins from "@/lib/plugins/loadPlugins";
import executeHook from "@/lib/plugins/executeHook";
import triggerEvent from "@/lib/plugins/triggerEvent";

const channel = new BroadcastChannel('plugin-executor');

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
  const plugins = useLiveQuery(getPluginLiveState());
  const workerRef = useRef(null);

  const hook = useCallback(async (hookName, payload) => {
    if (!workerRef.current) throw new Error('There is no plugin worker available');
    console.debug(`Executing hook ${hookName} with worker`, workerRef.current.active)
    const result = await executeHook(hookName, payload, workerRef.current.active);
    console.debug(`Hook ${hookName} executed with result`, result)
    return result;
  }, [])

  const event = useCallback(async (eventName, payload) => {
    if (!workerRef.current) throw new Error('There is no plugin worker available');
    console.debug(`Triggering event ${eventName}`)
    const result = await triggerEvent(eventName, payload, workerRef.current.active);
    console.debug(`Event ${eventName} triggered with result`, result)
  }, [])

  useEffect(() => {
    const loadWorker = async () => {
      const workerRegistration = await navigator.serviceWorker.register("/plugin-executor.js");
      workerRef.current = workerRegistration;
      console.debug('Worker loaded')
      await loadPlugins(plugins ?? [], workerRef.current.active, event);
      setInitialized(true);
    };

    if (!initialized && plugins !== undefined) {
      loadWorker();

      channel.addEventListener('message', async (event) => {
        console.debug('Message received', event.data)
        const { type, payload, to } = event.data;
        if (to !== 'client') return;

        switch(type) {
          case 'plugin_config':
            setPluginConfigs((prev) => [...prev, {
              config: payload.config,
              name: payload.plugin_name,
            }]);
            console.debug('Plugin config received', payload);
            break;
        }
      });
    }
  }, [plugins, initialized, event])

  const onSignal = useCallback(async (signalName, payload) => {
    if (!workerRef.current) throw new Error('There is no plugin worker available');
    console.debug(`Triggering signal ${signalName}`)
    channel.postMessage({
      to: 'worker',
      type: 'signal',
      payload: {
        signalName,
        payload,
      },
    });
  }, []);

  const value = useMemo(() => ({
    plugins,
    configs: pluginConfigs,
    hook,
    event,
    onSignal,
  }), [plugins, pluginConfigs, hook, event, onSignal]);

  return (
    <PluginsContext.Provider
      value={value}
    >
      {children}
    </PluginsContext.Provider>
  )
}
