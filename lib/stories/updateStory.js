import { db } from "@/app/db";

/**
 * Updates a story.
 *
 * @param {string} storyId - The ID of the story to be updated.
 * @param {object} options - The options for updating the story.
 * @param {string} options.storyName - The new name for the story.
 * @return {void} This function does not return anything.
 */
export default function updateStory (
  storyId,
  { storyName }
) {
  return db.blocks.update(storyId, {
    content: JSON.stringify({
      storyName,
    }),
  })
}