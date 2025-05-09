import { View } from './View.js';

export class FolderView extends View {
  constructor() {
    super();
    this.todoApp = this.getElementByIdOrThrow('todo');
    this.folderPanel = this.getElementByIdOrThrow('folder-panel');
    this.addFolderModal = this.getElementByIdOrThrow('add-folder-modal');
    this.addFolderModalOpenBtn = this.getElementByIdOrThrow('add-folder-modal-open-btn');
    this.addFolderModalCloseBtn = this.getElementByIdOrThrow('add-folder-modal-close-btn');
    this.folderNameInput = this.getElementByIdOrThrow('folder-name-input');
    this.colorsContainer = this.getElementByIdOrThrow('colors');
    this.addFolderBtn = this.getElementByIdOrThrow('add-folder-btn');
    this.showAllTasksBtn = this.getElementByIdOrThrow('show-all-tasks-btn');
    this.folderColors = document.querySelectorAll('#add-folder-modal .colors > div');
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
    const folder = this.createElement('div', 'folder');
    folder.dataset.id = id;

    const folderColor = this.createElement('div', `folder-color ${color}`);
    const folderName = this.createElement('div', 'folder-name', name);
    const removeFolderBtn = this.createSvgElement('remove-folder-btn', './assets/icons/icons.svg#removeIcon')

    folder.append(folderColor, folderName, removeFolderBtn);

    return folder;
  }

  addClassToChosenFolder(folderId) {
    const folders = Array.from(document.getElementById('folder-list').children);
    for (let folder of folders) {
      if (folder.dataset.id === folderId) {
        folder.classList.add('chosenFolder');
      } else {
        folder.classList.remove('chosenFolder');
      }
    }
    this.removeChosenClassShowAllTasksBtn();
  }

  removeChosenClassShowAllTasksBtn() {
    this.showAllTasksBtn.classList.remove('chosenFolder');
  }

  addClassToShowAllTasksBtn() {
    const folders = Array.from(document.getElementById('folder-list').children);
    for (let folder of folders) {
      folder.classList.remove('chosenFolder');
    }
    this.showAllTasksBtn.classList.add('chosenFolder');
  }

  renderFolders(fragment) {
    const folderList = document.getElementById('folder-list');
    if (folderList) {
      folderList.appendChild(fragment);
    }
  }

  createFolderList() {
    const folderList = this.createElement('div', 'folder-list')
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

  setShowAllTasksHandler(handler) {
    this.showAllTasksBtn.addEventListener('click', handler);
  }

  isShowAllTasksBtnActive() {
    return this.showAllTasksBtn.classList.contains('chosenFolder');
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

  setChooseFolderHandler(handler) {
    this.folderPanel.addEventListener('click', (event) => {
      if (event.target.closest('.remove-folder-btn')) return;
      if (event.target.closest('.folder')) {
        const folderElement = event.target.closest('.folder');
        const folderId = folderElement.dataset?.id;
        if (folderId) handler(folderId);
      }
    })
  }

  removeFolder(folderElement) {
    folderElement.remove();
  }

  removeFolderListElement() {
    this.folderPanel.classList.add('no-folders');
    const folderList = document.getElementById('folder-list');
    if (folderList) folderList.remove();
  }

  turnOnFullHeightMode() {
    this.todoApp.classList.add('full-height-mode');
  }

  turnOffFullHeightMode() {
    this.todoApp.classList.remove('full-height-mode');
  }

  addClassForFolderModal() {
    this.addFolderModal.classList.add('multiple-add-folder-modal');
  }

  removeClassForFolderModal() {
    this.addFolderModal.classList.remove('multiple-add-folder-modal');
  }

  scrollToTheBottomOfFolderList() {
    const folderList = document.getElementById('folder-list');
    if (folderList) {
      folderList.scrollTo({ top: folderList.scrollHeight, behavior: 'smooth' });
    }
  }
}
