import { db } from "@/app/db";
import { isEmpty } from "lodash";
import getStoryContent from "./getStoryContent";

export default async function updateStoryContent(
  storyId,
  content = {}
) {
  const storyContent = await getStoryContent(storyId)
  const contentId = storyContent?.id;

    if (!contentId) {
      console.log('Adding new story content')
      await db.blocks.add({
        parentId: storyId,
        type: 'story-content',
        content: JSON.stringify(content),
      })
      return;
    }

    await db.blocks.update(
      contentId,
      {
        ...storyContent,
        content: JSON.stringify(content)
      }
    )
}