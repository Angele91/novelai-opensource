import createStory from "@/lib/stories/createStory";
import { preferencesAtom } from "@/state/atoms/preferences";
import { storiesSelector } from "@/state/atoms/stories"
import { Button, Flex, IconButton, List, Tooltip } from "@chakra-ui/react"
import { BsPlus } from "react-icons/bs";
import { useRecoilState } from "recoil"
import { StoryListItem } from "./StoryListItem";
import { useContext } from "react";
import { PluginsContext } from "../PluginsEditor/PluginsProvider";

export const StoryList = ({ isSidebarOpen }) => {
  const [stories] = useRecoilState(storiesSelector);
  const [preferences, setPreferences] = useRecoilState(preferencesAtom);
  const { hook } = useContext(PluginsContext)

  const onCreateStory = async () => {
    const { story: createdStory } = await hook('CreateStory', {
      story: await createStory('New Story'),
    });

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
      </Button> : (
        <Tooltip label="Add Story">
          <IconButton
            aria-label="Add Story"
            variant="outline"
            icon={<BsPlus />}
            justifySelf="flex-end"
            onClick={onCreateStory}
          />
        </Tooltip>
      )}
    </Flex>

  )
}