import { fetchEventSource } from "@microsoft/fetch-event-source";
import { BAD_WORD_IDS, DEFAULT_IMAGE_GENERATION_PARAMS, ImageModels, TextModels } from "./constants";
import { noop, omit, pick } from "lodash";
import axios from "axios";
import JSZip from "jszip";
import { v4 } from "uuid";
import { db } from "@/app/db";

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
        order: [0, 5, 3, 2, 1],
        bad_words_ids: BAD_WORD_IDS,
        prefix: 'general_crossgenre',
        generate_until_sentence: true,
      },
    }),
    signal: ctrl.signal,
    onopen() { },
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

export const generateImage = async ({
  action = 'generate',
  input = '',
  model = ImageModels.SAFE,
  params = DEFAULT_IMAGE_GENERATION_PARAMS,
}) => {
  const response = await axios.post('https://api.novelai.net/ai/generate-image', {
    input,
    model,
    action,
    parameters: params,
  }, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      'content-type': 'application/json',
    },
    responseType: 'blob',
  });

  const zip = new JSZip();
  const content = await response.data.arrayBuffer();
  const zipFile = await zip.loadAsync(content);

  let blobs = []

  for (const [_, zipEntry] of Object.entries(zipFile.files)) {
    const blob = await zipEntry.async('blob');
    blobs.push(blob.slice(0, blob.size, 'image/png'));
  }

  const fileIds = await Promise.all(blobs.map(async (blob) => {
    return db.blocks.add({
      type: 'image',
      content: JSON.stringify({
        rawDataUrl: await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        }),
      }),
    })
  }));

  return fileIds;
}