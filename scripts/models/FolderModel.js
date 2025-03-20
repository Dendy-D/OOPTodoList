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

    if (!folderName) errors.push({ field: 'folderName', name: 'Folder name is required.' });
    if (!color) errors.push({ field: 'color', name: 'Color selection is required.' });

    return errors;
  }
}
