/**
 * Retrieves the dimensions of an image from a given data URL.
 *
 * @param {string} dataUrl - The data URL of the image.
 * @return {Promise} A promise that resolves to an object containing the width and height of the image.
 */
export default function getImageDimensions(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = dataUrl;
  });
};