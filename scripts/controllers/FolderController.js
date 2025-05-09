import { ToastManager } from '../utils/ToastManager.js';
import { TOAST_TYPES } from '../constants/index.js';

export class FolderController {
  constructor(model, store, view, taskController) {
    this.model = model;
    this.store = store;
    this.view = view;
    this.taskController = taskController;

    this.handleEnterKeyPressed = this.handleEnterKeyPressed.bind(this);
    this.handleEscapeKeyPressed = this.handleEscapeKeyPressed.bind(this);
    this.renameFolder = this.renameFolder.bind(this);
    this.toastManagerError = new ToastManager(2, TOAST_TYPES.ERROR, 'error');
    this.toastManagerSuccess = new ToastManager(1, TOAST_TYPES.SUCCESS, 'success');
  }

  init() {
    this.setUpEventListeners();
    if (this.store.folders.length) this.renderFolderList();
    this.taskController.renderNoTasksSpan();

    console.log('Folder controller was initialized');
  }

  setUpEventListeners() {
    this.view.setOpenModalHandler(() => this.showAddFolderModal());
    this.view.setCloseModalHandler(() => this.hideAddFolderModal());
    this.view.setColorSelectionHandler((color) => this.selectFolderColor(color));
    this.view.setAddFolderHandler(() => this.addFolder());
    this.view.setFolderNameInputHandler('focus', () => this.focusFolderNameInput());
    this.view.setRemoveFolderHandler((folderId, folderElement) => this.removeFolder(folderId, folderElement));
    this.view.setChooseFolderHandler((folderId) => this.chooseFolder(folderId));
    this.view.setShowAllTasksHandler(() => this.showAllTasks())
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

  validateAddingFolder(validationErrors) {
    validationErrors.forEach((error) => {
      if (error.name === 'color') this.toastManagerError.showToast(error.description);
      if (error.name === 'folderName') {
        this.toastManagerError.showToast(error.description);
        this.view.validationErrorInput();
      }
    });
  }

  addFolder() {
    const folderName = this.view.getFolderName();
    const color = this.view.getSelectedColor();

    const validationErrors = this.model.validate(folderName, color);
    if (validationErrors.length) {
      this.validateAddingFolder(validationErrors);
      return;
    }

    if (this.store.hasFolderWithName(folderName)) {
      this.toastManagerError.showToast('Folder with this title already exists.');
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

    this.view.scrollToTheBottomOfFolderList();

    this.view.addClassToChosenFolder(newFolder.id);
    this.taskController.init([newFolder]);
  }

  renameFolder(folderId, newName, dublicatingNameValidationFlag) {
    const validationErrors = this.model.validate(newName, '_');
    if (validationErrors.length) {
      this.validateAddingFolder(validationErrors);
      return;
    }

    if (this.store.hasFolderWithName(newName)) {
      if (dublicatingNameValidationFlag) {
        this.toastManagerError.showToast('Folder with this title already exists.');
      }
      return;
    }

    const updatedFolder = this.store.renameFolder(folderId, newName);
    if (this.store.folders.length) this.renderFolderList();
    return updatedFolder;
  }

  renderFolders() {
    const fragment = document.createDocumentFragment();
    for (let folder of this.store.folders) {
      const folderNode = this.view.createFolder(folder.title, folder.color, folder.id);
      fragment.append(folderNode);
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
    const folders = this.store.folders;
    this.taskController.removeAllFolderTasks(id, folders);
  }

  chooseFolder(folderId) {
    const folder = this.store.getFolderById(folderId);
    if (!folder) {
      console.error('Folder not found');
      return;
    }
    this.taskController.init([folder]);
    this.view.addClassToChosenFolder(folderId);
    this.view.turnOffFullHeightMode();
    this.view.removeClassForFolderModal();
  }

  showAllTasks() {
    const isShowAllTasksBtnActive = this.view.isShowAllTasksBtnActive();
    if (isShowAllTasksBtnActive) {
      this.view.turnOffFullHeightMode();
      this.view.removeClassForFolderModal();
      this.view.removeChosenClassShowAllTasksBtn();
      this.taskController.renderEmptyTasksPage();
      return;
    }
    const folders = this.store.folders;
    this.view.addClassToShowAllTasksBtn();
    this.view.turnOnFullHeightMode();
    this.taskController.init(folders);
    this.view.addClassForFolderModal();
  }
}
