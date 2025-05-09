import { View } from './View.js';

export class TaskView extends View {
  constructor() {
    super();
    this.taskScreen = this.getElementByIdOrThrow('task-screen');
  }

  renderNoTasksSpan() {
    this.noTasksSpan = this.createElement('span', 'no-tasks-span', 'No tasks available');
    this.noTasksSpan.id = 'no-tasks-span';
    this.taskScreen.append(this.noTasksSpan);
  }

  renderEmptyTasksPage() {
    this.taskScreen.classList.add('no-tasks');
    this.noTasksSpan.classList.remove('hidden');
    const taskScreenFirstChild = this.taskScreen.firstChild;
    this.taskScreen.replaceChildren(taskScreenFirstChild);
  }

  createAddTaskFormBtn() {
    const addTaskFormBtnIcon = this.createSvgElement('add-task-form-btn-icon', './assets/icons/icons.svg#plusIcon');
    const addTaskFormBtn = this.createElement('button', 'add-task-form-btn', 'New task', addTaskFormBtnIcon);
    return addTaskFormBtn;
  }

  createAddingTaskForm() {
    const addTaskForm = this.createElement('form', 'add-task-form hidden');
    const taskContentInput = this.createElement('input', 'task-content-input');
    taskContentInput.type = 'text';
    taskContentInput.placeholder = 'Task content';
    const buttonContainer = this.createElement('div', 'btn-group');
    const addTaskBtn = this.createElement('button', 'btn add-task-btn', 'Add task');
    const cancelBtn = this.createElement('button', 'btn cancel-btn', 'Cancel');
    buttonContainer.append(addTaskBtn, cancelBtn);
    addTaskForm.append(taskContentInput, buttonContainer);
    return addTaskForm;
  }

  createH1ForFolderTitle(folderTitleContent, folderTitleColor) {
    const textColorClass = folderTitleColor.replace('-folder-color', '-text-color');
    const folderTitle = this.createElement('h1', textColorClass, folderTitleContent);
    return folderTitle;
  }

  createFolderTitle(folderTitleContent, folderTitleColor) {
    const folderTitleBlock = this.createElement('div', 'folder-title');
    const folderTitle = this.createH1ForFolderTitle(folderTitleContent, folderTitleColor);
    const editFolderTitleBtn = this.createSvgElement('edit-icon', './assets/icons/icons.svg#editIcon');
    folderTitleBlock.append(folderTitle, editFolderTitleBtn);
    return folderTitleBlock;
  }

  setAddTaskHandler(handler) {
    this.setHandler('addTask', this.taskScreen, 'click', (event) => {
      const taskPanel = event.target.closest('.task-panel');
      if (taskPanel) {
        const folderId = taskPanel.dataset.folderId;
        if (event.target.closest('.add-task-btn')) {
          handler(event, folderId);
        }
      }
    });
  }


  setCancelAddingTaskHandler(handler) {
    this.setHandler('cancelAddingTask', this.taskScreen, 'click', (event) => {
      if (event.target.closest('.cancel-btn')) {
        handler(event);
      }
    });
  }

  setAddTaskFormHandler(handler) {
    this.setHandler('addTaskForm', this.taskScreen, 'click', (event) => {
      const addTaskFormBtn = event.target.closest('.add-task-form-btn');
      if (addTaskFormBtn) {
        handler(event, addTaskFormBtn);
      }
    })
  }

  setTaskNameInputHandler(eventName, handler) {
    this.setHandler('taskNameInput', this.taskScreen, 'click', (event) => {
      const taskContentInput = event.target.closest('.task-content-input');
      if (taskContentInput) {
        taskContentInput.addEventListener(eventName, handler);
      }
    })
  }

  removeTaskHandler(event, handler) {
    if (event.target.closest('.remove-task-btn')) {
      const taskId = event.target.closest('.task').dataset.id;
      const taskPanel = event.target.closest('.task-panel');
      const folderId = taskPanel.dataset.folderId;
      if (taskId) handler(taskId, folderId);
    }
  }

  setRemoveTaskHandler(handler) {
    this.setHandler('removeTask', this.taskScreen, 'click', (event) => this.removeTaskHandler(event, handler));
  }

  turnFolderTitleIntoInput(folderTitleElem, folderTitle, folderTitleColor) {
    const folderTitleInputColorClass = folderTitleColor.replace('-folder-color', '-text-color');
    const folderTitleInput = this.createElement('input', `rename-folder-input ${folderTitleInputColorClass}`, folderTitle);
    const oldFolderTitle = folderTitleElem.firstChild;
    oldFolderTitle.replaceWith(folderTitleInput);
    folderTitleInput.focus();
  }

  turnFolderTitleInputIntoText(folderTitleElem, newName, folderTitleColor) {
    const input = folderTitleElem.firstChild;
    if (!input || !input.isConnected) return;

    const textColorClass = folderTitleColor.replace('-folder-color', '-text-color');
    const newFolderTitle = this.createH1ForFolderTitle(newName, textColorClass);

    input.replaceWith(newFolderTitle);
  }

