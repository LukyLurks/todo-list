// Key for accessing the projects through localStorage
const storageKey = 'todoProjects';

function saveProjects(projects) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(projects));
  } catch(e) {
    console.log('Couldn\'t save projects.' + e);
    alert('Couldn\'t save projects.' + e);
  }
}

function loadProjects() {
  let savedProjects = localStorage.getItem(storageKey);
  if (savedProjects) {
    return JSON.parse(savedProjects);
  }
  console.log('Couldn\'t find saved projects.');
}

module.exports = {
  saveProjects,
  loadProjects,
};