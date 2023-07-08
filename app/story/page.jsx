'use client'

import { Editor } from "@/components/Editor";
import { NoStorySelectedIndicator } from "@/components/NoStorySelectedIndicator";
import { currentStorySelector } from "@/state/atoms/stories";
import { Flex } from "@chakra-ui/react";
import { useRecoilState } from "recoil";

export default function Story() {
  const [currentStory] = useRecoilState(currentStorySelector);
  
  return (
    <Flex w="full" h="full">
      {!currentStory && (
        <NoStorySelectedIndicator />
      )}
      {currentStory && (
        <Editor story={currentStory} />
      )}
    </Flex>
  )
}