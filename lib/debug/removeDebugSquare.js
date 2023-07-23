/**
 * Removes the debug square from the DOM if it exists.
 *
 * @return {void} 
 */
export default function removeDebugSquare() {
  const debugSquare = document.querySelector('#debugSquare');
  if (debugSquare) {
    debugSquare.remove();
  }
}