export class View {
  constructor() {
    this._handlers = {};
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

  createElement(tag, className, textContent, icon) {
    const element = document.createElement(tag);
    if (className) element.classList.add(...className.split(' '));
    if (icon) element.append(icon);
    if (textContent) {
      element.append(textContent);
      if (tag === 'input' || tag === 'textarea') {
        element.value = textContent;
      }
    }
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

  setHandler(key, element, eventType, handler, options = {}) {
    if (!key || !element || !eventType) {
      throw new Error('Missing required arguments in setHandler');
    }

    if (this._handlers[key]) {
      const { element: prevElement, eventType: prevType, handler: prevHandler } = this._handlers[key];
      prevElement.removeEventListener(prevType, prevHandler);
    }

    if (handler) {
      element.addEventListener(eventType, handler, options);
      this._handlers[key] = { element, eventType, handler, options };
    } else {
      delete this._handlers[key];
    }
  }

  clearAllHandlers() {
    Object.keys(this._handlers).forEach((key) => {
      const { element, eventType, handler } = this._handlers[key];
      element.removeEventListener(eventType, handler);
    });
    this._handlers = {};
  }
}
