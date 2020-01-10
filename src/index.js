import { Project } from './models/project';
import { Todo } from './models/todo';
import { loadProjects, saveProjects } from './storage';
import { renderProjects } from './rendering/projects';

function initProjects() {
  return loadProjects() || [Project()];
}

// Testing storage functions
let projectsData = initProjects();
projectsData.push(Project('test',[Todo()]));
saveProjects(projectsData);
projectsData = loadProjects();
renderProjects(projectsData);
// cleaning up after tests
localStorage.removeItem('todoProjects');

export {
  projectsData,
};
