import { getElementByIdOrThrow } from '../utils/getElementByIdOrThrow.js';

export class FolderView {
  constructor() {
    this.folderPanel = getElementByIdOrThrow('folder-panel');
    this.addFolderModal = getElementByIdOrThrow('add-folder-modal');
    this.addFolderModalOpenBtn = getElementByIdOrThrow('add-folder-modal-open-btn');
    this.addFolderModalCloseBtn = getElementByIdOrThrow('add-folder-modal-close-btn');
    this.folderNameInput = getElementByIdOrThrow('folder-name-input');
    this.colorsContainer = getElementByIdOrThrow('colors');
    this.addFolderBtn = getElementByIdOrThrow('add-folder-btn');
    this.showAllTasksBtn = getElementByIdOrThrow('show-all-tasks-btn');
    this.folderColors = document.querySelectorAll('#add-folder-modal .colors > div');
  }

  #createElement(tag, className, textContent) {
    const element = document.createElement(tag);
    if (className) element.classList.add(...className.split(' '));
    if (textContent) element.textContent = textContent;
    return element;
  }

  setOpenModalHandler(handler) {
    this.addFolderModalOpenBtn.addEventListener('click', handler);
  }
  openAddFolderModal() {
    this.addFolderModal.classList.remove('hidden');
    this.folderNameInput.focus();
  }

  setCloseModalHandler(handler) {
    this.addFolderModalCloseBtn.addEventListener('click', handler);
  }
  closeAddFolderModal() {
    this.addFolderModal.classList.add('hidden');
    this.folderNameInput.value = '';
    this.#clearSelectedColors();
  }

  blurFolderNameInput() {
    this.folderNameInput.blur();
  }

  highlightSelectedColor(colorElement) {
    this.#clearSelectedColors();
    colorElement.classList.add('selected-color');
  }

  #clearSelectedColors() {
    this.folderColors.forEach((color) => {
      color.classList.remove('selected-color');
    });
  }

  setColorSelectionHandler(handler) {
    if (this.colorsContainer) {
      this.colorsContainer.addEventListener('click', (event) => {
        if (event.target.matches('#colors > div')) {
          handler(event.target);
        }
      });
    }
  }

  setFolderNameInputHandler(eventName, handler) {
    this.folderNameInput.addEventListener(eventName, handler);
  }

  getFolderName() {
    return this.folderNameInput.value.trim();
  }

  getSelectedColor() {
    for (let color of this.folderColors) {
      if (color.classList.contains('selected-color')) {
        return color.classList[0];
      }
    }
    return null;
  }

  setAddFolderHandler(handler) {
    this.addFolderBtn.addEventListener('click', handler);
  }

  validationErrorInput() {
    this.folderNameInput.classList.add('input-validation-error');
  }

  removeValidationErrorInput() {
    this.folderNameInput.classList.remove('input-validation-error');
  }

  createFolder(name, color, id) {
    const folder = this.#createElement('div', 'folder');
    folder.dataset.id = id;

    const folderColor = this.#createElement('div', `folder-color ${color}`);
    const folderName = this.#createElement('div', 'folder-name', name);

    const removeFolderBtn = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    removeFolderBtn.setAttribute('width', '10');
    removeFolderBtn.setAttribute('height', '10');
    removeFolderBtn.setAttribute('fill', 'none');
    removeFolderBtn.classList.add('remove-folder-btn');

    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    use.setAttribute('href', './assets/icons/icons.svg#removeIcon');
    removeFolderBtn.appendChild(use);

    folder.append(folderColor, folderName, removeFolderBtn);

    return folder;
  }

  renderFolders(fragment) {
    const folderList = document.getElementById('folder-list');
    if (folderList) {
      folderList.appendChild(fragment);
    }
  }

  createFolderList() {
    const folderList = document.createElement('div');
    folderList.classList.add('folder-list');
    folderList.id = 'folder-list';
    return folderList;
  }

  renderFolderList() {
    let folderList = document.getElementById('folder-list');

    if (!folderList) {
      folderList = this.createFolderList();
      this.showAllTasksBtn.insertAdjacentElement('afterend', folderList);
    } else {
      folderList.innerHTML = '';
    }

    this.folderPanel.classList.remove('no-folders');
  }

  setRemoveFolderHandler(handler) {
    this.folderPanel.addEventListener('click', (event) => {
      if (event.target.closest('.remove-folder-btn')) {
        const folderElement = event.target.closest('.folder');
        const folderId = folderElement.dataset?.id;
        if (folderId) handler(folderId, folderElement);
      }
    });
  }

  removeFolder(folderElement) {
    folderElement.remove();
  }

  removeFolderListElement() {
    this.folderPanel.classList.add('no-folders');
    
    const folderList = document.getElementById('folder-list');
    if (folderList) folderList.remove();
  }
}
