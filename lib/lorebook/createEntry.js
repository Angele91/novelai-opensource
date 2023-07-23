import { capitalize } from "lodash";
import { v4 } from "uuid";

/**
 * Creates an entry with the given extras.
 *
 * @param {Object} extras - Additional properties for the entry.
 * @return {Object} The created entry.
 */
export default function createEntry(type, extras = {}) {
  return {
    id: v4(),
    type,
    droppable: type === "category",
    text: `New ${capitalize(type)}`,
    keys: [],
    ...extras,
  }
}