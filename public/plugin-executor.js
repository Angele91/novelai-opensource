self.state = {
  eventHandlers: [],
  hooks: [],
}

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
  // eslint-disable-next-line no-undef
  const ast = acorn.parse(plugin_code, { ecmaVersion: 2020, sourceType: 'plugin' })

  // lets make sure we dont duplicate the same plugin
  self.state.eventHandlers = self.state.eventHandlers.filter(eventHandler => eventHandler.plugin_name !== plugin_name)
  self.state.hooks = self.state.hooks.filter(hook => hook.plugin_name !== plugin_name)

  walk(ast, (node) => {
    if (node.type === 'FunctionDeclaration' || node.type === 'FunctionExpression') {
      const functionName = node.id && node.id.name;
      const functionBody = plugin_code.substring(node.body.start, node.body.end);

      const obj = {
        name: functionName.replace('on', '').replace('hookInto', ''),
        body: functionBody,
        plugin_name,
      };

      if (functionName.startsWith('on')) {
        self.state.eventHandlers.push(obj);
      }

      if (functionName.startsWith('hookInto')) {
        self.state.hooks.push(obj);
      }
    }
  })

  self.postMessage({
    type: 'plugin_loaded',
    payload: {
      plugin_name,
      message_id,
    }
  });
}

function unloadPlugin(plugin_name, message_id) {
  self.state.eventHandlers = self.state.eventHandlers.filter(eventHandler => eventHandler.plugin_name !== plugin_name)
  self.state.hooks = self.state.hooks.filter(hook => hook.plugin_name !== plugin_name)

  self.postMessage({
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
    const fn = new Function('payload', body)
    return fn(acc)
  }, firstPayload.payload)

  // eslint-disable-next-line no-undef
  if (_.isEqual(result, firstPayload.payload)) {
    result = null
  }

  self.postMessage({
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
    const fn = new Function('payload', body)
    return fn(acc)
  }, payload.payload)

  // eslint-disable-next-line no-undef
  if (_.isEqual(result, payload)) {
    result = null
  }

  self.postMessage({
    type: 'event_handled',
    payload: {
      event_name: eventName,
      result,
      message_id,
    }
  });
}

self.addEventListener('message', (messageEvent) => {
  const { data } = messageEvent;
  const { type, payload } = data

  const { plugin_name, plugin_code, hook_name, event_name, message_id } = payload

  console.debug('[Worker]', 'onmessage', type, payload, message_id)

  switch (type) {
    case 'load_plugin':
      onLoadPlugin(plugin_name, plugin_code, message_id)
      return
    case 'hook':
      onHook(hook_name, payload, message_id)
      return
    case 'event':
      onEvent(event_name, payload, message_id)
      return
    case 'unload_plugin':
      unloadPlugin(plugin_name, message_id)
      return
  }

  self.postMessage(`Unknown instruction: ${JSON.stringify(data, null, 2)}`);
});
