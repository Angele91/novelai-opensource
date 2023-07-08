import { useEditorEventListener } from "@nytimes/react-prosemirror";

export const KeybindingWidget = ({ onRequestGeneration }) => {
  useEditorEventListener('keydown', (view, event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      onRequestGeneration?.();
    }
  })

  return null;
}