Create a function in Javascript (not typescript) that given a string and a array of entries with this shape:
```
interface Entry {
    id: string;
    matchType: 'script' | 'regexp' | 'includes';
    match: string | string[];
    content: string;
    parent: string;
    importance: number;
    blocker: boolean;
}
```

Extracts the content (divided by \n) of each of the matching entries, following this logic:
- When the `matchType` is `includes`, the `match` property will be an array of strings.
- If the `matchType` is `includes` and the string passed as parameter includes at least one of the strings included in the `match` property, the `content` property will be appended to the final result.
- When the `matchType` is `regexp`, the `match` property will be a string.
- When the `matchType` is `regexp`, the string passed as parameter will be a regexp.
- If the `matchType` is `regexp` and the string passed as parameter matches the `regexp`, the `content` property will be appended to the final result
- When the `matchType` is `script`, the `match` property will be a string.
- When the `matchType` is `script`, the string passed as parameter will be javascript code that follows the following pattern, being `appendIf` a function already defined, passed to the context of the code.
```javascript
    appendIf((context) => {
        // code that determines if the content should be appended to the final result
        return shouldAppend;
    })
```
- If the content of an entry will be included into the final result, it means an entry has been _matched_.
- If the `matchType` is `script` and the code passed as parameter returns true, the `content` property will be appended to the final result
- If the `blocker` property is true, the parent entry must be matched in order for their children to be matched.
- All the results must be sorted at the end by the `importance` property, from highest to lowest.