import { enterTextEditMode } from '../editing';
import { formatTodos } from './todos';
import { formatTitle } from './common';

function renderProjects(projects) {
  document.body.appendChild(formatProjects(projects));
}

function formatProjects(projects) {
  const container = createProjectsContainer();
  container.addEventListener('click', enterTextEditMode);
  projects.forEach(project => {
    container.appendChild(formatSingleProject(project))
  });
  return container;
}

function createProjectsContainer() {
  const container = document.createElement('div');
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
}