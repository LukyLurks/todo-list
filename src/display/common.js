import { classes } from '../selectors';

// Format project titles and todo titles
function formatTitle(title) {
  const element = document.createElement('p');
  element.textContent = title;
  element.classList.add(classes.editableText, classes.title);
  return element;
}

export {
  formatTitle,
};