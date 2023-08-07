const { atom } = require("recoil");
const { recoilPersist } = require("recoil-persist");

const { persistAtom } = recoilPersist()

export const pluginsStateAtom = atom({
  key: 'pluginsState',
  default: {},
  effects_UNSTABLE: [persistAtom],
})