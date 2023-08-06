import { Editor } from "@monaco-editor/react";
import updatePlugin from "@/lib/plugins/updatePlugin";
import { Flex, Text } from "@chakra-ui/react";

const PluginEditor = ({ selectedPlugin }) => {
  const content = {
    'true': () => (
      <Flex gap={2} key={selectedPlugin.id}>
        <Editor
          height="90vh"
          defaultLanguage="javascript"
          defaultValue={selectedPlugin.code}
          theme="vs-dark"
          onChange={(value) => {
            updatePlugin(selectedPlugin.id, {
              code: value,
            })
          }}
        />
      </Flex>
    ),
    'false': () => (
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
    )
  }

  return (
    <Flex
      flex={2}
      flexDir="column"
      py={2}
      data-testid="plugin-editor"
    >
      {content[!!selectedPlugin?.id]()}
    </Flex>
  )
}

export default PluginEditor;