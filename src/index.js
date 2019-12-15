import { Project, Todo } from './models';
import { loadProjects, saveProjects } from './storage';
import { renderProjects } from './display'

function initProjects() {
  return loadProjects() || [Project()];
}

// Testing storage functions
let testProjects = initProjects();
console.table(testProjects);
testProjects.push(Project('test',[Todo()]));
saveProjects(testProjects);
testProjects = loadProjects();
console.table(testProjects);
renderProjects(testProjects);
// cleaning up after tests
localStorage.removeItem('todoProjects');
