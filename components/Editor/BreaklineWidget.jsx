import { useEditorEventListener } from "@nytimes/react-prosemirror"
import { schema } from "prosemirror-schema-basic";

export const BreaklineWidget = ({
  onTransaction,
}) => {
  useEditorEventListener("keydown", (view, event) => {
    if (event.key === 'Enter') {
      const transaction = view.state.tr.insert(view.state.selection.anchor, schema.nodes.hard_break.create());
      onTransaction(transaction);
    }
  })

  return null;
}