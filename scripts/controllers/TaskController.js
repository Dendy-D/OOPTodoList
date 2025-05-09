import { ToastManager } from '../utils/ToastManager.js';
import { TOAST_TYPES } from '../constants/index.js';

export class TaskController {
  constructor(model, store, view, factory) {
    this.model = model;
    this.store = store;
    this.view = view;
    this.factory = factory;

    this.addTask = this.addTask.bind(this);
    this.cancelAddingTask = this.cancelAddingTask.bind(this);
    this.addTaskForm = this.addTaskForm.bind(this);
    this.focusTaskNameInput = this.focusTaskNameInput.bind(this);
    this.removeTask = this.removeTask.bind(this);
    this.enableEditingFolderTitle = this.enableEditingFolderTitle.bind(this);
    this.disableEditingFolderTitle = this.disableEditingFolderTitle.bind(this);
    this.completeTask = this.completeTask.bind(this);
    this.uncompleteTask = this.uncompleteTask.bind(this);
    this.toastManagerError = new ToastManager(1, TOAST_TYPES.ERROR, 'error');
    this.toastManagerSuccess = new ToastManager(1, TOAST_TYPES.SUCCESS, 'success');

    this.folderOperationsMediator = null;
  }

  renderNoTasksSpan() {
    this.view.renderNoTasksSpan();
  }

  renderEmptyTasksPage() {
    this.view.renderEmptyTasksPage();
  }

  init(folders) {
    this.folders = folders;
    this.destroy();
    this.setUpEventListeners();
    this.view.setTaskScreenScrollToTheTop();
    if (folders.length > 1) {
      this.renderAllTasks(folders);
      console.log('Task controller was initialized');
      return;
    }
    this.folder = folders[0];
    this.renderTasksPanel();
    console.log('Task controller was initialized');
  }

  renderAllTasks(folders) {
    this.destroy();
    this.setUpEventListeners();

    const fragment = document.createDocumentFragment();
    for (let folder of folders) {
      const tasksFragment = this.createTasks(folder.id);
      const taskPanelFragment = this.view.createTasksPanel(folder.id, folder.title, folder.color, tasksFragment);
      this.view.addClassesForTaskPanel(taskPanelFragment);
      fragment.append(taskPanelFragment);
    }
    this.view.renderAllTasksPanels(fragment);
  }

  destroy() {
    this.view.clearAllHandlers();
  }

  setUpEventListeners() {
    this.view.setAddTaskFormHandler((event, addTaskFormBtn) => this.addTaskForm(event, addTaskFormBtn));
    this.view.setCancelAddingTaskHandler((event) => this.cancelAddingTask(event));
    this.view.setAddTaskHandler((event, folderId) => this.addTask(event, folderId));
    this.view.setTaskNameInputHandler('focus', (event) => this.focusTaskNameInput(event));
    this.view.setRemoveTaskHandler((taskId, folderId) => this.removeTask(taskId, folderId));
    this.view.setEnableEditingFolderTitleHandler((folderTitleElem, folderId, folderTitle) => this.enableEditingFolderTitle(folderTitleElem, folderId, folderTitle));
    this.view.setRenameFolderHandlers(
      (newName, folderTitleElem, folderId) => this.disableEditingFolderTitle(newName, folderTitleElem, folderId),
      (folderTitleElem, folderId, originalName) => this.cancelFolderRename(folderTitleElem, folderId, originalName)
    );
    this.view.setCompleteTaskHandler(this.completeTask);
    this.view.setUncompleteTaskHandler(this.uncompleteTask);
  }

  isMultiTasksModeOn() {
    return this.folders.length > 1;
  }

  getFoldersFromFolderStore(folderId) {
    let folders = null;
    if (!this.isMultiTasksModeOn()) {
      folders = [this.folderOperationsMediator.getFolder(folderId)];
    } else {
      folders = this.folderOperationsMediator.getAllFolders();
    }
    return folders;
  }

  addTaskForm(event, addTaskFormBtn) {
    const bounding = this.view.getBoundingClientRectOfElem(addTaskFormBtn);
    this.view.hideAddTaskFormBtn(event);
    this.view.showAddTaskForm(event);
    this.view.scrollDownIfNeeded(bounding);
  }

