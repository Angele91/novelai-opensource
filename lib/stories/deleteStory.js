import { db } from "@/app/db";
import { isEmpty, isNull, isUndefined } from "lodash";

/**
 * Deletes a story from the database.
 *
 * @param {any} storyId - The ID of the story to be deleted.
 * @throws {Error} If no story ID is provided.
 * @return {Promise} A promise that resolves when the story is deleted.
 */
export default function deleteStory(
  storyId
) {
  if (isNull(storyId) || isUndefined(storyId)) {
    throw new Error("Can't delete a story if no story ID is provided.")
  }

  return db.blocks.delete(storyId);
}