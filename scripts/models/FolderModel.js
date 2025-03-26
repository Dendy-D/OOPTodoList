import { setReadOnlyProperty } from '../utils/setReadOnlyProperty.js';

export class FolderModel {
  constructor({ id, title, color }) {
    setReadOnlyProperty(this, 'id', id);
    this.title = title;
    this.color = color;
    setReadOnlyProperty(this, 'createdAt', new Date());
  }

  static validate(folderName, color) {
    const errors = [];

    if (!folderName) errors.push({ name: 'folderName', description: 'Folder name is required.' });
    if (!color) errors.push({ name: 'color', description: 'Color selection is required.' });

    return errors;
  }
}
