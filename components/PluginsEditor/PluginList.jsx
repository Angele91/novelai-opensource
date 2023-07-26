import createPlugin from "@/lib/plugins/createPlugin";
import deletePlugin from "@/lib/plugins/deletePlugin";
import { Button, Card, Flex, IconButton, Text } from "@chakra-ui/react";
import { BsPlay, BsTrash } from "react-icons/bs";

const PluginList = ({ plugins, selectedPluginId, setSelectedPluginId }) => {
  const execute = async () => {
    // wip
  }

  return (
    <Flex flex={1} flexDir="column" p={2}>
      <Flex flex={1} flexDir="column" gap={2}>
        {plugins?.map((plugin) => (
          <Card
            key={plugin.id}
            h={12}
            py={2}
            px={8}
            display="flex"
            justify="space-between"
            cursor="pointer"
            alignItems="center"
            flexDir="row"
            bgColor={selectedPluginId === plugin.id ? 'blue.500' : undefined}
            onClick={() => {
              setSelectedPluginId(plugin.id)
            }}
          >
            <Text>
              {plugin.name}
            </Text>
            <Flex gap={2}>
              <IconButton
                aria-label="Delete"
                icon={<BsTrash />}
                onClick={() => {
                  deletePlugin(plugin.id)
                }}
              />
              <IconButton
                aria-label="Play"
                icon={<BsPlay />}
                onClick={execute}
              />
            </Flex>
          </Card>
        ))}
      </Flex>
      <Flex flexDir="column">
        <Button
          onClick={() => {
            createPlugin({
              name: 'New Plugin',
              code: '',
            })
          }}
        >
          Add
        </Button>
      </Flex>
    </Flex>
  )
}

export default PluginList;