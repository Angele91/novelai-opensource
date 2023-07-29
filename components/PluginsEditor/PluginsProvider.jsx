import { useLiveQuery } from "dexie-react-hooks";
import getPluginLiveState from "../../lib/plugins/getPluginLiveState";
import { v4 } from "uuid";
import { Promise } from "core-js";
import { useEffect, createContext, useRef, useState } from "react";

export const PluginsContext = createContext({
  plugins: [],
  // eslint-disable-next-line no-unused-vars
  hook: (hookName, payload) => null,
  // eslint-disable-next-line no-unused-vars
  event: (eventName, payload) => null,
})

const sendMessageToWorker = ({
  type,
  payload,
  successType,
  worker,
}) => {
  const messageId = v4()

  return new Promise((resolve, reject) => {
    worker.addEventListener('message', (event) => {
      const { type: eventType, payload: eventPayload } = event.data;
      console.debug('Received from Worker:', event)
      if (eventType === successType && eventPayload?.message_id === messageId) {
        resolve(eventPayload.result)
      } else if (payload.eventMessageId === messageId) {
        reject(eventPayload)
      }
    })

    const messageToBeSent = {
      type,
      payload: {
        ...payload,
        message_id: messageId,
      },
    }

    worker.postMessage(messageToBeSent);
  })
}

export const PluginsProvider = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const plugins = useLiveQuery(getPluginLiveState());
  const workerRef = useRef(null);

  const hook = async (hookName, payload) => {
    if (!workerRef.current) return payload;

    console.debug(`Hook ${hookName} called with payload`, payload)

    const result = await sendMessageToWorker({
      type: "hook",
      successType: "hook_result",
      worker: workerRef.current,
      payload: {
        hook_name: hookName,
        payload,
      },
    })

    console.debug(`Hook ${hookName} returned`, result)

    return result;
  }


  const event = (eventName, payload) => {
    if (!workerRef.current) return;

    return sendMessageToWorker({
      type: "event",
      successType: "event_handled",
      worker: workerRef.current,
      payload: {
        event_name: eventName,
        payload,
      },
    })
  }

  useEffect(() => {
    const loadPlugins = async () => {
      console.debug('Loading plugins')
      workerRef.current = new Worker('/plugin-executor.js')
      await Promise.all(plugins.map(async (plugin) => {
        const { code, name } = plugin;
        await sendMessageToWorker({
          type: "load_plugin",
          successType: "plugin_loaded",
          worker: workerRef.current,
          payload: {
            plugin_name: name,
            plugin_code: code,
          },
        })

        await event('PluginLoaded', { name })
        console.debug(`Loaded plugin ${name}`)

        setInitialized(true)
      }))
    }

    if (plugins?.length > 0 && !initialized) {
      loadPlugins()
    }
  }, [plugins, initialized])
  
  return (
    <PluginsContext.Provider
      value={{
        plugins,
        hook,
        event,
      }}
    >
      {children}
    </PluginsContext.Provider>
  )
}
