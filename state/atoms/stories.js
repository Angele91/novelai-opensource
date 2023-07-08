import { atom, selector } from "recoil";
import { preferencesAtom } from "./preferences";

export const storiesAtom = atom({
  key: 'stories',
  default: [],
})

export const storiesSelector = selector({
  key: 'storiesSelector',
  get: ({ get }) => {
    const rawStories = get(storiesAtom);
    if (!rawStories) return [];

    return rawStories.map((rawStory) => ({
      ...JSON.parse(rawStory.content),
      id: Number(rawStory.id),
    })) || []
  },
})

export const currentStorySelector = selector({
  key: 'currentStory',
  get: ({ get }) => {
    const preferences = get(preferencesAtom)
    if (!preferences) return null;

    const { selectedStoryId } = preferences;
    const stories = get(storiesSelector) || [];

    return stories.find(story => story.id == selectedStoryId) || null;
  },
  set: ({ set }, newVal) => {
    set(preferencesAtom, newVal)
  }
})