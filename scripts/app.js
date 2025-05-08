import { FolderController } from './controllers/FolderController.js';
import { FolderModel } from './models/FolderModel.js';
import { FolderView } from './views/FolderView.js';
import FolderStore from './stores/FolderStore.js';

import { FolderOperationsMediator } from './mediators/FolderOperationsMediator.js';

import { TaskController } from './controllers/TaskController.js';
import { TaskModel } from './models/TaskModel.js';
import { TaskView } from './views/TaskView.js';
import TaskStore from './stores/TaskStore.js';
import { TaskFactory } from './factories/TaskFactory.js';

const taskView = new TaskView();
const taskController = new TaskController(TaskModel, TaskStore, taskView, TaskFactory);

const folderView = new FolderView();
const folderController = new FolderController(FolderModel, FolderStore, folderView, taskController);

const folderOperationsMediator = new FolderOperationsMediator(folderController, taskController);

taskController.setFolderOperationsMediator(folderOperationsMediator);

folderController.init();
