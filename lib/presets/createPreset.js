import { db } from "@/app/db";

export default function createPreset(
  settings = {}
) {
  return db.blocks.add({
    type: 'preset',
    content: JSON.stringify(settings),
  })
}