'use client'

import Dexie from 'dexie';

const db = new Dexie('novelai-opensource-db')
db.version(2).stores({
  blocks: '++id, parentId, content, type, createdAt, updatedAt',
  blockConnections: '++id, fromId, toId, type, createdAt, updatedAt',
})

export { db };