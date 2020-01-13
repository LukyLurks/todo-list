import { classes } from '../selectors';
import { formatDescription, formatDate } from './todos';

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

function isDeadline(element) {
  return element.classList.contains(classes.deadline);
}

export {
  formatTitle,
  remakeEditedElement,
};