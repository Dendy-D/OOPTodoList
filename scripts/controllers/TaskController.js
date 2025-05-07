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
    this.enableEditingFolderName = this.enableEditingFolderName.bind(this);
    this.disableEditingFolderName = this.disableEditingFolderName.bind(this);
    this.completeTask = this.completeTask.bind(this);
    this.uncompleteTask = this.uncompleteTask.bind(this);
    this.toastManagerError = new ToastManager(1, TOAST_TYPES.ERROR, 'error');
    this.toastManagerSuccess = new ToastManager(1, TOAST_TYPES.SUCCESS, 'success');

    this.renameMediator = null;
  }

  renderNoTasksSpan() {
    this.view.renderNoTasksSpan();
  }

  init(folders) {
    this.folders = folders;
    this.destroy();
    this.setUpEventListeners();
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
    this.view.setAddTaskFormHandler((event) => this.addTaskForm(event));
    this.view.setCancelAddingTaskHandler((event) => this.cancelAddingTask(event));
    this.view.setAddTaskHandler((event, folderId) => this.addTask(event, folderId));
    this.view.setTaskNameInputHandler('focus', (event) => this.focusTaskNameInput(event));
    this.view.setRemoveTaskHandler((taskId) => this.removeTask(taskId));
    this.view.setEnableEditingFolderNameHandler((folderTitleElem, folderId, folderName) => this.enableEditingFolderName(folderTitleElem, folderId, folderName));
    this.view.setRenameFolderHandlers(
      (newName, folderTitleElem, folderId) => this.disableEditingFolderName(newName, folderTitleElem, folderId),
      (folderTitleElem, folderId, originalName) => this.cancelFolderRename(folderTitleElem, folderId, originalName)
    );
    this.view.setCompleteTaskHandler(this.completeTask);
    this.view.setUncompleteTaskHandler(this.uncompleteTask);
  }

  isMultiTasksModeOn() {
    return this.folders.length > 1;
  }

  addTaskForm(event) {
    this.view.hideAddTaskFormBtn(event);
    this.view.showAddTaskForm(event);

    if (!this.isMultiTasksModeOn()) {
      this.view.scrollToTheBottomOfTaskPanel();
    }
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
    this.renderAllTasks(this.folders);
  }

  removeTask(taskId) {
    this.store.removeTask(taskId);
    this.renderAllTasks(this.folders);
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
      this.view.renderEmptyTasksPage();
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

  setRenameMediator(mediator) {
    this.renameMediator = mediator;
  }

  enableEditingFolderName(folderTitleElem, folderId, newFolderName) {
    const folder = this.store.getFolderById(this.folders, folderId);
    this.view.turnFolderNameIntoInput(folderTitleElem, newFolderName, folder.color);
  }

  disableEditingFolderName(newName, folderTitleElem, folderId) {
    const folder = this.store.getFolderById(this.folders, folderId);
    this.view.turnFolderNameInputIntoText(folderTitleElem, newName, folder.color);
    this.renameMediator.execute(folderId, newName);
  }

  cancelFolderRename(folderTitleElem, folderId, originalName) {
    const folder = this.store.getFolderById(this.folders, folderId);
    const originalColor = folder.color;
    this.view.turnFolderNameInputIntoText(folderTitleElem, originalName, originalColor);
  }

  onFolderRenamed(updatedFolder) {
    this.folder = updatedFolder;
  }

  completeTask(taskId) {
    this.store.completeTask(taskId);
    this.renderAllTasks(this.folders);
  }

  uncompleteTask(taskId) {
    this.store.unCompleteTask(taskId);
    this.renderAllTasks(this.folders);
  }
}
