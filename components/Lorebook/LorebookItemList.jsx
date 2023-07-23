import { Flex, Text } from "@chakra-ui/react"
import { useLorebook } from "./LorebookContext"
import { LorebookItem } from "./LorebookItem";
import { useDroppable } from "@dnd-kit/core";

export const LorebookItemList = () => {
  const { entries } = useLorebook()

  const { setNodeRef } = useDroppable({
    id: 'root',
    data: {
      id: 'root',
    }
  })

  if ((entries ?? []).length === 0) {
    return (
      <Flex
        flexDir="column"
        gap={2}
        flex={1}
      >
        <Text
          fontSize="xl"
          fontWeight="bold"
        >
          No entries yet.
        </Text>
      </Flex>
    )
  }

  return (
    <Flex
      flexDir="column"
      flex={1}
      gap={2}
      ref={setNodeRef}
    >
      {entries.filter(entry => !entry.parent).map((entry) => (
        <LorebookItem
          key={entry.id}
          entry={entry}
        />
      ))}
    </Flex>

  )
}