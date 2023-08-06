import { Promise } from "core-js";
import { v4 } from "uuid";

/**
 * Sends a message to a worker and returns a promise that resolves with the result of the worker's response.
 * @param {Object} options - The options object.
 * @param {string} options.type - The type of message to send to the worker.
 * @param {Object} options.payload - The payload to send to the worker.
 * @param {string} options.successType - The type of message that the worker should respond with on success.
 * @returns {Promise} A promise that resolves with the result of the worker's response.
 */
export default function sendMessageToWorker({
  type,
  payload,
  successType,
}) {
  const messageId = v4()
  const channel = new BroadcastChannel('plugin-executor');

  return new Promise((resolve, reject) => {
    channel.addEventListener('message', (event) => {
      const { type: eventType, payload: eventPayload } = event.data;
      if (eventType === successType && eventPayload?.message_id === messageId) {
        resolve(eventPayload.result)
      } else if (eventPayload?.message_id === messageId) {
        reject(eventPayload)
      }
    }, {
      once: true,
    })

    const messageToBeSent = {
      type,
      payload: {
        ...payload,
        message_id: messageId,
      },
    }

   channel.postMessage(messageToBeSent);
  })
}
