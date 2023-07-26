import { db } from "@/app/db"

/**
 * Retrieves a plugin object from the database based on the provided plugin ID.
 *
 * @param {string} pluginId - The ID of the plugin to retrieve.
 * @return {Promise<object>} A Promise that resolves to the plugin object with the specified ID, including its ID and data.
 */
export default function getPlugin(pluginId) {
  return db.blocks.get(pluginId)
    .then((plugin) => {
      return {
        id: plugin.id,
        ...JSON.parse(plugin.data)
      }
    })
}