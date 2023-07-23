import updateStory from "@/lib/stories/updateStory";
import { preferencesAtom } from "@/state/atoms/preferences";
import { currentStorySelector } from "@/state/atoms/stories";
import { Button, Flex, FormControl, FormLabel, IconButton, Textarea, Tooltip } from "@chakra-ui/react"
import { useState } from "react";
import { BsBook } from "react-icons/bs";
import { useRecoilState } from "recoil";

export const MemoryTab = ({ isSidebarOpen }) => {
  const [, setPreferences] = useRecoilState(preferencesAtom)
  const [currentStory] = useRecoilState(currentStorySelector);
  const [currentMemoryValue, setCurrentMemoryValue] = useState(currentStory?.memory || '')
  const [currentAuthorNotesValue, setCurrentAuthorNotesValue] = useState(currentStory?.authorNotes || '')

  const onMemoryChange = async (event) => {
    const { value } = event.target;
    await updateStory(currentStory.id, { memory: value })
  }

  const onAuthorNotesChange = async (event) => {
    const { value } = event.target;
    await updateStory(currentStory.id, { authorNotes: value })
  }

  const onOpenLorebook = () => {
    setPreferences((prev) => ({
      ...prev,
      lorebook: {
        ...prev.lorebook,
        isOpen: true
      }
    }))
  }

  return (
    <Flex w="full" flexDir="column" gap={2}>
      {isSidebarOpen && (
        <FormControl>
          <FormLabel>Memory</FormLabel>
          <Textarea
            value={currentMemoryValue}
            onChange={(event) => setCurrentMemoryValue(event.target.value)}
            onBlur={onMemoryChange}
          />
        </FormControl>
      )}
      {isSidebarOpen && (
        <FormControl>
          <FormLabel>Author Notes</FormLabel>
          <Textarea
            value={currentAuthorNotesValue}
            onChange={(event) => setCurrentAuthorNotesValue(event.target.value)}
            onBlur={onAuthorNotesChange}
          />
        </FormControl>
      )}
      <Flex flexDir="column">
        {isSidebarOpen && (
          <Button
            rightIcon={<BsBook />}
            aria-label="Open Lorebook"
            onClick={onOpenLorebook}
            variant="outline"
          >
            Open Lorebook
          </Button>
        )}
        {!isSidebarOpen && (
          <Tooltip
            label="Open Lorebook"
          >
            <IconButton
              icon={<BsBook />}
              aria-label="Open Lorebook"
              onClick={onOpenLorebook}
              variant="outline"
            />
          </Tooltip>
        )}
      </Flex>
    </Flex>
  )
}