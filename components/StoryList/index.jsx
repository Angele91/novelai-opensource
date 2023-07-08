import createStory from "@/lib/stories/createStory";
import deleteStory from "@/lib/stories/deleteStory";
import { preferencesAtom } from "@/state/atoms/preferences";
import { storiesSelector } from "@/state/atoms/stories"
import { Box, Button, Card, CardBody, Flex, IconButton, List, ListItem, Stack, StackDivider, Text, Tooltip } from "@chakra-ui/react"
import { motion } from "framer-motion";
import { BsBook, BsBookFill, BsPlus, BsTrash } from "react-icons/bs";
import { useRecoilState } from "recoil"
import { StoryListItem } from "./StoryListItem";

export const StoryList = ({ isSidebarOpen }) => {
  const [stories] = useRecoilState(storiesSelector);
  const [preferences, setPreferences] = useRecoilState(preferencesAtom);

  const onCreateStory = async () => {
    const createdStory = await createStory('New story');
    setPreferences({
      ...preferences || {},
      selectedStoryId: createdStory,
    })
  }

  return (
    <Flex gap={2} flexDir="column" h="full" w="full">
      <List
        listStyleType="none"
        display="flex"
        flexDir="column"
        w="full"
        h="full"
        flex={1}
        flexShrink={0}
        overflowY="auto"
        gap={1}
      >
        {stories.map((story) => (
          <StoryListItem key={story.id} story={story} isSidebarOpen={isSidebarOpen} />
        ))}
      </List>
      {isSidebarOpen ? <Button
        variant="outline"
        leftIcon={<BsPlus />}
        justifySelf="flex-end"
        onClick={onCreateStory}
      >
        Add Story
      </Button> : <IconButton 
        aria-label="Add Story"
        variant="outline"
        icon={<BsPlus />}
        justifySelf="flex-end"
        onClick={onCreateStory}
      />}
    </Flex>

  )
}