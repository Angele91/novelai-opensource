import { atom, selector } from "recoil";
import { currentStorySelector } from "./stories";

export const storyContentsAtom = atom({
  key: 'storyContents',
  default: []
})

export const currentStoryContent = selector({
  key: 'currentStoryContent',
  get({ get }) {
    const currentStory = get(currentStorySelector);

    if (!currentStory) return null;

    const storyContent = get(storyContentsAtom)?.find(content => content.parentId === currentStory.id);

      if (!storyContent) return null;

    return JSON.parse(storyContent.content);
  }
})