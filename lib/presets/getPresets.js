import { db } from "@/app/db"

export default async function getPresets() {
  const rawPresets = await db
    .blocks
    .where('type')
    .equals('preset')
    .toArray()
  
  return rawPresets.map(rawPreset => JSON.parse(rawPreset.content))
}