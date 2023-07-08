/**
 * Checks if an array starts with a given prefix.
 *
 * @param {Array} arr - The array to check.
 * @param {string} prefix - The prefix to check for.
 * @return {boolean} Returns true if the array starts with the prefix, otherwise returns false.
 */
export const startsWith = (arr, prefix) => {
  if (prefix.length > arr.length) {
    return false;
  }

  for (let i = 0; i < prefix.length; i++) {
    if (arr[i] !== prefix[i]) {
      return false;
    }
  }

  return true;
};

/**
 * Reads a file and returns its content as JSON.
 *
 * @param {File} file - The file to be read.
 * @return {Promise} A promise that resolves with the JSON content of the file.
 */
export const readFileAsJSON = (file) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = (evt) => {
      resolve(evt.target.result);
    }

    fileReader.readAsText(file);
  })
}