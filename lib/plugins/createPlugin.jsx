import { db } from "@/app/db";

/**
 * Creates a plugin by adding the provided data to the database.
 *
 * @param {any} data - The data to be added to the database.
 * @return {Promise} A Promise that resolves with the result of adding the data to the database.
 */
export default function createPlugin(data) {
  return db.blocks.add({
    type: 'plugin',
    data: JSON.stringify(data),
  })
}