/* eslint-disable no-undef */
self.state = {
  eventHandlers: [],
  hooks: [],
  loadedPlugins: [],
}

const channel = new BroadcastChannel('plugin-executor');

self.importScripts('https://cdn.jsdelivr.net/npm/acorn/dist/acorn.js');
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js');

function walk(node, callback) {
  callback(node);
  for (const key in node) {
    if (node.hasOwnProperty(key) && typeof node[key] === 'object' && node[key] !== null) {
      walk(node[key], callback);
    }
  }
}

function onLoadPlugin(plugin_name, plugin_code, message_id) {
  if (
    self.state.loadedPlugins.includes(plugin_name)
  ) return;
  // eslint-disable-next-line no-undef
  const ast = acorn.parse(plugin_code, { ecmaVersion: 2020, sourceType: 'plugin' })

  // lets make sure we dont duplicate the same plugin
  self.state.eventHandlers = self.state.eventHandlers.filter(eventHandler => eventHandler.plugin_name !== plugin_name)
  self.state.hooks = self.state.hooks.filter(hook => hook.plugin_name !== plugin_name)

  walk(ast, (node) => {
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
      const functionName = node.id && node.id.name;
      const functionCode = plugin_code.substring(node.start, node.end);

      const obj = {
        name: functionName.replace('on', '').replace('hookInto', ''),
        params: node.params,
        body: functionCode,
        plugin_name,
      };

      if (functionName.startsWith('on')) {
        self.state.eventHandlers.push(obj);
      }

      if (functionName.startsWith('hookInto')) {
        self.state.hooks.push(obj);
      }

      if (functionName === 'config') {
        const fn = new Function(`return (${functionCode})`)()
        const configObject = fn()
        console.debug('[Worker]', 'onLoadPlugin', 'configObject', configObject)
        channel.postMessage({
          to: 'client',
          type: 'plugin_config',
          payload: {
            plugin_name,
            config: configObject,
            message_id,
          }
        });
      }
    }
  })

  return ({
    to: 'client',
    type: 'plugin_loaded',
    payload: {
      plugin_name,
      message_id,
    }
  });
}

function unloadPlugin(plugin_name, message_id) {
  if (
    !self.state.loadedPlugins.includes(plugin_name)
  ) return;

  self.state.eventHandlers = self.state.eventHandlers.filter(eventHandler => eventHandler.plugin_name !== plugin_name)
  self.state.hooks = self.state.hooks.filter(hook => hook.plugin_name !== plugin_name)

  return ({
    to: 'client',
    type: 'plugin_unloaded',
    payload: {
      plugin_name,
      message_id,
    }
  });
}

function onHook(hookName, firstPayload, message_id) {
  console.debug('[Worker]', 'onHook', hookName, firstPayload, message_id)
  const hooks = self.state.hooks.filter(hook => hook.name === hookName)

  console.debug('[Worker]', 'onHook', hooks, self)

  let result = hooks.reduce((acc, hook) => {
    const { body } = hook
    const fn = new Function(`return (${body})`)()
    return fn(acc)
  }, firstPayload.payload)

  if (
    _.isEqual(result, firstPayload.payload)
    || hooks.length === 0
  ) {
    result = null
  }

  return ({
    to: 'client',
    type: 'hook_result',
    payload: {
      hook_name: hookName,
      result,
      message_id,
    }
  });
}

function onEvent(eventName, payload, message_id) {
  const eventHandlers = self.state.eventHandlers.filter(eventHandler => eventHandler.name === eventName)

  let result = eventHandlers.reduce((acc, eventHandler) => {
    const { body } = eventHandler
    const fn = new Function(`return (${body})`)()
    return fn(acc)
  }, payload.payload)

  if (
    _.isEqual(result, payload)
    || eventHandlers.length === 0
  ) {
    result = null
  }

  return ({
    to: 'client',
    type: 'event_handled',
    payload: {
      event_name: eventName,
      result,
      message_id,
    }
  });
}

channel.addEventListener('message', (messageEvent) => {
  const { data } = messageEvent;
  const { type, payload } = data

  if (!payload) return;

  const { plugin_name, plugin_code, hook_name, event_name, message_id, to } = payload

  if (to === 'client') {
    return;
  }

  console.debug('[Worker]', 'onmessage', type, payload, message_id)

  let result = null;

  switch (type) {
    case 'load_plugin':
      result = onLoadPlugin(plugin_name, plugin_code, message_id)
      break;
    case 'hook':
      result = onHook(hook_name, payload, message_id)
      break;
    case 'event':
      result = onEvent(event_name, payload, message_id)
      break;
    case 'unload_plugin':
      result = unloadPlugin(plugin_name, message_id)
      break;
  }

  if (!result) {
    return;
  }

  console.debug('[Worker]', 'onmessage', 'result', result)

  channel.postMessage(result);
});
