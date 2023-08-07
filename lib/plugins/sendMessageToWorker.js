import { Promise } from "core-js";
import { v4 } from "uuid";

/**
 * Sends a message to a worker and returns a promise that resolves with the result of the worker's response.
 * @param {Object} options - The options object.
 * @param {string} options.type - The type of message to send to the worker.
 * @param {Object} options.payload - The payload to send to the worker.
 * @param {string} options.successType - The type of message that the worker should respond with on success.
 * @param {string} options.worker - The worker to send the message to.
 * @returns {Promise} A promise that resolves with the result of the worker's response.
 */
export default function sendMessageToWorker({
  type,
  payload,
  successType,
  worker,
}) {
  const messageId = v4()

  return new Promise((resolve, reject) => {
    worker.addEventListener('message', (event) => {
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

   worker.postMessage(messageToBeSent);
  })
}
