import { IconButton } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Flex } from "@chakra-ui/layout";
import { motion } from "framer-motion";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";

export default function Sidebar({
  side = 'left',
  children,
}) {
  const { isOpen: isSidebarOpen, getButtonProps } = useDisclosure({
    defaultIsOpen: true
  });

  return (
    <Flex
      as={motion.div}
      animate={{ width: isSidebarOpen ? '300px' : '60px' }}
      transition="0.5 linear"
      boxShadow="dark-lg"
      flexDir="column"
      pt={2}
      pb={2}
      px={2}
      alignItems={isSidebarOpen ? undefined : 'center'}
      gap={2}
    >
      <Flex
        justify={side === 'left' ? "flex-end" : 'flex-start'}
      >
        <IconButton
          icon={
            isSidebarOpen ? (
              side === 'left' ? <BsChevronLeft /> : <BsChevronRight />
            ) : (
              side === 'left' ? <BsChevronRight /> : <BsChevronLeft />
            )}
          {...getButtonProps()}
        />
      </Flex>
      {typeof children === 'function' ? children({ isSidebarOpen }) : children}
    </Flex>
  )
}