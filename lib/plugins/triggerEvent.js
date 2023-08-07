import sendMessageToWorker from "./sendMessageToWorker";

/**
 * Sends an event to a worker and returns a promise that resolves when the event is handled.
 *
 * @param {Object} options - The options object.
 * @param {string} options.eventName - The name of the event to trigger.
 * @param {Object} options.payload - The payload to send with the event.
 * @param {Worker} options.worker - The worker to send the event to.
 * @returns {Promise} A promise that resolves when the event is handled.
 */
export default function triggerEvent({
  eventName,
  payload,
  worker
}) {
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