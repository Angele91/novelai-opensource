import deleteStory from "@/lib/stories/deleteStory";
import { Box, Card, CardBody, Flex, IconButton, Stack, StackDivider, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { BsBook, BsTrash } from "react-icons/bs";

export const StoryListItem = ({ story, isSidebarOpen }) => {
  const onDeleteStory = async (storyId) => {
    await deleteStory(storyId);
  }

  return (
    <Card
      key={story.id}
      as={motion.li}
      border={isSidebarOpen ? undefined : 'none'}
      variant="outline"
      height="120px"
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