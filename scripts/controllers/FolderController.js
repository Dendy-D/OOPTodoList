import { ToastManager } from '../utils/ToastManager.js';
import { TOAST_TYPES } from '../constants/constants.js';

export class FolderController {
  constructor(model, store, view) {
    this.model = model;
    this.store = store;
    this.view = view;

    this.handleEnterKeyPressed = this.handleEnterKeyPressed.bind(this);
    this.handleEscapeKeyPressed = this.handleEscapeKeyPressed.bind(this);
    this.toastManagerError = new ToastManager(2, TOAST_TYPES.ERROR, 'error');
    this.toastManagerSuccess = new ToastManager(1, TOAST_TYPES.SUCCESS, 'success');
  }

  init() {
    this.setUpEventListeners();
    if (this.store.folders.length) this.renderFolderList();

    console.log('Folder controller was initialized');
  }

  setUpEventListeners() {
    this.view.setOpenModalHandler(() => this.showAddFolderModal());
    this.view.setCloseModalHandler(() => this.hideAddFolderModal());
    this.view.setColorSelectionHandler((color) => this.selectFolderColor(color));
    this.view.setAddFolderHandler(() => this.addFolder());
    this.view.setFolderNameInputHandler('focus', () => this.focusFolderNameInput());
    this.view.setRemoveFolderHandler((folderId, folderElement) => this.removeFolder(folderId, folderElement));
  }

  showAddFolderModal() {
    this.view.openAddFolderModal();
    document.addEventListener('keydown', this.handleEscapeKeyPressed);
    document.addEventListener('keydown', this.handleEnterKeyPressed);
  }

  hideAddFolderModal() {
    this.view.closeAddFolderModal();
    document.removeEventListener('keydown', this.handleEscapeKeyPressed);
    document.removeEventListener('keydown', this.handleEnterKeyPressed);
  }

  handleEscapeKeyPressed(event) {
    if (event.key === 'Escape') {
      this.hideAddFolderModal();
    }
  }

  handleEnterKeyPressed(event) {
    if (event.key === 'Enter') {
      this.view.blurFolderNameInput();
      this.addFolder();
    }
  }

  selectFolderColor(color) {
    this.view.highlightSelectedColor(color);
  }

  focusFolderNameInput() {
    this.view.removeValidationErrorInput();
  }

  addFolder() {
    const folderName = this.view.getFolderName();
    const color = this.view.getSelectedColor();

    const validationErrors = this.model.validate(folderName, color);
    if (validationErrors.length) {
      validationErrors.forEach((error) => {
        if (error.field === 'color') this.toastManagerError.showToast(error.name);
        if (error.field === 'folderName') {
          this.toastManagerError.showToast(error.name);
          this.view.validationErrorInput();
        }
      });
      return;
    }
    this.toastManagerSuccess.showToast('Folder was created!');

    const newFolder = new this.model({
      id: crypto.randomUUID(),
      title: folderName,
      color,
    });

    this.store.addFolder(newFolder);
    this.hideAddFolderModal();
    this.renderFolderList();
  }

  renderFolders() {
    const fragment = document.createDocumentFragment();
    for (let folder of this.store.folders) {
      const folderNode = this.view.createFolder(folder.title, folder.color, folder.id);
      fragment.appendChild(folderNode);
    }
    this.view.renderFolders(fragment);
  }

  renderFolderList() {
    this.view.renderFolderList();
    this.renderFolders();
  }

  removeFolder(id, folderElement) {
    this.store.removeFolder(id);
    this.view.removeFolder(folderElement);
    if (this.store.folders.length === 0) {
      this.view.removeFolderListElement();
    }
  }
}
