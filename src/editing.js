import { formatTitle } from './display';
import { classes } from './selectors';

let emptyEditsRemain = false;

function enterTextEditMode(event) {
  if (emptyEditsRemain) {
    signalEmptyEdits();
  }
  if (isEditableText(event.target)) {
    const textToEdit = event.target;
    const parent = textToEdit.parentNode;
    const editingField = makeTextEditField(textToEdit);
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

function applyTextEdit(event) {
  const editedField = event.target;
  const parent = editedField.parentNode;
  const newText = editedField.value;
  if (newText) {
    const newElement = formatTitle(newText);
    parent.replaceChild(newElement, editedField);
    emptyEditsRemain = false;
  } else {
    emptyEditsRemain = true;
  }
}

function makeTextEditField(textElement) {
  const field = document.createElement('input');
  field.value = textElement.textContent;
  field.addEventListener('blur', applyTextEdit);
  return field;
}

export {
  enterTextEditMode,
};