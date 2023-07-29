import { Flex } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import PluginList from "./PluginList";
import PluginEditor from "./PluginEditor";
import getPluginLiveState from "@/lib/plugins/getPluginLiveState";

export const PluginsEditor = () => {
  const [selectedPluginId, setSelectedPluginId] = useState(null)
  const plugins = useLiveQuery(getPluginLiveState());

  const selectedPlugin = plugins?.find((plugin) => plugin.id === selectedPluginId)

  return (
    <Flex w="full" h="full" gap={2}>
      <PluginList
        plugins={plugins}
        selectedPluginId={selectedPluginId}
        setSelectedPluginId={setSelectedPluginId}
        selectedPlugin={selectedPlugin}
      />
      <PluginEditor
        selectedPlugin={selectedPlugin}
      />
    </Flex>
  )
};