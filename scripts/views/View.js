export class View {
  constructor() {
    this._handlers = new Map();
    this._handlerRefs = new WeakMap();
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

  createSvgElement(svgClassName, href) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add(svgClassName);
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', href);
    svg.append(use);
    return svg;
  }
 
  setHandler(key, element, eventType, handler, options = {}) {
    if (!key || !element || !eventType) {
      throw new Error('Missing required arguments in setHandler');
    }

    if (this._handlers.has(key)) {
      const { element: prevEl, eventType: prevType, handler: prevHandler } = this._handlers.get(key);
      prevEl.removeEventListener(prevType, prevHandler, this._handlerRefs.get(prevHandler));
    }

    if (handler) {
      this._handlers.set(key, { element, eventType, handler });
      this._handlerRefs.set(handler, options);
      
      element.addEventListener(eventType, handler, options);
    } else {
      this._handlers.delete(key);
    }
  }

  clearAllHandlers() {
    this._handlers.forEach(({ element, eventType, handler }, key) => {
      element.removeEventListener(eventType, handler, this._handlerRefs.get(handler));
    });
    this._handlers.clear();
    this._handlerRefs = new WeakMap();
  }
}
