import { generateImage, generateStory } from "@/lib/novelai/generation"
import getPresets from "@/lib/presets/getPresets"
import updateStory from "@/lib/stories/updateStory"
import { preferencesAtom } from "@/state/atoms/preferences"
import { Card, CardBody, Flex, Input } from "@chakra-ui/react"
import { EditorComponent, useChainedCommands, useCommands, useEditorEvent, useKeymap, useRemirrorContext } from "@remirror/react"
import { useLiveQuery } from "dexie-react-hooks"
import { first } from "lodash"
import { useContext, useState } from "react"
import { useRecoilState } from "recoil"
import { OptionsPanel } from "./OptionsPanel"
import { ImageModels } from "@/lib/novelai/constants"
import { ImagePanel } from "./ImagePanel"
import { TextSelection } from "prosemirror-state"
import { StoryContextManager } from "@/lib/processing/StoryContextManager"
import { PluginsContext } from "../PluginsEditor/PluginsProvider"
import Queue from 'queue'

const tokenQueue = new Queue({ results: [] })
tokenQueue.concurrency = 1
tokenQueue.autostart = true

export const EditorContainer = ({ story }) => {
  const presets = useLiveQuery(async () => getPresets(), [])
  const [preferences] = useRecoilState(preferencesAtom)
  const [imageOpened, setImageOpened] = useState(null)
  const { insertText } = useCommands();
  const chainableCommands = useChainedCommands()
  const { getState } = useRemirrorContext();

  const { hook } = useContext(PluginsContext)

  const onRequestGeneration = async (text) => {
    const state = getState();
    const currentTxt = text ?? state.doc.textContent;
    const currentPreset = presets.find(preset => preset.id === preferences.selectedPresetId);

    const storyContextManager = new StoryContextManager(
      story.lorebook ?? [],
      story,
      currentTxt ?? '',
      story.memory ?? '',
      story.authorNotes ?? '',
    )

    const producedText = await storyContextManager.produce(
      preferences.selectedModel,
    )

    const { producedText: finalPrompt } = await hook('StoryGenerationStarted', {
      fullPrompt: producedText,
      currentPrompt: currentTxt,
      model: preferences.selectedModel,
    })

    generateStory({
      prompt: finalPrompt ?? producedText,
      model: preferences.selectedModel,
      params: (currentPreset || first(presets)).parameters,
      onToken({ token }) {
        tokenQueue.push(async () => {
          const finalToken = await hook('TokenGenerated', {
            token,
          })

          insertText(finalToken?.token ?? token)
        })
      },
    })
  }

  const onRequestImageGeneration = async () => {
    const state = getState();
    const selectionTxt = state.doc.textBetween(state.selection.from, state.selection.to, '\n');

    const fileIds = await generateImage({
      action: 'generate',
      input: selectionTxt,
      model: ImageModels.NSFW,
    })

    chainableCommands
      .insertText(' ', { from: state.selection.to, to: state.selection.to })
      .toggleImage({
        imageId: fileIds[0],
      }, TextSelection.create(state.doc, state.selection.from, state.selection.to))
      .run()
  }

  const onEditorBlur = () => {    
    if (imageOpened) {
      setImageOpened(null);
      return;
    }
  }

  useEditorEvent('clickMark', (event => {
    const { target } = event;
    const { img } = target.dataset;

    if (imageOpened) {
      setImageOpened(null);
      return;
    }

    if (img) {
      const { top, left } = target.getBoundingClientRect();
      setImageOpened({
        imageId: img,
        position: {
          top: target.offsetTop + top,
          left: target.offsetLeft + left,
        }
      });
    }
  }))

  useEditorEvent('click', onEditorBlur)
  useEditorEvent('blur', onEditorBlur)

  useKeymap('Mod-Enter', () => {
    onRequestGeneration()
  })

  useKeymap('Escape', onEditorBlur)

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
        height="0"
        overflowY="auto"
        sx={{
          '[data-img]': {
            textDecoration: 'underline',
            cursor: 'pointer',
            whiteSpace: 'pre-wrap',
          },
          '.ProseMirror': {
            height: '100%',
            outline: 'none',
            whiteSpace: 'pre-wrap',
          },
          '.remirror-editor-wrapper': {
            height: '100%',
          }
        }}
      >
        <CardBody flex={1}>
          <EditorComponent />
          <OptionsPanel onGenerateImage={onRequestImageGeneration} />
          {imageOpened && (
            <ImagePanel
              imageId={imageOpened?.imageId}
              position={imageOpened?.position}
            />
          )}
        </CardBody>
      </Card>
    </Flex>
  )
}