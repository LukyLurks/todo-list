import { classes } from '../selectors';
import { formatDescription } from './todos';

// Format project titles and todo titles
function formatTitle(title) {
  const element = document.createElement('p');
  element.textContent = title;
  element.classList.add(classes.editableText, classes.title);
  return element;
}

function remakeEditedElement(field) {
  if (field.classList.contains(classes.title)) {
    return formatTitle(field.value);
  } else if (field.classList.contains(classes.description)) {
    return formatDescription(field.value);
  }
}

export {
  formatTitle,
  remakeEditedElement,
};