  setRenameFolderHandlers(renameHandler, cancelHandler) {
    let isProcessing = false;

    const handleEvent = (event) => {
      if (isProcessing) return;

      const input = event.target.closest('.rename-folder-input');

      const taskPanel = event.target.closest('.task-panel');
      const folderId = taskPanel.dataset.folderId;
      if (!input) return;

      if (event.type === 'keydown' && event.key === 'Escape') {
        isProcessing = true;
        try {
          event.preventDefault();
          cancelHandler(input.parentElement, folderId);
        } finally {
          isProcessing = false;
        }
        return;
      }

      if ((event.type === 'keydown' && event.key !== 'Enter') || (event.type === 'blur' && event.key === 'Escape')) {
        return;
      }

      isProcessing = true;
      try {
        renameHandler(input.value, input.parentElement, folderId);
        if (event.key === 'Enter') event.preventDefault();
      } finally {
        isProcessing = false;
      }
    };

    this.setHandler('folderRenameBlur', this.taskScreen, 'blur', (event) => handleEvent(event), { capture: true });
    this.setHandler('folderRenameKeys', this.taskScreen, 'keydown', handleEvent);
  }

  setEnableEditingFolderTitleHandler(handler) {
    this.setHandler('renameFolder', this.taskScreen, 'click', (event) => this.editFolderTitleHandler(event, handler));
  }

  editFolderTitleHandler(event, handler) {
    if (event.target.closest('.rename-folder-input')) return;
    const taskPanel = event.target.closest('.task-panel');
    if (taskPanel) {
      const folderId = taskPanel.dataset.folderId;
      const folderTitle = taskPanel.querySelector('.folder-title h1').textContent;
      if (event.target.closest('.edit-icon')) {
        const folderTitleElem = event.target.closest('.folder-title');
        if (folderTitleElem) handler(folderTitleElem, folderId, folderTitle);
      }
    }
  }

  getTaskContent(event) {
    const addTaskForm = event.target.closest('.add-task-form');
    const taskContentInput = addTaskForm.querySelector('.task-content-input');
    return taskContentInput.value.trim();
  }

  
  hideAddTaskForm(event) {
    const addTaskForm = event.target.closest('.add-task-form');
    addTaskForm.classList.add('hidden');
    const taskContentInput = addTaskForm.querySelector('.task-content-input');
    taskContentInput.value = '';
  }
    
  showAddTaskFormBtn(event) {
    const addTaskForm = event.target.closest('.add-task-form');
    const addTaskFormBtn = addTaskForm.previousElementSibling;
    addTaskFormBtn.classList.remove('hidden');
  }

  showAddTaskForm(event) {
    const addTaskForm = event.target.nextElementSibling;
    addTaskForm.classList.remove('hidden');
    const taskContentInput = addTaskForm.querySelector('.task-content-input')
    taskContentInput.focus();
  }

  hideAddTaskFormBtn(event) {
    event.target.classList.add('hidden');
  }

  addEmptyClassForTaskList() {
    const taskList = document.getElementById('task-list');
    if (taskList) taskList.classList.add('empty-task-list');
  }

  removeEmptyClassForTaskList() {
    const taskList = document.getElementById('task-list');
    if (taskList) taskList.classList.remove('empty-task-list');
  }

  createTaskList() {
    const taskList = this.createElement('div', 'task-list');
    taskList.id = 'task-list';
    return taskList;
  }

  completeHoverTask(taskContentWrapper, incompleteIcon, completeHoverIcon) {
    incompleteIcon.addEventListener('mouseenter', () => {
      incompleteIcon.remove();
      taskContentWrapper.prepend(completeHoverIcon);
    });

    completeHoverIcon.addEventListener('mouseleave', () => {
      completeHoverIcon.remove();
      taskContentWrapper.prepend(incompleteIcon);
    });
  }

  setCompleteTaskHandler(handler) {
    if (this.taskScreen) {
      this.setHandler('taskPanelForCompleteTask', this.taskScreen, 'click', (event) => {
        const copleteHoverIcon = event.target.closest('.complete-hover-icon');
        if (copleteHoverIcon) {
          const task = event.target.closest('.task');
          const taskId = task.dataset.id;
          const taskPanel = event.target.closest('.task-panel');
          const folderId = taskPanel.dataset.folderId;
          this.completeTask(copleteHoverIcon.parentElement, copleteHoverIcon);
          handler(taskId, folderId);
        }
      });
    }
  }

  setUncompleteTaskHandler(handler) {
    if (this.taskScreen) {
      this.setHandler('taskListForUnCompleteTask', this.taskScreen, 'click', (event) => {
        const completeIcon = event.target.closest('.complete-icon');
        if (completeIcon) {
          const task = event.target.closest('.task');
          const taskId = task.dataset.id;
          const taskPanel = event.target.closest('.task-panel');
          const folderId = taskPanel.dataset.folderId;
          this.unCompleteTask(completeIcon.parentElement, completeIcon);
          handler(taskId, folderId);
        }
      });
    }
  }

