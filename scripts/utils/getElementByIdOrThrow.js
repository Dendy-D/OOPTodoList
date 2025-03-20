export function getElementByIdOrThrow(elementId) {
  const element = document.getElementById(elementId);

  if (!element) {
    throw new Error(`Critical error: Missing DOM element with ID '${elementId}'`);
  }

  return element;
}
