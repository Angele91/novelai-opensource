import { Flex, FormControl, FormHelperText, FormLabel, Input, Switch, Text, Textarea } from "@chakra-ui/react"
import { useLorebook } from "./LorebookContext"
import {
  Select,
  CreatableSelect,
} from "chakra-react-select";

import Editor, { useMonaco } from '@monaco-editor/react';
import { useEffect } from "react";

const MATCH_TYPES = [
  { value: 'contains', label: 'Contains' },
  { value: 'regexp', label: 'Regexp' },
  { value: 'script', label: 'Script' }
];
export const LorebookContent = () => {
  const { entries, selectedEntryId, onEntriesChange } = useLorebook()
  const selectedEntry = entries.find(entry => entry.id === selectedEntryId)
  const monaco = useMonaco()

  const onUpdate = (data) => {
    const newEntries = entries.map(entry => {
      if (entry.id === selectedEntryId) {
        return {
          ...entry,
          ...data
        }
      }

      return entry
    })

    onEntriesChange(newEntries)
  }

  const renderMatchType = (type) => {
    if (type === 'contains') {
      return (
        <CreatableSelect
          placeholder="Contains"
          defaultValue={selectedEntry.match}
          onChange={(e) => {
            onUpdate({ match: e })
          }}
          chakraStyles={{
            container: (provided) => ({
              ...provided,
              flex: 1,
            })
          }}
          isMulti
        />
      )
    }

    if (type === 'regexp') {
      return (
        <Input
          placeholder="Regexp"
          defaultValue={selectedEntry.match}
          onBlur={(e) => onUpdate({ match: e.target.value })}
        />
      )
    }

    if (type === 'script') {
      return (
        <Flex
          flex={1}
          minH="400px"
        >
          <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue={selectedEntry.match}
            theme="vs-dark"
            onChange={(value) => onUpdate({ match: value })}
          />
        </Flex>
      )
    }

    return null;
  }

  useEffect(() => {
    monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    monaco?.languages.typescript.javascriptDefaults.addExtraLib(
      `
      declare const appendIf: (fn: (context: string) => boolean) => void;
      `,
      'file:///globals.d.ts'
    );
  }, [monaco])


  if (!selectedEntry) {
    return (
      <Flex
        p={2}
        flexDir="column"
        w="full"
        align="center"
        justify="center"
      >
        <Text
          fontSize="2xl"
        >
          Select an entry to edit
        </Text>
      </Flex>
    )
  }

  return (
    <Flex
      p={2}
      flexDir="column"
      w="full"
      key={selectedEntry.id}
      gap={2}
    >
      <Input
        placeholder="Name"
        defaultValue={selectedEntry.text}
        onBlur={(e) => onUpdate({ text: e.target.value })}
      />
      <Flex flexDir="column" gap={2}>
        <Flex>
          <Select
            placeholder="Match type"
            defaultValue={MATCH_TYPES.find(type => type.value === selectedEntry.matchType)}
            onChange={(e) => {
              onUpdate({ matchType: e.value })
            }}
            chakraStyles={{
              container: (provided) => ({
                ...provided,
                flex: 1,
              })
            }}
            options={MATCH_TYPES}
          />
        </Flex>
        {renderMatchType(selectedEntry.matchType)}
      </Flex>
      <Flex gap={2}>
        <Textarea
          placeholder="Content"
          defaultValue={selectedEntry.content}
          onBlur={(e) => onUpdate({ content: e.target.value })}
        />
      </Flex>
      <Flex gap={2}>
        <FormControl>
          <FormLabel>
            Importance
          </FormLabel>
          <Input
            placeholder="Importance"
            defaultValue={selectedEntry.importance ?? 0}
            onBlur={(e) => onUpdate({ importance: e.target.value })}
          />
          <FormHelperText>
            Higher importance means it will be shown first
          </FormHelperText>
        </FormControl>
        {selectedEntry.type === 'category' && (
          <FormControl>
            <FormLabel>
              Blocker
            </FormLabel>
            <Switch
              isChecked={selectedEntry.blocker}
              onChange={(e) => onUpdate({ blocker: e.target.checked })}
            />
            <FormHelperText>
              If enabled, this entry will block child entries from being shown
            </FormHelperText>
          </FormControl>
        )}
      </Flex>
      <Flex>
        <FormControl>
          <FormLabel>
            Enabled
          </FormLabel>
          <Switch
            isChecked={selectedEntry.enabled}
            onChange={(e) => onUpdate({ enabled: e.target.checked })}
          />
          <FormHelperText>
            If disabled, this entry will not be shown
          </FormHelperText>
        </FormControl>
      </Flex>
    </Flex>
  )
}