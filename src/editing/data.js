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
    if (isProject(element) || isTodo(element)) {
      element.setAttribute(attribute, index);
    }
    setIndexes(element.querySelector(`.${classes.todoList}`));
  });
}

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
    } else if (child.classList.contains(classes.prioritySelect)) {
      output.priority = priorityLevels[child.value];
    }
    return output;
  }, {});
}

/**
 * Update the indexes in the DOM and the data in the browser and localStorage
 */
function update(project) {
  setIndexes(document.querySelector(`#${ids.allProjects}`));
  saveEdits(project);
}

/**
 * Select the project containing the node argument
 * Essentially the argument will be an event.target for an edit,
 * and we'll select the project to apply the changes
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
 * Select the todo containing the node argument
 * Essentially the argument will be an event.target for an edit,
 * and we'll select the todo to apply the changes
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

function isProject(node) {
  return node.classList.contains(classes.project);
}

function isTodo(node) {
  return node.classList.contains(classes.todo);
}

function isTodoList(node) {
  return node.classList.contains(classes.todoList);
}


/**
 * Reflect the changes to an element in the DOM on the objects and localStorage
 */
function saveEdits(element) {
  let updatedProject = convertProjectToData(getProjectElement(element));
  if (updatedProject) {
    projectsData[getProjectIndex(element)] = updatedProject;
  }
  saveProjects(projectsData);
}

function deleteTodoData(element) {
  const todoIndex = getTodoIndex(element);
  const projectIndex = getProjectIndex(element);
  projectsData[projectIndex].todos.splice(todoIndex, 1);
}

function deleteProjectData(element) {
  const projectIndex = getProjectIndex(element);
  projectsData.splice(projectIndex, 1);
}

export {
  setIndexes,
  getTodoElement,
  update,
  getProjectElement,
  deleteTodoData,
  deleteProjectData,
  saveEdits,
};