import { Encoder } from "nai-js-tokenizer";
import extractLorebookContent from "../lorebook/extractLorebookContent";
import { TextModels } from "../novelai/constants";
import { Set } from "core-js";

const tokenizers = {
  [TextModels.KAYRA]: 'nerdstash_tokenizer_v2.json',
  [TextModels.CLIO]: 'nerdstash_tokenizer_v2.json',
  [TextModels.KRAKE]: 'pile_tokenizer.json',
  [TextModels.EUTERPE]: 'gpt2_tokenizer.json',
  [TextModels.SIGURD]: 'gpt2_tokenizer.json',
};

// tokenizers cache
let loadedTokenizers = {}

/**
 * Manages the context of a story and produces a final output to be sent to the NovelAI API.
 */
export class StoryContextManager {
  /**
   * Initializes the `StoryContextManager` class.
   * @param {Entry[]} lorebook - An array of `Entry` objects that represent the lorebook of the story.
   * @param {Story} story - A `Story` object that represents the story.
   * @param {string} currentText - A string that represents the current text of the story.
   * @param {string} memory - A string that represents the memory of the story.
   * @param {string} authorNotes - A string that represents the author notes of the story.
   */
  constructor(lorebook, story, currentText, memory, authorNotes) {
    this.lorebook = lorebook;
    this.story = story;
    this.currentText = currentText;
    this.memory = memory;
    this.authorNotes = authorNotes;
  }

  /**
   * Produces the final output of the story.
   * @param {string} model - A string that represents the model to be used to generate the final output.
   * @param {string[]} [order=["lorebook", "memory", "currentText", "authorNotes"]] - An array of strings that represent the order of the final output. The default order is `["lorebook", "memory", "currentText", "authorNotes"]`.
   * @returns {string} A string that represents the final output of the story given the current context.
   */
  async produce(model = TextModels.CLIO, order = ["lorebook", "memory", "currentText", "authorNotes"]) {
    let tokenizer = loadedTokenizers[model];

    if (!loadedTokenizers[model]) {
      tokenizer = await import(`../novelai/tokenizers/${tokenizers[model]}`);
      loadedTokenizers[model] = tokenizer;
    }

    const encoder = new Encoder(
      tokenizer.vocab,
      tokenizer.merges,
      tokenizer.specialTokens,
      tokenizer.config
    );

    const maxTokens = [TextModels.CLIO, TextModels.KAYRA].includes(model) ? 8192 : 4000;
    let lorebookContent = extractLorebookContent(
      this.currentText,
      this.lorebook,
    );

    let totalTokens = [
      lorebookContent,
      this.memory,
      this.currentText,
      this.authorNotes,
    ].reduce((acc, curr) => acc + encoder.encode(curr).length, 0);
  
    let tokensToCut = totalTokens - maxTokens + Math.min(this.currentText.length, 4000);

    const alreadyCut = new Set();
    const maxIters = 4;
    let currIter = 0;

    while(tokensToCut > 0) {
      let cut = 0;
      // the logic is the following
      // 1. we cut from author notes first
      // 2. if there are no author notes, we cut from current text
      // 3. if there are no memory, we cut from lorebook
      // 4. if cutting from story, we must ensure there is at least 4000 tokens left
      // 5. if there are no current text, we cut from memory
      if (!alreadyCut.has('authorNotes')) {
        const tokenized = encoder.encode(this.authorNotes);
        cut = Math.min(tokenized.length, tokensToCut);
        this.authorNotes = encoder.decode(tokenized.slice(0, tokenized.length - cut));
        alreadyCut.add('authorNotes');
      } else if (!alreadyCut.has('currentText')) {
        const tokenized = encoder.encode(this.currentText);
        cut = Math.min(tokenized.length, tokensToCut);
        this.currentText = encoder.decode(tokenized.slice(cut));
        alreadyCut.add('currentText');
      } else if (!alreadyCut.has('memory')) {
        const tokenized = encoder.encode(this.memory);
        cut = Math.min(tokenized.length, tokensToCut);
        this.memory = encoder.decode(tokenized.slice(cut));
        alreadyCut.add('memory');
      } else if (!alreadyCut.has('lorebook')) {
        const tokenized = encoder.encode(lorebookContent);
        cut = Math.min(tokenized.length, tokensToCut);
        lorebookContent = encoder.decode(tokenized.slice(cut));
        alreadyCut.add('lorebook');
      }

      tokensToCut -= cut;
      currIter += 1;

      if (currIter > maxIters) {
        break;
      }
    }

    let output = [];
    for (const item of order) {
      switch (item) {
        case "lorebook":
          output.push(lorebookContent);
          break;
        case "memory":
          output.push(this.memory);
          break;
        case "currentText":
          output.push(this.currentText);
          break;
        case "authorNotes":
          output.push(this.authorNotes);
          break;
        default:
          throw new Error(`Invalid order item: ${item}`);
      }
    }

    return output.join('\n');
  }
}