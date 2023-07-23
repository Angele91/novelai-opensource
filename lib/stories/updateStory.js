import { db } from "@/app/db";

/**
 * Updates a story.
 *
 * @param {string} storyId - The ID of the story to be updated.
 * @param {object} options - The options for updating the story.
 * @param {string} options.storyName - The new name for the story.
 * @param {string} options.memory - The memory for the story.
 * @param {object} options.lorebook - The lorebook for the story.
 * @return {void} This function does not return anything.
 */
export default async function updateStory (
  storyId,
  props,
) {
  const story = await db.blocks.get(storyId)

  if (!story) {
    throw new Error(`Story with ID "${storyId}" does not exist.`)
  }

  const { content: rawContent } = story
  const content = JSON.parse(rawContent)

  return db.blocks.update(storyId, {
    content: JSON.stringify({
      ...content,
      ...props,
    }),
  })
}