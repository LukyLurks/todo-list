import { Project } from './models/project';
import { loadProjects, saveProjects } from './storage';
import { renderProjects, addNewProjectButton } from './rendering/projects';

function createDefaultProject() {
  return [Project()];
}

let projectsData = loadProjects();
if (!projectsData || projectsData.length <= 0) {
  projectsData = createDefaultProject();
  saveProjects(projectsData);
}
renderProjects(projectsData);
addNewProjectButton();

export {
  projectsData,
};