  completeTask(taskContentWrapper, copleteHoverIcon) {
    const completeIcon = this.createSvgElement('complete-icon', './assets/icons/icons.svg#completeIcon');
    copleteHoverIcon.remove();
    taskContentWrapper.prepend(completeIcon);
  }

  unCompleteTask(taskContentWrapper, completeIcon) {
    const incompleteIcon = this.createSvgElement('incomplete-icon', './assets/icons/icons.svg#incompleteIcon');
    completeIcon.remove();
    taskContentWrapper.prepend(incompleteIcon);
  }

  createTask(taskName, taskId, isCompleted) {
    const taskContentWrapper = this.createElement('div', 'task-content-wrapper');
    const taskContent = this.createElement('div', 'task-name', taskName);
    if (isCompleted) taskContent.classList.add('task-completed')
    const incompleteIcon = this.createSvgElement('incomplete-icon', './assets/icons/icons.svg#incompleteIcon');
    const completeHoverIcon = this.createSvgElement('complete-hover-icon', './assets/icons/icons.svg#completeHoverIcon');
    
    const completeIcon = this.createSvgElement('complete-icon', './assets/icons/icons.svg#completeIcon');
    
    this.completeHoverTask(taskContentWrapper, incompleteIcon, completeHoverIcon);
    const taskIcon = isCompleted ? completeIcon : incompleteIcon;
    taskContentWrapper.append(taskIcon, taskContent);
    const task = this.createElement('div', 'task', taskContentWrapper);
    const removeTaskIcon = this.createSvgElement('remove-task-btn', './assets/icons/icons.svg#removeIcon');

    task.append(removeTaskIcon);
    task.dataset.id = taskId;
    return task;
  }

  validationErrorInput(event) {
    const addTaskForm = event.target.closest('.add-task-form');
    const taskContentInput = addTaskForm.querySelector('.task-content-input');
    taskContentInput.classList.add('input-validation-error');
  }

  removeValidationErrorInput(event) {
    const addTaskForm = event.target.closest('.add-task-form');
    const taskContentInput = addTaskForm.querySelector('.task-content-input');
    taskContentInput.classList.remove('input-validation-error');
  }

  createTasksPanel(folderId, folderTitle, folderTitleColor, tasksFragment) {
    const folderTitleBlock = this.createFolderTitle(folderTitle, folderTitleColor);
    const hr = this.createElement('hr', 'task-hr');

    const folderTitleWithHr = this.createElement('div', 'folder-with-hr');
    folderTitleWithHr.append(folderTitleBlock, hr)

    const taskPanel = this.createElement('div', 'task-panel');
    taskPanel.dataset.folderId = folderId;

    const addTaskFormBtn = this.createAddTaskFormBtn();
    const addTaskForm = this.createAddingTaskForm();

    const taskList = this.createTaskList();
    taskList.append(tasksFragment);
    if (taskList.children.length) {
      const lastChild = taskList.lastElementChild;
      lastChild.classList.add('last-task')
    }
    
    taskPanel.append(folderTitleWithHr, taskList, addTaskFormBtn, addTaskForm);
    return taskPanel;
  }

  removeTaskPanels() {
    const taskPanels = document.querySelectorAll('.task-panel');
    if (!taskPanels.length) return;
    taskPanels.forEach(taskPanel => {
      taskPanel.remove();
    })
  }

  renderTasksPanel(folderId, folderTitle, folderTitleColor, tasksFragment) {
    this.taskScreen.classList.remove('no-tasks');
    this.noTasksSpan.classList.add('hidden');

    const taskPanel = this.createTasksPanel(folderId, folderTitle, folderTitleColor, tasksFragment);
    this.removeTaskPanels()
    this.taskScreen.append(taskPanel);
  }

  renderAllTasksPanels(taskPanelsFragment) {
    this.taskScreen.classList.remove('no-tasks');
    this.noTasksSpan.classList.add('hidden');
    this.removeTaskPanels()
    this.taskScreen.append(taskPanelsFragment);
  }

  renderNoTaskPage() {
    this.taskScreen.classList.add('no-tasks');
    this.noTasksSpan.classList.remove('hidden');
    const taskPanel = this.taskScreen.querySelector('.task-panel');
    taskPanel.remove();
  }

  addClassesForTaskPanel(taskPanelFragment) {
    const taskLists = taskPanelFragment.querySelectorAll('.task-list');
    taskLists.forEach(taskList => {
      taskList.classList.add('multiple-task-list')
    })
  }

  scrollDownIfNeeded(bounding) {
    const threshold = 100;
    if (bounding.bottom + threshold > this.taskScreen.offsetHeight) {
      this.taskScreen.scrollBy(0, 150);
    }
  }

  setTaskScreenScrollToTheTop() {
    this.taskScreen.scrollTo({ top: 0 });
  }

  getBoundingClientRectOfElem(elem) {
    return elem.getBoundingClientRect();
  }
}
