import { Checkbox, Collapse, Flex, Icon, IconButton, Text } from "@chakra-ui/react"
import { BsChevronDown, BsChevronRight, BsPlus, BsTrash } from "react-icons/bs";
import { useLorebook } from "./LorebookContext";
import createEntry from "@/lib/lorebook/createEntry";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { omit } from "lodash";
import { AddEntryButton } from "./AddEntryButton";
import { MdDragIndicator } from "react-icons/md";

/**
 * Generates a function comment for the given function body.
 *
 * @param {object} params - The parameters for the function.
 *   @param {string} params.entryId - The ID of the entry.
 * @return {object} - The return value of the function.
 *   @property {function} onRemove - A function to remove the entry from the list.
 *   @property {function} onToggleCheck - A function to toggle the check status of the entry.
 *   @property {function} onToggle - A function to toggle the collapsed status of the entry.
 *   @property {function} onAddChild - A function to add a child entry.
 *   @property {array} childs - An array of child entries.
 *   @property {object} entry - The entry object.
 */
export const useLorebookItem = ({ entryId }) => {
  const { entries, onEntriesChange } = useLorebook();
  const childs = entries.filter(({ parent }) => parent === entryId);
  const entry = entries.find(({ id }) => id === entryId);


  const onRemove = () => {
    const entryFamily = entries.reduce((
      acc, e
    ) => {
      if (
        acc.includes(e.parent)
      ) {
        return [
          ...acc,
          e.id,
        ]
      }

      return acc;
    }, [entryId])

    onEntriesChange(
      entries.filter((e) => !entryFamily.includes(e.id))
    );
  }

  const onToggleCheck = () => {
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
    }, [entryId])

    const newCheckVal = !entry.checked;
    onEntriesChange(
      entries.map((e) => {
        if (
          e.id === entryId
          || childIds.includes(e.id)
        ) {
          return {
            ...e,
            checked: newCheckVal,
          }
        }

        return e;
      })
    )
  }

  const onToggle = () => {
    onEntriesChange(
      entries.map((e) => {
        if (e.id === entryId) {
          return {
            ...e,
            collapsed: !e.collapsed,
          }
        }

        return e;
      })
    )
  }

  const onAddChild = (type) => () => {
    onEntriesChange([
      ...entries,
      createEntry(type, {
        parent: entryId,
      })
    ])
  }

  return {
    onRemove,
    onToggleCheck,
    onToggle,
    onAddChild,
    childs,
    entry,
  }
}

export const LorebookItem = ({
  entry: originalEntry,
  parent,
  ...rest
}) => {
  const { setSelectedEntryId, selectedEntryId } = useLorebook();

  const entry = {
    ...originalEntry,
    ...omit(rest, ['entry']),
  }

  const {
    onRemove,
    onToggleCheck,
    onToggle,
    onAddChild,
    childs,
  } = useLorebookItem({
    entryId: entry.id,
  });

  const {
    setNodeRef,
    attributes,
    listeners,
    isDragging,
  } = useDraggable({
    id: entry.id,
    data: originalEntry,
  })

  const {
    setNodeRef: setDropRef,
  } = useDroppable({
    id: entry.id,
    data: originalEntry,
  })

  const renderToggleIcon = () => {
    if (entry?.type === 'category') {
      return (
        <IconButton
          aria-label="Toggle"
          icon={!entry.collapsed ? <BsChevronDown /> : <BsChevronRight />}
          size="xs"
          visibility="visible"
          cursor="pointer"
          onClick={onToggle}
          data-no-dnd="true"
        />
      );
    }
    return null;
  };

  const renderAddMenu = () => {
    if (entry?.type === 'category') {
      return (
        <AddEntryButton
          as={IconButton}
          icon={<BsPlus />}
          onAddChild={onAddChild}
        />
      );
    }
    return null;
  };

  return (
    <Flex
      flexDir="column"
      marginLeft={parent ? 6 : 0}
      ref={setNodeRef}
      {...attributes}
    >
      <Flex
        flexDir="column"
        ref={setDropRef}
        opacity={isDragging ? 0 : 1}
      >
        <Flex
          justify="space-between"
          overflow="visible"
          align="center"
          w="full"
          cursor="pointer"
          bgColor={entry.id === selectedEntryId ? 'blackAlpha.700' : 'transparent'}
          onClick={() => setSelectedEntryId(entry.id)}
          p={1}
        >
          <Flex
            gap={2}
            align="center"
          >
            <Icon
              as={MdDragIndicator}
              cursor="grab"
              {...listeners}
            />
            {renderToggleIcon()}
            <Checkbox
              size="sm"
              isChecked={entry?.checked}
              onChange={onToggleCheck}
              data-no-dnd="true"
            />
            <Text
              data-no-dnd="true"
            >
              {entry?.text}
            </Text>
          </Flex>
          <Flex gap={2} data-no-dnd="true">
            {renderAddMenu()}
            <IconButton
              aria-label="Delete"
              icon={<BsTrash />}
              size="xs"
              onClick={onRemove}
              data-no-dnd="true"
            />
          </Flex>
        </Flex>
      </Flex>
      {entry.type === 'category' && childs.length > 0 && (
        <Collapse in={!entry.collapsed}>
          <Flex flexDir="column" py={1}>
            {childs.map((child) => (
              <LorebookItem
                key={child.id}
                entry={child}
                parent={entry}
              />
            ))}
          </Flex>
        </Collapse>
      )}
    </Flex>
  );
};

LorebookItem.displayName = 'LorebookItem'