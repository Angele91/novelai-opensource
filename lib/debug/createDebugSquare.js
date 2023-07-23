/**
 * Creates a debug square element on the page.
 *
 * @param {number} top - The top position of the debug square.
 * @param {number} left - The left position of the debug square.
 * @param {number} width - The width of the debug square.
 * @param {number} height - The height of the debug square.
 */
export default function createDebugSquare(
  top,
  left,
  width,
  height
) {
  const body = document.querySelector('body');
  const debugSquare = document.createElement('div');
  debugSquare.style.position = 'fixed';
  debugSquare.style.top = `${top}px`;
  debugSquare.style.left = `${left}px`;
  debugSquare.style.width = `${width}px`;
  debugSquare.style.height = `${height}px`;
  debugSquare.style.border = '1px solid red';
  debugSquare.style.zIndex = 999999;
  debugSquare.id = 'debugSquare';
  body.appendChild(debugSquare);
}