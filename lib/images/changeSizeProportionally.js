
/**
 * Changes the size of an object proportionally based on a given scale.
 *
 * @param {number} width - The original width of the object.
 * @param {number} height - The original height of the object.
 * @param {number} scale - The scale factor to adjust the size of the object.
 * @return {Array} An array containing the new width and height of the object.
 */
export function changeSizeProportionally(width, height, scale) {
  const newWidth = width * scale;
  const newHeight = height * scale;
  return [newWidth, newHeight];
}