import { Set } from "core-js";

/**
 * Extracts content from an input string based on a set of entries.
 *
 * @param {string} inputString - The input string from which content will be extracted.
 * @param {Array} entries - An array of entries containing the rules for extraction.
 * @return {Array} An array of extracted content, sorted by importance.
 */
export default function extractLorebookContent(inputString, entries) {
  const result = [];
  const matchedEntryIds = new Set();

  entries.forEach((entry) => {
    if (!entry.enabled) return;
    if (entry.blocker) {
      const parentEntry = entries.find((e) => e.id === entry.parent);
      if (!parentEntry || !result.includes(parentEntry.content)) {
        return;
      }
    }

    if (entry.matchType === 'contains' && Array.isArray(entry.match)) {
      entry.match.forEach((matchString) => {
        if (inputString.includes(matchString.value) && !matchedEntryIds.has(entry.id)) {
          result.push(entry.content);
          matchedEntryIds.add(entry.id);
        }
      });
    } else if (entry.matchType === 'regexp') {
      const regex = new RegExp(entry.match);
      if (regex.test(inputString) && !matchedEntryIds.has(entry.id)) {
        result.push(entry.content);
        matchedEntryIds.add(entry.id);
      }
    } else if (entry.matchType === 'script') {
      let execResult = false;

      (function() {
        // eslint-disable-next-line no-unused-vars
        function appendIf(fn) {
          if (typeof fn !== 'function') {
            return false;
          }
    
          return fn(inputString)
        };
        execResult = eval(entry.match);
      })()
      
      if (execResult && !matchedEntryIds.has(entry.id)) {
        result.push(entry.content);
        matchedEntryIds.add(entry.id);
      }
    }
  });

  result.sort((a, b) => b.importance - a.importance);

  return result.join('\n');
}
