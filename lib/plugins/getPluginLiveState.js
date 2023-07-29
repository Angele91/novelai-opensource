import { db } from "@/app/db"

/**
 * Returns a function that retrieves the live state of all plugins.
 * @returns {Function} - A function that returns a Promise that resolves to an array of plugin objects.
 */
export default function getPluginLiveState() {
  return async () => {
    const plugins = await db.blocks.where({ type: 'plugin' }).toArray()
    return plugins.map((plugin) => {
      return {
        id: plugin.id,
        ...JSON.parse(plugin.data)
      }
    })
  }
}