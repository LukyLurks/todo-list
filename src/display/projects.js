import { enterTextEditMode } from '../editing/display';
import { formatTodos } from './todos';
import { formatTitle } from './common';
import { ids } from '../selectors';
import { setIndexes } from '../editing/data';
import { deleteProject } from '../editing/display';

function renderProjects(projects) {
  document.body.appendChild(formatProjects(projects));
}

function formatProjects(projects) {
  const container = createProjectsContainer();
  container.addEventListener('click', enterTextEditMode);
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
  addDeleteButton(output);
  return output;
}

function addDeleteButton(target) {
  const button = document.createElement('button');
  button.textContent = 'Delete this project';
  button.addEventListener('click', deleteProject);
  target.appendChild(button);
}

export {
  renderProjects,
};