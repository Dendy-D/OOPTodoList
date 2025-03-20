// import { TaskModel } from './models/TaskModel.js';
import { FolderController } from './controllers/FolderController.js';
import { FolderModel } from './models/FolderModel.js';
import { FolderView } from './views/FolderView.js';
import FolderStore from './stores/FolderStore.js';

const folderView = new FolderView();

const folderController = new FolderController(FolderModel, FolderStore, folderView);
folderController.init();
