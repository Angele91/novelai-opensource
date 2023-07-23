/**
 * Returns the relative positioning of the active element with respect to the 
 * element it is hovering over.
 *
 * @param {DOMRect} overRect - The rect of the element being hovered over.
 * @param {DOMRect} activeRect - The rect of the active element.
 * @param {boolean} specific - Whether to return specific positioning (optional).
 * @return {'top' | 'bottom'} The relative positioning of the active element.
 */
export default function getRelativePositioning(overRect, activeRect, specific = false) {
  const centerY = overRect.top + overRect.height / 2;
  const draggableCenterY = activeRect.top + activeRect.height / 2;

  if (specific) {
    const centerX = overRect.left + overRect.width / 2;
    const draggableCenterX = activeRect.left + activeRect.width / 2;

    if (draggableCenterY < centerY) {
      return draggableCenterX < centerX ? 'top-left' : 'top-right';
    } else {
      return draggableCenterX < centerX ? 'bottom-left' : 'bottom-right';
    }
  } else {
    if (draggableCenterY < centerY) {
      return 'top';
    } else {
      return 'bottom';
    }
  }
};
