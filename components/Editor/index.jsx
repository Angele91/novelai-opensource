import updateStory from "@/lib/stories/updateStory"
import { Box, Card, CardBody, Flex, Input, Textarea } from "@chakra-ui/react"
import { ProseMirror } from "@nytimes/react-prosemirror"
import { EditorState } from "prosemirror-state"
import { useState } from "react"
import { schema } from "prosemirror-schema-basic"
import { BreaklineWidget } from "./BreaklineWidget"

export const Editor = ({ story }) => {
  const [mount, setMount] = useState();
  const [prompt, setPrompt] = useState('');
  const [editorState, setEditorState] = useState(
    EditorState.create({
      schema,
    })
  )

  const onTransaction = (transaction) => {
    setEditorState((state) => state.apply(transaction))
  }

  return (
    <Flex flexDir="column" h="full" w="full" p={2} gap={2}>
      <Input
        defaultValue={story.storyName}
        placeholder="Your story name."
        onBlur={({ target: { value } }) => updateStory(story.id, { storyName: value })}
      />
      <Card variant="outline" flex={1}>
        <CardBody flex={1}>
          <ProseMirror
            mount={mount}
            state={editorState}
            dispatchTransaction={onTransaction}
          >
            <BreaklineWidget onTransaction={onTransaction} />
            <Box whiteSpace="pre-wrap" outline="none" h="full" ref={setMount} />
          </ProseMirror>
        </CardBody>
      </Card>
      <Textarea value={prompt} onChange={({ target: { value } }) => setPrompt(value)} />
    </Flex>
  )
}