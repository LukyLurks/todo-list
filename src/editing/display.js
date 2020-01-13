import { remakeEditedElement } from '../rendering/common';
import { addProjectToDOM, deleteProjectFromDOM } from '../rendering/projects';
import { addTodoToDOM, deleteTodoFromDOM } from '../rendering/todos';
import { classes } from '../selectors';
import { deleteTodoData, deleteProjectData, update } from './data';

let emptyEditsRemain = false;

function enterEditMode(event) {
  if (emptyEditsRemain && !isInput(event.target)) {
    signalEmptyEdits();
  }
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

function isEditable(element) {
  return element.classList.contains(classes.editable);
}

function isInput(element) {
  return element.tagName.toLowerCase() === 'input';
}

function isDeadline(element) {
  return element.classList.contains(classes.deadline);
}

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
  enterEditMode as enterTextEditMode,
  deleteTodo,
  deleteProject,
  createTodo,
  createProject,
};