  focusTaskNameInput(event) {
    this.view.removeValidationErrorInput(event);
  }

  validateAddingTask(validationErrors, event) {
    validationErrors.forEach((error) => {
      if (error.name === 'taskName') {
        this.toastManagerError.showToast(error.description);
        this.view.validationErrorInput(event);
      }
    });
  }

  addTask(event, folderId) {
    event.preventDefault();
    const taskName = this.view.getTaskContent(event);

    const validationErrors = this.model.validate(taskName);
    if (validationErrors.length) {
      this.validateAddingTask(validationErrors, event);
      return;
    }

    this.toastManagerSuccess.showToast('Task was created!');
    const newTask = this.factory.createTask({
      title: taskName,
      description: '',
      folderId: folderId,
      dueDate: null,
    });

    this.store.addTask(newTask);
    this.view.showAddTaskFormBtn(event);
    this.view.hideAddTaskForm(event);
    const folders = this.getFoldersFromFolderStore(folderId);
    this.renderAllTasks(folders);
  }

  removeTask(taskId, folderId) {
    const folders = this.getFoldersFromFolderStore(folderId);
    this.store.removeTask(taskId);
    this.renderAllTasks(folders);
  }

  cancelAddingTask(event) {
    event.preventDefault();
    this.view.showAddTaskFormBtn(event);
    this.view.hideAddTaskForm(event);
  }

  removeAllFolderTasks(folderId, folders) {
    this.store.removeAllFolderTasks(folderId);
    if (this.isMultiTasksModeOn()) {
      this.renderAllTasks(folders);
      return;
    }
    if (this.folder && this.folder.id === folderId) {
      this.renderEmptyTasksPage();
    }
  }

  renderTasksPanel() {
    if (!this.folder) {
      console.error('No folder selected');
      return;
    }
    const { id, title, color } = this.folder;
    const tasksFragment = this.createTasks();
    this.view.renderTasksPanel(id, title, color, tasksFragment);
  }

  createTasks(folderId) {
    const fragment = document.createDocumentFragment();
    const tasksOfFolder = this.store.getTasksOfFolder(folderId ?? this.folder.id);
    for (let task of tasksOfFolder) {
      const taskNode = this.view.createTask(task.title, task.id, task.isCompleted);
      fragment.append(taskNode);
    }
    return fragment;
  }

  setFolderOperationsMediator(mediator) {
    this.folderOperationsMediator = mediator;
  }

  enableEditingFolderTitle(folderTitleElem, folderId, newFolderTitle) {
    const folder = this.folderOperationsMediator.getFolder(folderId);
    this.view.turnFolderTitleIntoInput(folderTitleElem, newFolderTitle, folder.color);
  }

  disableEditingFolderTitle(newTitle, folderTitleElem, folderId) {
    const folder = this.folderOperationsMediator.getFolder(folderId);
    const dublicatingNameValidationFlag = folder.title !== newTitle;
    const updatedFolder = this.folderOperationsMediator.rename(folderId, newTitle, dublicatingNameValidationFlag);
    const updatedFolderTitle = updatedFolder ? newTitle : folder.title;
    this.view.turnFolderTitleInputIntoText(folderTitleElem, updatedFolderTitle, folder.color);
  }

  cancelFolderRename(folderTitleElem, folderId) {
    const folder = this.folderOperationsMediator.getFolder(folderId);
    const originalColor = folder.color;
    const originalTitle = folder.title;
    this.view.turnFolderTitleInputIntoText(folderTitleElem, originalTitle, originalColor);
  }

  onFolderRenamed(updatedFolder) {
    this.folder = updatedFolder;
  }

  completeTask(taskId, folderId) {
    const folders = this.getFoldersFromFolderStore(folderId);
    this.store.completeTask(taskId);
    this.renderAllTasks(folders);
  }

  uncompleteTask(taskId, folderId) {
    const folders = this.getFoldersFromFolderStore(folderId);
    this.store.unCompleteTask(taskId);
    this.renderAllTasks(folders);
  }
}
