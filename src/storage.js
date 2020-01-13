// Key for accessing the projects through localStorage
const storageKey = 'TOPtodoProjects';

function saveProjects(projects) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(projects));
  } catch(e) {
    console.warn('Couldn\'t save projects.' + e);
    alert('Couldn\'t save projects.' + e);
  }
}

function loadProjects() {
  let savedProjects = localStorage.getItem(storageKey);
  if (savedProjects) {
    return JSON.parse(savedProjects);
  }
  console.warn('Couldn\'t find saved projects.');
}

export {
  saveProjects,
  loadProjects,
}