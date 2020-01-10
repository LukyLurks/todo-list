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
  if (projectElement) {
    return [...projectElement.children].reduce((output, child) => {
      if (child.classList.contains(classes.title)) {
        output.title = child.textContent;
      } else if (child.classList.contains(classes.todoList)) {
        output.todos = convertTodosToData(child);
      }
      return output;
    }, {});
  }
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

function update(project) {
  saveEdits(project);
  setIndexes(document.querySelector(`#${ids.allProjects}`));
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
 * Select the project DOM element containing that node
 */
function getTodoElement(node) {
  return document.querySelector(
    `[${attributes.todoIndex}="${getTodoIndex(node)}"]`
  );
}

/**
 * Gets the index of the todo containing that node within one project,
 * grab the DOM element or reference the array containing the rendered data
 */
function getTodoIndex(node) {
  if (node.hasAttribute(attributes.todoIndex)) {
    return +node.getAttribute(attributes.todoIndex);
  } else if (node.parentNode && !isProject(node.parentNode)) {
    return getTodoIndex(node.parentNode);
  }
}

function isProject(node) {
  return node.classList.contains(classes.project);
}

/**
 * Save edits in the object and the localStorage
 */
function saveEdits(element) {
  let updatedProject = convertProjectToData(getProjectElement(element));
  if (updatedProject) {
    projectsData[getProjectIndex(element)] = updatedProject;
  }
  saveProjects(projectsData);
}

function deleteTodoFromData(element) {
  const todoIndex = getTodoIndex(element);
  const projectIndex = getProjectIndex(element);
  projectsData[projectIndex].todos.splice(todoIndex, 1);
}

function deleteProjectFromData(element) {
  const projectIndex = getProjectIndex(element);
  projectsData.splice(projectIndex, 1);
}

export {
  setIndexes,
  getTodoElement,
  update,
  getProjectElement,
  deleteTodoFromData,
  deleteProjectFromData,
  saveEdits,
};