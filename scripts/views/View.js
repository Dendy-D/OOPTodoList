export class View {
  constructor() {
    if (new.target === View) {
      throw new Error('View is an abstract class and cannot be instantiated directly.');
    }
  }

  getElementByIdOrThrow(elementId) {
    const element = document.getElementById(elementId);

    if (!element) {
      throw new Error(`Critical error: Missing DOM element with ID '${elementId}'`);
    }
    return element;
  }

  createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.classList.add(...className.split(' '));
    if (textContent) element.textContent = textContent;
    return element;
  }

  createSvgElement(svgClassName, useHref) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add(svgClassName);
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', useHref);
    svg.append(use);
    return svg;
  }
}
