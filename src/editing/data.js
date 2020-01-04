import { classes, attributes, ids } from '../selectors';
import { priorityLevels } from '../models/todo';
import { projectsData } from '../index';
import { saveProjects } from '../storage';

/**
 * Indexes the projects in the DOM with an attribute according to the index 
 * in the array they're stored in
 * Looks recursively inside to index the todos in the same way, with a different
 * attribute
 * 
 * The indexes are used to refer to elements when editing, saving, deleting etc.
 */
function setIndexes(elementList) {
  if (!elementList || elementList.length < 0) {
    return;
  }

  let attribute = attributes.todoIndex;
  if (elementList.id === ids.allProjects) {
    attribute = attributes.projectIndex;
  }

  [...elementList.children].forEach((element, index) => {
    element.setAttribute(attribute, index);
    setIndexes(element.querySelector(`.${classes.todoList}`));
  });
}

function convertProjectToData(projectElement) {
  return [...projectElement.children].reduce((output, child) => {
    if (child.classList.contains(classes.title)) {
      output.title = child.textContent;
    } else if (child.classList.contains(classes.todoList)) {
      output.todos = convertTodosToData(child);
    }
    return output;
  }, {});
}

function convertTodosToData(todos) {
  return [...todos.children].reduce((output, todo) => {
    return output.concat(convertTodoToData(todo));
  }, []);
}

function convertTodoToData(todoElement) {
  return [...todoElement.children].reduce((output, child) => {
    if (child.classList.contains(classes.title)) {
      output.title = child.textContent;
    } else if (child.classList.contains(classes.description)) {
      output.description = child.textContent;
    } else if (child.classList.contains(classes.deadline)) {
      output.deadline = new Date(child.textContent);
    } else if (child.classList.contains(classes.priority)) {
      output.priority = priorityLevels[child.textContent.toLowerCase()];
    }
    return output;
  }, {});
}

/**
 * Select the project DOM element containing that node
 */
function getProjectElement(node) {
  return document.querySelector(
    `[${attributes.projectIndex}="${getProjectIndex(node)}"]`
  );
}

/**
 * Gets the index of the project containing that node, to either
 * grab the DOM element or reference the array containing the rendered data
 */
function getProjectIndex(node) {
  if (node.hasAttribute(attributes.projectIndex)) {
    return +node.getAttribute(attributes.projectIndex);
  } else if (node.parentNode) {
    return getProjectIndex(node.parentNode);
  }
}

/**
 * Save edits in the localStorage
 */
function saveEdits(element) {
  let updatedProject = convertProjectToData(getProjectElement(element));
  projectsData[getProjectIndex(element)] = updatedProject;
  saveProjects(projectsData);
}

export {
  setIndexes,
  saveEdits,
};