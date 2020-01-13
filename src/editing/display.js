import { remakeEditedElement } from '../rendering/common';
import { addProjectToDOM, deleteProjectFromDOM } from '../rendering/projects';
import { addTodoToDOM, deleteTodoFromDOM } from '../rendering/todos';
import { classes } from '../selectors';
import { deleteTodoData, deleteProjectData, update } from './data';

let emptyEditsRemain = false;

function enterTextEditMode(event) {
  if (emptyEditsRemain && !isInput(event.target)) {
    signalEmptyEdits();
  }
  if (document.activeElement === event.target) {
    return;
  }
  if (isEditableText(event.target)) {
    const textToEdit = event.target;
    const parent = textToEdit.parentNode;
    const editingField = createTextEditField(textToEdit);
    parent.replaceChild(editingField, textToEdit);
    editingField.focus();
  }
}

function signalEmptyEdits() {
  alert('Please make sure no field is empty before attempting more edits.');
}

function isEditableText(element) {
  return element.classList.contains(classes.editableText);
}

function isInput(element) {
  return element.tagName.toLowerCase() === 'input';
}

function createTextEditField(textElement) {
  const field = document.createElement('input');
  field.value = textElement.textContent;
  field.classList.add(...textElement.classList.values())
  field.addEventListener('blur', applyTextEdit);
  return field;
}

function applyTextEdit(event) {
  const editedField = event.target;
  if (editedField.value) {
    let newElement = remakeEditedElement(editedField);
    editedField.parentNode.replaceChild(newElement, editedField);
    emptyEditsRemain = false;
    update(newElement);
  } else {
    emptyEditsRemain = true;
  }
}

function deleteProject(event) {
  deleteProjectData(event.target);
  update(deleteProjectFromDOM(event.target));
}

function createProject() {
  update(addProjectToDOM());
}

function deleteTodo(event) {
  deleteTodoData(event.target);
  update(deleteTodoFromDOM(event.target));
}

function createTodo(event) {
  update(addTodoToDOM(event.target));
}

export {
  enterTextEditMode,
  deleteTodo,
  deleteProject,
  createTodo,
  createProject,
};