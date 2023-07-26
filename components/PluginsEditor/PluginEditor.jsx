import { Editor } from "@monaco-editor/react";
import updatePlugin from "@/lib/plugins/updatePlugin";
import { Flex, Text } from "@chakra-ui/react";

const PluginEditor = ({ selectedPlugin }) => {
  return (
    <Flex flex={2} flexDir="column" py={2}>
      {!selectedPlugin && (
        <Flex
          alignItems="center"
          justify="center"
          flex={1}
        >
          <Text
            fontSize="3xl"
            fontWeight="bold"
          >
            Select a plugin to edit
          </Text>
        </Flex>
      )}
      {selectedPlugin && (
        <Flex gap={2} key={selectedPlugin.id}>
          <Editor
            height="90vh"
            defaultLanguage="lua"
            defaultValue={selectedPlugin.code}
            theme="vs-dark"
            onChange={(value) => {
              updatePlugin(selectedPlugin.id, {
                code: value,
              })
            }}
          />
        </Flex>
      )}
    </Flex>
  )
}

export default PluginEditor;