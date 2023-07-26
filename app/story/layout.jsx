'use client'

import Sidebar from "@/components/Sidebar";
import { Flex } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { currentStorySelector, storiesAtom } from "@/state/atoms/stories";
import { StoryList } from "@/components/StoryList";
import { StorySettings } from "@/components/StorySettings";
import { storyContentsAtom } from "@/state/atoms/storyContents";
import { Lorebook } from "@/components/Lorebook";

export default function StoryLayout({ children }) {
  const [, setStories] = useRecoilState(storiesAtom);
  const [, setStoryContents] = useRecoilState(storyContentsAtom);
  const [currentStory] = useRecoilState(currentStorySelector)

  const stories = useLiveQuery(
    async () => {
      const stories = await db.blocks
        .where('type')
        .equals('story')
        .toArray()

      return stories;
    },
    []
  )

  const storyContents = useLiveQuery(
    async () => {
      return await db.blocks
        .where('type')
        .equals('story-content')
        .toArray()
    },
    []
  )

  useEffect(() => {
    setStories(stories);
  }, [setStories, stories])

  useEffect(() => {
    setStoryContents(storyContents)
  }, [setStoryContents, storyContents])

  return (
    <Flex as="main" h="100vh" flexDir="column">
      <Flex flex={1}>
        <Sidebar>
          {({ isSidebarOpen }) => (
            <StoryList isSidebarOpen={isSidebarOpen} />
          )}
        </Sidebar>
        <Flex flex={1}>
          <Lorebook />
          {children}
        </Flex>
        {currentStory && (
          <Sidebar side="right">
            {({ isSidebarOpen }) => (
              <StorySettings isSidebarOpen={isSidebarOpen} />
            )}
          </Sidebar>
        )}
      </Flex>

    </Flex>
  )
}