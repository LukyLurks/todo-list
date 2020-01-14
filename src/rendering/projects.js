import { enterEditMode } from '../editing/display';
import { formatTodos } from './todos';
import { formatTitle } from './common';
import { ids, classes } from '../selectors';
import { setIndexes, getProjectElement } from '../editing/data';
import { deleteProject, createTodo, createProject } from '../editing/display';
import { Project } from '../models/project';

function renderProjects(projects) {
  document.body.appendChild(formatProjects(projects));
}

function formatProjects(projects) {
  const container = createProjectsContainer();
  container.addEventListener('click', enterEditMode);
  projects.forEach(project => {
    container.appendChild(formatSingleProject(project))
  });
  setIndexes(container);
  return container;
}

function createProjectsContainer() {
  const container = document.createElement('div');
  container.id = ids.allProjects;
  return container;
}

function formatSingleProject(project) {
  const output = document.createElement('div');
  for (let key in project) {
    switch (key) {
      case 'title':
        output.appendChild(formatTitle(project[key]));
        break;
      case 'todos':
        output.appendChild(formatTodos(project[key]));
        break;
      default:
        console.warn(`Unexpected key ${key} while formatting project: skipping`);
        break;
    }
  }
  addButtons(output);
  output.classList.add(classes.project);
  return output;
}

function addButtons(element) {
  addDeleteButton(element);
  addNewTodoButton(element);
}

function addDeleteButton(element) {
  const button = document.createElement('button');
  button.textContent = 'Delete this project';
  button.addEventListener('click', deleteProject);
  element.appendChild(button);
}

function addNewProjectButton() {
  const root = document.querySelector(`#${ids.allProjects}`).parentNode;
  const button = document.createElement('button');
  button.textContent = 'New Project';
  button.addEventListener('click', createProject);
  root.insertBefore(button, root.firstChild);
}

function addProjectToDOM() {
  const allProjects = document.querySelector(`#${ids.allProjects}`);
  const newProject = formatSingleProject(Project());
  return allProjects.appendChild(newProject);
}

function deleteProjectFromDOM(element) {
  const project = getProjectElement(element)
  return project.parentNode.removeChild(project);
}

function addNewTodoButton(element) {
  const button = document.createElement('button');
  button.textContent = 'New Todo';
  button.addEventListener('click', createTodo);
  element.appendChild(button);
}

export {
  renderProjects,
  addProjectToDOM,
  deleteProjectFromDOM,
  addNewProjectButton,
};