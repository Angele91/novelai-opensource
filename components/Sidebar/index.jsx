import { IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Flex } from "@chakra-ui/layout";
import { motion } from "framer-motion";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import { StoryList } from "../StoryList";

export default function Sidebar() {
  const { isOpen: isSidebarOpen, getButtonProps } = useDisclosure({
    defaultIsOpen: true
  });

  return (
    <Flex
      bgColor="InfoBackground"
      as={motion.div}
      animate={{ width: isSidebarOpen ? '300px' : '60px' }}
      transition="0.5 linear"
      boxShadow="dark-lg"
      flexDir="column"
      pt={2}
      pb={2}
      px={isSidebarOpen ? 2 : 0}
      alignItems={isSidebarOpen ? undefined : 'center'}
      gap={2}
    >
      <Flex
        justify="flex-end"
      >
        <IconButton
          icon={isSidebarOpen ? <BsChevronLeft /> : <BsChevronRight />}
          {...getButtonProps()}
        />
      </Flex>
      <StoryList isSidebarOpen={isSidebarOpen} />
    </Flex>
  )
}