## StoryContextManager

`StoryContextManager` is a class that manages the context of a story. It is used to generate a final output to be sent to the NovelAI API so we can get a proper response.

The `StoryContextManager` class has the following methods.

`constructor(lorebook: Entry[], story: Story, currentText: string, memory: string, authorNotes: string)`: This method initializes the `StoryContextManager` class. It takes in the following parameters:
  `lorebook`: An array of `Entry` objects that represent the lorebook of the story.
  `story`: A `Story` object that represents the story.
  `currentText`: A string that represents the current text of the story.
  `memory`: A `string` that represents the memory of the story.
  `authorNotes`: A `string` that represents the author notes of the story.

`produce(model: string, order?: string[]): string`: This method produces the final output of the story. It returns a string that represents the final output of the story given the current context.

The `StoryContextManager` works with the following logic:
- The final output follows an order that can be customizable, given certain criteria.
- The `produce` method takes as argument an array of strings that represent the order of the final output.
  - The `order` argument is optional.
- The `produce` method takes as argument a string that represents the model to be used to generate the final output.
  - The `model` argument is required.
- If the `order` argument is not provided, the `produce` method will use the default order of the final output.
- The default of the final output is as follows:
  - The `lorebook` is always the first element of the final output.
    - The `memory` is always the second element of the final output.
  - The `currentText` is always the third element of the final output.
  - The `authorNotes` is always the last element of the final output.
- We have a maximum amount of tokens per model. This means we have a maximum amount of tokens we can send to the API to generate the final output.
  - The maximum amount of tokens for CLIO is 8192 tokens.
  - The maximum amount of tokens others is 4000 tokens.
- The memory, author notes, and lorebook items are always sent to the API, and a minimum of 4000 tokens from the story text must be always sent to the API. If the story text is less than 4000 tokens, the whole story text will be sent to the API.
- You can extract the lorebook content from the `extractLorebookContent` function, which takes as argument an array of `Entry` objects and the current story string and returns a string that represents the lorebook content.
- If the tokens for the memory, author notes and lotebook items tokens are greater than the maximum amount of tokens, we will need to cut off the tokens in this order:
  - The author notes tokens will be cut off first.
  - The lorebook items tokens will be cut off second.
  - The memory tokens will be cut off third.
  - the story content text tokens will be cut off last.