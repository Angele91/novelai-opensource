import { Remirror, useRemirror } from "@remirror/react"
import { EditorContainer } from "./EditorContainer"
import getEditorExtensions from "@/lib/editor/getEditorExtensions"

export const RemirrorEditor = ({ story, content, onChange: onChangeHandler }) => {
  const { manager, state } = useRemirror({
    content,
    extensions: getEditorExtensions,
  })

  const onChange = ({ state }) => {
    if (!state) return;
    onChangeHandler?.(state.toJSON())
  }

  return (
    <Remirror
      manager={manager}
      initialContent={state}
      onChange={onChange}
    >
      <EditorContainer story={story} />
    </Remirror>
  )
}