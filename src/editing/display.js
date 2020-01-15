import { classes } from '../selectors';
import { remakeEditedElement } from '../rendering/common';
import { deleteTodoData, deleteProjectData, update } from './data';
import { addTodoToDOM, deleteTodoFromDOM } from '../rendering/todos';
import { addProjectToDOM, deleteProjectFromDOM } from '../rendering/projects';

// Indicates if there's any empty text input box within the page
let emptyEditsRemain = false;

/**
 * Changes a text element into an input one so the user can edit it
 */
function enterEditMode(event) {
  // If we edit text to be empty, it won't be visible on the page anymore and
  // the user won't be able to edit it. This condition blocks this behavior.
  if (emptyEditsRemain && !isInput(event.target)) {
    signalEmptyEdits();
  }
  // Stops this function from trying to run again while we're already editing
  if (document.activeElement === event.target) {
    return;
  }
  if (isEditable(event.target)) {
    const elementToEdit = event.target;
    const parent = elementToEdit.parentNode;
    const editingField = createEditField(elementToEdit);
    parent.replaceChild(editingField, elementToEdit);
    editingField.focus();
  }
}

function signalEmptyEdits() {
  alert('Please make sure no field is empty before attempting more edits.');
}

/**
 * Create the input box based on the element the user clicked to edit
 */
function createEditField(element) {
  const field = document.createElement('input');
  if (isDeadline(element)) {
    field.setAttribute('type', 'date');
  } else {
    field.setAttribute('type', 'text');
  }
  field.value = element.textContent;
  field.classList.add(...element.classList.values())
  field.addEventListener('blur', applyEdit);
  return field;
}

/**
 * Commit the user's edits to the page and the localStorage
 */
function applyEdit(event) {
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

function toggleCompletion(event) {
  update(event.target);
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

function isEditable(element) {
  return element.classList.contains(classes.editable);
}

function isInput(element) {
  return element.tagName.toLowerCase() === 'input';
}

function isDeadline(element) {
  return element.classList.contains(classes.deadline);
}

export {
  enterEditMode,
  deleteTodo,
  deleteProject,
  createTodo,
  createProject,
  toggleCompletion,
  isDeadline,
};