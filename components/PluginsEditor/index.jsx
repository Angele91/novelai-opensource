import { db } from "@/app/db";
import { Button, Card, Flex, IconButton, Text } from "@chakra-ui/react";
import { useLiveQuery } from "dexie-react-hooks";
import createPlugin from "../../lib/plugins/createPlugin";
import { useState } from "react";
import { Editor } from "@monaco-editor/react";
import updatePlugin from "@/lib/plugins/updatePlugin";
import { BsPlay, BsTrash } from "react-icons/bs";
import * as luainjs from 'lua-in-js'
import getPlugin from "@/lib/plugins/getPlugin";
import deletePlugin from "@/lib/plugins/deletePlugin";

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

  const execute = async () => {
    const plugin = await getPlugin(selectedPluginId)
    const code = plugin.code

    const lib = {
      fetch: async (url) => {
        const response = await fetch(url)
        return response.text()
      }
    }

    const luaLib = new luainjs.Table(lib)

    const env = luainjs.createEnv()
    env.loadLib('base', luaLib)

    const res = env.parse(code)
    const result = res.exec()

    console.log(result)
  }

  return (
    <Flex w="full" h="full" gap={2}>
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
                description: 'A new plugin',
                code: '-- start here',
              })
            }}
          >
            Add Plugin
          </Button>
        </Flex>
      </Flex>
      <Flex flex={2} flexDir="column" py={2}>
        {!selectedPlugin && (
          <Flex
            alignItems="center"
            justify="center"
            flex={1}
          >
            <Text
              fontSize="3xl"
              fintWeight="bold"
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
    </Flex>
  )
};