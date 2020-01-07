import { formatTitle } from '../display/common';
import { formatDescription } from '../display/todos';
import { classes, ids } from '../selectors';
import { 
  saveEdits,
  setIndexes,
  getTodoElement,
  getProjectElement,
  deleteTodoFromData,
} from './data';

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
    saveEdits(newElement);
  } else {
    emptyEditsRemain = true;
  }
}

function remakeEditedElement(field) {
  if (field.classList.contains(classes.title)) {
    return formatTitle(field.value);
  } else if (field.classList.contains(classes.description)) {
    return formatDescription(field.value);
  }
}

/**
 * Remove a todo from the DOM and the localStorage
 */
function deleteTodo(event) {
  const project = getProjectElement(event.target);
  deleteTodoFromData(event.target);
  deleteTodoFromDOM(event.target);
  saveEdits(project);
  setIndexes(document.querySelector(`#${ids.allProjects}`));
}

function deleteTodoFromDOM(element) {
  const todo = getTodoElement(element);
  todo.parentNode.removeChild(todo);
}

export {
  enterTextEditMode,
  deleteTodo,
};