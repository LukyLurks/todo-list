import { formatDescription, formatDate } from './todos';
import { isDeadline } from '../editing/display';
import { classes } from '../selectors';

// Format project titles and todo titles
function formatTitle(title) {
  const element = document.createElement('p');
  element.textContent = title;
  element.classList.add(classes.editable, classes.title);
  return element;
}

function remakeEditedElement(field) {
  if (isTitle(field)) {
    return formatTitle(field.value);
  } else if (isDescription(field)) {
    return formatDescription(field.value);
  } else if (isDeadline(field)) {
    return formatDate(field.value);
  }
}

function isTitle(element) {
  return element.classList.contains(classes.title);
}
function isDescription(element) {
  return element.classList.contains(classes.description);
}

export {
  formatTitle,
  remakeEditedElement,
};