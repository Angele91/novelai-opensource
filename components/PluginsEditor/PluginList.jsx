import createPlugin from "@/lib/plugins/createPlugin";
import deletePlugin from "@/lib/plugins/deletePlugin";
import { Button, Card, Flex, IconButton, Text } from "@chakra-ui/react";
import { BsPlay, BsTrash } from "react-icons/bs";

const PluginList = ({
  plugins,
  onDeletePlugin,
  selectedPluginId,
  setSelectedPluginId,
  selectedPlugin,
}) => {
  const execute = async () => {
    if (!selectedPlugin) return;
    const worker = new Worker('/plugin-executor.js')
    
    worker.addEventListener('message', (event) => {
      const { type: eventType, payload: eventPayload } = event.data;
      console.log('Received from Worker:', eventType, eventPayload)
    })

    worker.postMessage({
      type: "test_execute",
      payload: {
        code: selectedPlugin.code,
      },
    });
  };

  const handleCreatePlugin = () => {
    createPlugin({
      name: "New Plugin",
      code: "",
    });
  };

  const handleDeletePlugin = (pluginId) => {
    (onDeletePlugin ?? deletePlugin)(pluginId);
  };

  const handleSelectPlugin = (pluginId) => {
    setSelectedPluginId(pluginId);
  };

  return (
    <Flex
      flex={1}
      flexDir="column"
      p={2}
      data-testid="plugin-list"
    >
      <Flex flex={1} flexDir="column" gap={2}>
        {plugins?.map((plugin) => (
          <Card
            key={plugin.name}
            h={12}
            py={2}
            px={8}
            role="listitem"
            display="flex"
            justify="space-between"
            cursor="pointer"
            alignItems="center"
            flexDir="row"
            bgColor={selectedPluginId === plugin.id ? "blue.500" : undefined}
            onClick={() => {
              handleSelectPlugin(plugin.id);
            }}
          >
            <Text>{plugin.name}</Text>
            <Flex gap={2}>
              <IconButton
                aria-label="Delete"
                icon={<BsTrash />}
                onClick={(event) => {
                  handleDeletePlugin(plugin.id);
                  event.stopPropagation();
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
        <Button onClick={handleCreatePlugin}>Add</Button>
      </Flex>
    </Flex>
  );
};

export default PluginList;