import { remakeEditedElement } from '../rendering/common';
import { deleteProjectFromDOM } from '../rendering/projects';
import { addTodoToDOM, deleteTodoFromDOM } from '../rendering/todos';
import { classes } from '../selectors';
import { deleteTodoFromData, deleteProjectFromData, update } from './data';

let emptyEditsRemain = false;

function enterTextEditMode(event) {
  if (emptyEditsRemain) {
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
  deleteProjectFromData(event.target);
  update(deleteProjectFromDOM(event.target));
}

/**
 * Remove a todo from the DOM and the localStorage
 */
function deleteTodo(event) {
  deleteTodoFromData(event.target);
  update(deleteTodoFromDOM(event.target));
}

function createTodo(event) {
  addTodoToDOM(event.target);
  update(event.target);
}

export {
  enterTextEditMode,
  deleteTodo,
  deleteProject,
  createTodo,
};