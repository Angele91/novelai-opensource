import { Flex, Heading } from "@chakra-ui/react"

export const NoStorySelectedIndicator = () => {
  return (
    <Flex w="full" h="full" justify="center" align="center">
      <Heading>
        Select a story to begin.
      </Heading>
    </Flex>
  )
}