import { Promise } from "core-js";
import sendMessageToWorker from "./sendMessageToWorker";

/**
 * Sends a message to the worker to trigger an event with the given name and payload.
 * @param {string} eventName - The name of the event to trigger.
 * @param {any} payload - The payload to send with the event.
 * @param {Worker} worker - The worker to send the message to.
 * @returns {Promise<void>} - A Promise that resolves when the message has been sent.
 */
export default function triggerEvent(eventName, payload, worker) {
  if (!worker) {
    return Promise.resolve();
  }

  return sendMessageToWorker({
    type: "event",
    successType: "event_handled",
    worker,
    payload: {
      event_name: eventName,
      payload,
    },
  });
}