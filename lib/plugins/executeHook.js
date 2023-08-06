import sendMessageToWorker from "./sendMessageToWorker";

/**
 * Executes a hook by sending a message to a worker and returning the result.
 * @param {string} hookName - The name of the hook to execute.
 * @param {any} payload - The payload to pass to the hook.
 * @param {Worker} worker - The worker to send the message to.
 * @returns {Promise<any>} - A promise that resolves to the result of the hook.
 */
export default async function executeHook(hookName, payload, worker) {
  // If there's no worker, just return the payload
  if (!worker) return payload;

  console.debug(`Hook ${hookName} called with payload`, payload);

  // Send a message to the worker to execute the hook
  const result = await sendMessageToWorker({
    type: "hook",
    successType: "hook_result",
    worker,
    payload: {
      hook_name: hookName,
      payload,
    },
  });

  console.debug(`Hook ${hookName} returned`, result);

  // Return the result of the hook
  return result;
};