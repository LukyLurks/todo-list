import { classes, attributes, ids } from '../selectors';
import { priorityLevels } from '../models/todo';
import { projectsData } from '../index';
import { saveProjects } from '../storage';

/**
 * Indexes projects and todos on the page with an attribute
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
    if (isProject(element) || isTodo(element)) {
      element.setAttribute(attribute, index);
    }
    setIndexes(element.querySelector(`.${classes.todoList}`));
  });
}

/**
 * Converts the projects from the page into an object to be stringified then
 * saved in localStorage
 */
function convertProjectToData(projectElement) {
  if (projectElement) {
    return [...projectElement.children].reduce((output, child) => {
      if (child.classList.contains(classes.title)) {
        output.title = child.textContent;
      } else if (isTodoList(child)) {
        output.todos = convertTodosToData(child);
      }
      return output;
    }, {});
  }
}

/**
 * Convert the todos of a project from a page into an array of todo objects
 * that can be saved in localStorage
 */
function convertTodosToData(todos) {
  return [...todos.children].reduce((output, todo) => {
    return output.concat(convertSingleTodo(todo));
  }, []);
}

/**
 * Convert a todo from the page into an object that respects the form of 
 * the todo.js model
 */
function convertSingleTodo(todoElement) {
  return [...todoElement.children].reduce((output, child) => {
    if (child.classList.contains(classes.title)) {
      output.title = child.textContent;
    } else if (child.classList.contains(classes.description)) {
      output.description = child.textContent;
    } else if (child.classList.contains(classes.deadline)) {
      output.deadline = new Date(child.textContent);
    } else if (child.classList.contains(classes.prioritySelect)) {
      output.priority = priorityLevels[child.value];
    } else if (child.classList.contains(classes.completedFlag)) {
      output.completed = child.checked;
    }
    return output;
  }, {});
}

/**
 * Save the changes happening on the page into localStorage
 */
function saveEdits(element) {
  let updatedProject = convertProjectToData(getProjectElement(element));
  if (updatedProject) {
    projectsData[getProjectIndex(element)] = updatedProject;
  }
  saveProjects(projectsData);
}

/**
 * Should be called in reaction to changes on the page to save them
 */
function update(project) {
  setIndexes(document.querySelector(`#${ids.allProjects}`));
  saveEdits(project);
}

/**
 * Select the project containing the node passed as argument
 * Essentially the argument will be an event.target for an edit,
 * and we'll need to select the project to apply the changes
 */
function getProjectElement(node) {
  return document.querySelector(
    `[${attributes.projectIndex}="${getProjectIndex(node)}"]`
  );
}

function getProjectIndex(node) {
  if (node.hasAttribute(attributes.projectIndex)) {
    return +node.getAttribute(attributes.projectIndex);
  } else if (node.parentNode) {
    return getProjectIndex(node.parentNode);
  }
}

/**
 * Select the todo containing the node passed as argument
 * Essentially the argument will be an event.target for an edit,
 * and we'll need to select the todo to apply the changes
 */
function getTodoElement(node) {
  const project = getProjectElement(node);
  return project.querySelector(
    `[${attributes.todoIndex}="${getTodoIndex(node)}"]`
  );
}

function getTodoIndex(node) {
  if (node.hasAttribute(attributes.todoIndex)) {
    return +node.getAttribute(attributes.todoIndex);
  } else if (node.parentNode && !isProject(node.parentNode)) {
    return getTodoIndex(node.parentNode);
  }
}

/**
 * Removes 1 todo from the session data
 */
function deleteTodoData(element) {
  const todoIndex = getTodoIndex(element);
  const projectIndex = getProjectIndex(element);
  projectsData[projectIndex].todos.splice(todoIndex, 1);
}

/**
 * Removes 1 project from the session data
 */
function deleteProjectData(element) {
  const projectIndex = getProjectIndex(element);
  projectsData.splice(projectIndex, 1);
}

function isProject(node) {
  return node.classList.contains(classes.project);
}

function isTodo(node) {
  return node.classList.contains(classes.todo);
}

function isTodoList(node) {
  return node.classList.contains(classes.todoList);
}

export {
  setIndexes,
  saveEdits,
  update,
  getTodoElement,
  getProjectElement,
  deleteTodoData,
  deleteProjectData,
};