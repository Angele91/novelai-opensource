import { TextModels } from "@/lib/novelai/constants";
import { readFileAsJSON } from "@/lib/novelai/utils";
import createPreset from "@/lib/presets/createPreset";
import getPresets from "@/lib/presets/getPresets";
import { preferencesAtom } from "@/state/atoms/preferences";
import { Button, Flex, FormControl, FormHelperText, FormLabel, IconButton, Input, Select, Text, Tooltip } from "@chakra-ui/react"
import { useLiveQuery } from "dexie-react-hooks";
import { capitalize } from "lodash";
import { useRef } from "react"
import { BsBookFill, BsCloudArrowDown, BsCloudArrowUp } from "react-icons/bs";
import { useRecoilState } from "recoil";

export const PresetsTab = ({ isSidebarOpen }) => {
  const presets = useLiveQuery(async () => getPresets(), [])
  const [preferences, setPreferences] = useRecoilState(preferencesAtom);

  const inputRef = useRef();

  const onImport = () => {
    inputRef.current.click();
  }

  const onExport = () => {
    const selectedPreset = preset.find(
      (preset) => preset.id === preferences.selectedPresetId,
    )

    if (!selectedPreset) return;

    const contents = JSON.stringify(selectedPreset);
    const blob = new Blob([contents], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank');
  }

  const onFileSelected = async ({ target: { files: [file] } }) => {
    const contents = await readFileAsJSON(file);
    const preset = JSON.parse(contents);
    await createPreset(preset);
  }

  const onPresetChanged = ({ target: { value } }) => {
    setPreferences((prefs) => ({
      ...prefs,
      selectedPresetId: value,
    }))
  }

  const onModelChanged = ({ target: { value } }) => {
    setPreferences((prefs) => ({
      ...prefs,
      selectedModel: value,
    }))
  }

  return (
    <Flex w="full" flexDir="column" gap={2}>
      <Flex gap={2} w="full" flexDir={isSidebarOpen ? 'row' : 'column'}>
        {isSidebarOpen && (
          <FormControl>
            <FormLabel>
              Model
            </FormLabel>
            <Select
              value={preferences.selectedModel}
              onChange={onModelChanged}
            >
              {Object.keys(TextModels)?.map((model) => (
                <option key={model} value={TextModels[model]}>
                  {capitalize(model)}
                </option>
              ))}
            </Select>
            <FormHelperText>
              Choose your weapon.
            </FormHelperText>
          </FormControl>
        )}
        {!isSidebarOpen && (Object.keys(TextModels)?.map((textModel) => (
          <Tooltip key={textModel} label={`Set model ${capitalize(textModel)}`}>
            <Button
              key={textModel}
              aria-label={textModel}
              borderColor={TextModels[textModel] === preferences.selectedModel ? 'white!important' : undefined}
              variant="outline"
              onClick={() => {
                setPreferences((prefs) => ({
                  ...prefs,
                  selectedModel: TextModels[textModel],
                }))
              }}
            >
              {textModel.charAt(0).toUpperCase()}
            </Button>
          </Tooltip>
        )))}
      </Flex>
      <Flex>
        {isSidebarOpen && (
          <FormControl>
            <FormLabel>
              Preset
            </FormLabel>
            <Select
              value={preferences.selectedPresetId}
              onChange={onPresetChanged}
            >
              {presets?.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </Select>
            <FormHelperText>
              What preset do you want to use?
            </FormHelperText>
          </FormControl>
        )}
        {!isSidebarOpen && (presets?.map((preset) => (
          <Tooltip key={preset.id} label={`Set preset ${preset.name}`}>
            <Button
              key={preset.id}
              aria-label={preset.name}
              variant="outline"
              borderColor={preferences.selectedPresetId === preset.id}
              onClick={() => {
                setPreferences((prefs) => ({
                  ...prefs,
                  selectedPresetId: preset.id,
                }))
              }}
            >
              {preset.name.charAt(0).toUpperCase()}
            </Button>
          </Tooltip>
        )))}
      </Flex>
      <Flex gap={2} w="full" flexDir={isSidebarOpen ? 'row' : 'column'}>
        <Input display="none" onChange={onFileSelected} ref={inputRef} type="file" />
        {isSidebarOpen ? <Button
          flex={1}
          onClick={onImport}
          leftIcon={<BsCloudArrowDown />}
          variant="outline"
        >
          Import
        </Button> : (
          <Tooltip label="Import Preset" isDisabled={isSidebarOpen}>
            <IconButton
              aria-label="Import"
              onClick={onImport}
              icon={<BsCloudArrowDown />}
              variant="outline"
            />
          </Tooltip>
        )}
        {isSidebarOpen ? <Button
          flex={1}
          onClick={onExport}
          leftIcon={<BsCloudArrowUp />}
          variant="outline"
        >
          Export
        </Button> : (
          <Tooltip label="Export Preset" isDisabled={isSidebarOpen}>
            <IconButton
              aria-label="Export"
              onClick={onExport}
              icon={<BsCloudArrowUp />}
              variant="outline"
            />
          </Tooltip>
        )}
      </Flex>
    </Flex>
  )
}