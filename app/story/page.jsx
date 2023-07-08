'use client'

import { Editor } from "@/components/Editor";
import { NoStorySelectedIndicator } from "@/components/NoStorySelectedIndicator";
import getStoryContent from "@/lib/stories/getStoryContent";
import updateStoryContent from "@/lib/stories/updateStoryContent";
import { currentStorySelector } from "@/state/atoms/stories";
import { currentStoryContent } from "@/state/atoms/storyContents";
import { Flex } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useRecoilState } from "recoil";

export default function Story() {
  const [currentStory] = useRecoilState(currentStorySelector);
  const [storyContent] = useRecoilState(currentStoryContent)

  const onStoryChange = (newStory) => {
    updateStoryContent(currentStory.id, newStory);
  }
  
  return (
    <Flex w="full" h="full">
      {!currentStory && (
        <NoStorySelectedIndicator />
      )}
      {currentStory && storyContent && (
        <Editor
          story={currentStory}
          content={storyContent?.doc}
          onChange={onStoryChange}
        />
      )}
    </Flex>
  )
}