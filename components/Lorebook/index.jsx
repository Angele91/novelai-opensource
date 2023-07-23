import updateStory from "@/lib/stories/updateStory";
import { preferencesAtom } from "@/state/atoms/preferences";
import { currentStorySelector } from "@/state/atoms/stories";
import { Button, Flex, Modal, ModalContent } from "@chakra-ui/react"
import { useEffect, useState } from "react";
import { BsPlus } from "react-icons/bs";
import { useRecoilState } from "recoil";
import { LorebookItemList } from "./LorebookItemList";
import { LorebookProvider } from "./LorebookContext";
import createEntry from "@/lib/lorebook/createEntry";
import { DndContext, DragOverlay, useSensor, useSensors } from "@dnd-kit/core";
import { LorebookItem } from "./LorebookItem";
import { KeyboardSensor, MouseSensor } from "@/lib/dnd/sensors";
import { cloneDeep } from "lodash";
import { AddEntryButton } from "./AddEntryButton";
import { LorebookContent } from "./LorebookContent";

export const Lorebook = () => {
  const [activeEntry, setActiveEntry] = useState(null)
  const [preferences, setPreferences] = useRecoilState(preferencesAtom);
  const [currentStory] = useRecoilState(currentStorySelector);
  const { lorebook } = {
    lorebook: {
      isOpen: false
    },
    ...preferences,
  }

  const { lorebook: entries } = currentStory || {
    lorebook: [],
    ...currentStory,
  }

  useEffect(() => {
    const beforeUnload = () => {
      setPreferences((prev) => ({
        ...prev,
        lorebook: {
          ...prev.lorebook,
          isOpen: false
        }
      })
      );
    };

    window.addEventListener('beforeunload', beforeUnload)

    return () => {
      window.removeEventListener('beforeunload', beforeUnload)
    }
  }, [setPreferences])

  const closeLorebook = () => {
    setPreferences({
      ...preferences,
      lorebook: {
        ...lorebook,
        isOpen: false
      }
    })
  }

  const onAddLorebookEntry = (type) => async () => {
    await updateStory(currentStory.id, {
      lorebook: [
        ...(entries || []),
        createEntry(type),
      ]
    })
  }

  const sensors = useSensors(
    useSensor(KeyboardSensor),
    useSensor(MouseSensor),
  )

  const onDragStart = (event) => {
    const { current: active } = event.active.data
    setActiveEntry(active)
  }

  const onDragEnd = (event) => {
    try {
      const { current: over } = event.over?.data ?? { current: { id: 'root' } }
      const { current: active } = event.active.data
      
      if (
        over.id === active.id
        || over.id === active.parent
      ) return;

      const childIds = entries.reduce((acc, e) => {
        if (
          acc.includes(e.parent)
        ) {
          return [
            ...acc,
            e.id,
          ]
        }

        return acc;
      }, [active.id])

      if (
        childIds.includes(over.id)
      ) return;

      let newEntries = cloneDeep(entries)

      if (over.id === 'root') {
        newEntries = newEntries.map((e) => {
          if (e.id === active.id) {
            return {
              ...e,
              parent: null,
            }
          }

          return e;
        })
      }

      if (over.type === 'category') {
        newEntries = newEntries.map((e) => {
          if (e.id === active.id) {
            return {
              ...e,
              parent: over.id,
            }
          }

          return e;
        })
      }

      updateStory(currentStory.id, {
        lorebook: newEntries,
      })
    } catch (error) {
      console.log(error)
    } finally {
      setActiveEntry(null)
    }

  }

  return (
    <LorebookProvider
      entries={entries}
      onEntriesChange={(entries) => {
        updateStory(currentStory.id, {
          lorebook: entries,
        })
      }}
    >
      <Modal isOpen={lorebook?.isOpen} onClose={closeLorebook}>
        <ModalContent
          h="80vh"
          minW="80vw"
          borderRadius="0"
          display="flex"
          gap={2}
          flexDir="row"
        >
          <Flex
            flexDir="column" 
            flex={1} 
            p={4} 
            boxShadow="lg" 
            borderLeft="ActiveBorder" 
          >
            <DndContext
              sensors={sensors}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            >
              <DragOverlay>
                {activeEntry && (
                  <LorebookItem
                    entry={activeEntry}
                    collapsed
                  />
                )}
              </DragOverlay>
              <LorebookItemList />
            </DndContext>
            <Flex w="full">
              <AddEntryButton 
                onAddChild={onAddLorebookEntry}
                as={Button}
                leftIcon={<BsPlus />}
                size="md"
                variant="outline"
              >
                Add Entry
              </AddEntryButton>
            </Flex>
          </Flex>
          <Flex flex={2}>
            <LorebookContent />
          </Flex>
        </ModalContent>
      </Modal>
    </LorebookProvider>

  )
}