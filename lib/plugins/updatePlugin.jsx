import { db } from "@/app/db"
import getPlugin from "./getPlugin"
import { omit } from "lodash"

export default async function updatePlugin(pluginId, data) {
  const plugin = await getPlugin(pluginId)

  return db.blocks.update(pluginId, {
    data: JSON.stringify(omit({
      ...plugin,
      ...data,
    }, ['id'])),
  })
}