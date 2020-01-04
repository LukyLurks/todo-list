import { enterTextEditMode } from '../editing/display';
import { formatTodos } from './todos';
import { formatTitle } from './common';
import { ids } from '../selectors';
import { setIndexes } from '../editing/data';

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
  return output;
}

export {
  renderProjects,
};