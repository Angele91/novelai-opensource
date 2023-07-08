import { db } from "@/app/db";
import { first, isEmpty } from "lodash";

export default async function getStoryContent(storyId) {
  if (!storyId) return []

  const dbStoryContent = await db.blocks
  .where('parentId')
  .equals(Number(storyId))
  .filter((block) => block.type === 'story-content')
  .toArray();

  if (isEmpty(dbStoryContent)) return []

  const { content: rawStoryContent, id } = first(dbStoryContent)
  const storyContent = JSON.parse(rawStoryContent)

  return ({
    ...storyContent,
    id: id,
  });
}