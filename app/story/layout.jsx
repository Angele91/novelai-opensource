'use client'

import Sidebar from "@/components/Sidebar";
import { Flex } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { storiesAtom } from "@/state/atoms/stories";

export default function StoryLayout({ children }) {
  const [, setStories] = useRecoilState(storiesAtom);

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

  useEffect(() => {
    setStories(stories);
  }, [setStories, stories])

  return (
    <Flex as="main" h="100vh">
      <Sidebar />
      <Flex flex={1}>
        {children}
      </Flex>
    </Flex>
  )
}