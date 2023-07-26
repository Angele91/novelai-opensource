import { db } from "@/app/db";
import { Flex } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import { useState } from "react";
import PluginList from "./PluginList";
import PluginEditor from "./PluginEditor";

export const PluginsEditor = () => {
  const [selectedPluginId, setSelectedPluginId] = useState(null)
  const plugins = useLiveQuery(async () => {
    const plugins = await db.blocks.where({ type: 'plugin' }).toArray()
    return plugins.map((plugin) => {
      return {
        id: plugin.id,
        ...JSON.parse(plugin.data)
      }
    })
  });

  const selectedPlugin = plugins?.find((plugin) => plugin.id === selectedPluginId)

  return (
    <Flex w="full" h="full" gap={2}>
      <PluginList
        plugins={plugins}
        selectedPluginId={selectedPluginId}
        setSelectedPluginId={setSelectedPluginId}
      />
      <PluginEditor
        selectedPlugin={selectedPlugin}
      />
    </Flex>
  )
};