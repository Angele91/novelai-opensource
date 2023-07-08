import { fetchEventSource } from "@microsoft/fetch-event-source";
import { BAD_WORD_IDS, ImageModels, TextModels } from "./constants";
import { noop, omit } from "lodash";

/**
 * Generates a story using the given prompt, model, and parameters.
 *
 * @param {Object} options - The options object.
 * @param {string} options.prompt - The prompt for generating the story.
 * @param {TextModels} options.model - The model for generating the story.
 * @param {Object} options.params - The parameters for generating the story.
 * @param {Function} options.onToken - The callback function called for each generated token.
 */
export const generateStory = ({
  prompt = '',
  model = TextModels.CLIO,
  params = {},
  onToken = noop,
}) => {
  const ctrl = new AbortController();

  fetchEventSource('https://api.novelai.net/ai/generate-stream', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      input: prompt,
      model,
      parameters: {
        ...omit(params, 'order', 'textGenerationSettingsVersion'),
        use_string: true,
        order: [0,5,3,2,1],
        bad_words_ids: BAD_WORD_IDS,
        prefix: 'general_crossgenre',
        generate_until_sentence: true,
      },
    }),
    signal: ctrl.signal,
    onopen() {},
    onmessage(evt) {
      onToken(JSON.parse(evt.data))
    },
    onerror(err) {
      console.error(err);
      ctrl.abort()
    }
  })

  return { signal: ctrl.signal }
}

export const generateImage = ({
  action = 'generate',
  input = '',
  model = ImageModels.SAFE,
  params = {}
}) => {
  const ctrl = new AbortController();

  fetchEventSource('https://api.novelai.net/ai/generate-image', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      input,
      model,
      action,
      parameters: {
        ...omit(params, 'order', 'textGenerationSettingsVersion'),
        use_string: true,
        order: [0,5,3,2,1],
        bad_words_ids: BAD_WORD_IDS,
        prefix: 'general_crossgenre',
        generate_until_sentence: true,
      },
    }),
    signal: ctrl.signal,
    onopen() {},
    onmessage(evt) {
      onToken(JSON.parse(evt.data))
    },
    onerror(err) {
      console.error(err);
      ctrl.abort()
    }
  })

  return { signal: ctrl.signal }
}