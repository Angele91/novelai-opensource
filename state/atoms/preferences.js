const { atom } = require("recoil");
const { recoilPersist } = require("recoil-persist");

const { persistAtom } = recoilPersist()

export const preferencesAtom = atom({
  key: 'preferences',
  default: {},
  effects_UNSTABLE: [persistAtom],
})