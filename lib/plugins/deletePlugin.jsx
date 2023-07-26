import { db } from "@/app/db";

/**
 * Deletes a plugin from the database.
 * @param {string} pluginId - The ID of the plugin to delete.
 * @returns {Promise<void>} - A promise that resolves when the plugin is deleted.
 */
export default function deletePlugin(pluginId) {
  return db.blocks.delete(pluginId)
}