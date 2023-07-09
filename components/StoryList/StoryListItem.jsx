import deleteStory from "@/lib/stories/deleteStory";
import { preferencesAtom } from "@/state/atoms/preferences";
import { Box, Card, CardBody, Flex, IconButton, Stack, StackDivider, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { BsBook, BsTrash } from "react-icons/bs";
import { useRecoilState } from "recoil";

export const StoryListItem = ({ story, isSidebarOpen }) => {
  const [preferences, setPreferences] = useRecoilState(preferencesAtom);

  const onDeleteStory = async (storyId) => {
    await deleteStory(storyId);
  }

  const onClickStory = () => {
    setPreferences((prefs) => ({
      ...prefs,
      selectedStoryId: story.id,
    }))
  }

  return (
    <Card
      key={story.id}
      as={motion.li}
      border={isSidebarOpen ? undefined : 'none'}
      variant="outline"
      height="120px"
      cursor="pointer"
      borderBottom={isSidebarOpen ? undefined : "1px solid"}
      backgroundColor={preferences.selectedStoryId === story.id ? "InfoBackground" : undefined}
      onClick={onClickStory}
    >
      <CardBody>
        <Stack
          divider={<StackDivider />}
          justify={isSidebarOpen ? undefined : 'center'}
          align={isSidebarOpen ? undefined : "center"}
          h="full"
        >
          <Box>
            <Text fontSize="lg" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">
              {isSidebarOpen ? story.storyName : story.storyName.charAt(0)}
            </Text>
          </Box>
          {isSidebarOpen && <Flex justify="flex-end">
            <IconButton
              icon={<BsTrash />}
              onClick={() => onDeleteStory(story.id)} />
          </Flex>}
        </Stack>
      </CardBody>
    </Card>
  );
}