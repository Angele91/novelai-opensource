import { db } from "@/app/db";

/**
 * Creates a new story in the database.
 *
 * @param {string} storyName - The name of the story.
 * @return {Promise} A promise that resolves with the newly created story object.
 */
export default async function createStory(
  storyName,
) {
  const storyId = await db.blocks.add({
    content: JSON.stringify({
      storyName,
    }),
    type: 'story',
  })

  await db.blocks.add({
    parentId: storyId,
    type: 'story-content',
    content: JSON.stringify({}),
  })

  return storyId;
}