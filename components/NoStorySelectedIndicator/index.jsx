import { Flex, Heading } from "@chakra-ui/react"

export const NoStorySelectedIndicator = () => {
  return (
    <Flex w="full" h="full" justify="center" align="center">
      <Heading textAlign="center">
        Select a story to begin.
      </Heading>
    </Flex>
  )
}