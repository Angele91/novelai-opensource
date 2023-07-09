import updateStory from "@/lib/stories/updateStory"
import { Box, Card, CardBody, Flex, Input, Textarea } from "@chakra-ui/react"
import { ProseMirror } from "@nytimes/react-prosemirror"
import { EditorState } from "prosemirror-state"
import { useEffect, useState } from "react"
import { nodes, marks } from "prosemirror-schema-basic"
import { BreaklineWidget } from "./BreaklineWidget"
import { useRecoilState } from "recoil"
import { preferencesAtom } from "@/state/atoms/preferences"
import { KeybindingWidget } from "./KeybindingsWidget"
import { generateImage, generateStory } from "@/lib/novelai/generation"
import { useLiveQuery } from "dexie-react-hooks"
import getPresets from "@/lib/presets/getPresets"
import { first } from "lodash"
import { OptionsWidget } from "./OptionsWidget"
import { ImageModels } from "@/lib/novelai/constants"
import { Schema } from "prosemirror-model"
import { ImageWidget } from "./ImageWidget"

export const schema = new Schema({
  nodes: nodes,
  marks: {
    ...marks,
    dataImg: {
      attrs: {
        dataImg: {},
      },
      parseDOM: [{
        tag: 'div[data-img]',
        getAttrs: (dom) => ({
          dataImg: dom.dataset.img,
        }),
      }],
      toDOM: (node) => [
        'div',
        {
          'data-img': node.attrs.dataImg,
        },
        0,
      ],
    },
  },
})

export const Editor = ({ story, content, onChange }) => {
  const [mount, setMount] = useState();
  const [prompt, setPrompt] = useState('');
  const [preferences] = useRecoilState(preferencesAtom);
  const presets = useLiveQuery(async () => getPresets(), [])

  const [editorState, setEditorState] = useState(
    EditorState.create({
      schema,
      doc: content ? schema.nodeFromJSON(content) : undefined,
    })
  )

  const onTransaction = (transaction) => {
    setEditorState((state) => state.apply(transaction))
  }

  useEffect(() => {
    onChange?.(editorState.toJSON())
  }, [editorState])

  const onRequestGeneration = (text) => {
    const currentTxt = text || editorState.doc.textContent;
    const currentPreset = presets.find(preset => preset.id === preferences.selectedPresetId);

    generateStory({
      prompt: currentTxt,
      model: preferences.selectedModel,
      params: (currentPreset || first(presets)).parameters,
      onToken({ token }) {
        setEditorState((state) => {
          const { tr, selection } = state;
          tr.insertText(token, selection.from);
          return state.apply(tr)
        })
      }
    })
  }

  const onRequestImageGeneration = async () => {
    const selectionTxt = editorState.doc.textBetween(editorState.selection.from, editorState.selection.to, '\n');

    const fileIds = await generateImage({
      action: 'generate',
      input: selectionTxt,
      model: ImageModels.NSFW,
    })

    setEditorState((state) => {
      const { tr } = state;
      
      tr.addMark(
        state.selection.from,
        state.selection.to,
        schema.marks.dataImg.create({
          dataImg: fileIds[0],
        })
      )
  
      return state.apply(tr)
    })
  }

  const onPromptSent = (event) => {
    if (event.key !== 'Enter') return;

    setEditorState((state) => {
      const { tr, selection } = state;
      tr.insertText(prompt, selection.from);
      const newState = state.apply(tr)
      onRequestGeneration(newState.doc.textContent);
      return newState;
    })

    setPrompt('');
  }

  return (
    <Flex flexDir="column" h="full" w="full" p={2} gap={2}>
      <Input
        defaultValue={story.storyName}
        placeholder="Your story name."
        onBlur={({ target: { value } }) => updateStory(story.id, { storyName: value })}
      />
      <Card
        variant="outline"
        flex={1}
        sx={{
          '[data-img]': {
            textDecoration: 'underline',
            cursor: 'pointer',
          },
        }}
      >
        <CardBody flex={1}>
          <ProseMirror
            mount={mount}
            state={editorState}
            dispatchTransaction={onTransaction}
          >
            <OptionsWidget onGenerateImage={onRequestImageGeneration} />
            <ImageWidget />
            <BreaklineWidget onTransaction={onTransaction} />
            <KeybindingWidget onRequestGeneration={onRequestGeneration}  />
            <Box whiteSpace="pre-wrap" outline="none" h="full" ref={setMount} />
          </ProseMirror>
        </CardBody>
      </Card>
      <Textarea
        value={prompt}
        onChange={({ target: { value } }) => setPrompt(value)}
        placeholder="Type your prompt here."
        onKeyDown={onPromptSent}
      />
    </Flex>
  )
}