'use client'

import { NoStorySelectedIndicator } from "@/components/NoStorySelectedIndicator";
import { RemirrorEditor } from "@/components/RemirrorEditor";
import updateStoryContent from "@/lib/stories/updateStoryContent";
import { currentStorySelector } from "@/state/atoms/stories";
import { currentStoryContent } from "@/state/atoms/storyContents";
import { Flex } from "@chakra-ui/react";
import { useRecoilState } from "recoil";

export default function Story() {
  const [currentStory] = useRecoilState(currentStorySelector);
  const [storyContent] = useRecoilState(currentStoryContent)

  const onStoryChange = async (newStory) => {
    await updateStoryContent(currentStory.id, newStory);
  }
  
  return (
    <Flex w="full" h="full">
      {!currentStory && (
        <NoStorySelectedIndicator />
      )}
      {currentStory && storyContent && (
        <RemirrorEditor
          story={currentStory}
          content={storyContent?.doc}
          onChange={onStoryChange}
          key={currentStory.id}
        />
      )}
    </Flex>
  )
}