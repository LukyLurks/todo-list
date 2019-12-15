import { formatISO } from 'date-fns';

function renderProjects(projects) {
  document.body.appendChild(formatProjects(projects));
}

function formatProjects(projects) {
  const container = makeProjectsContainer();
  projects.forEach(project => {
    container.appendChild(formatSingleProject(project))
  });
  return container;
}

function makeProjectsContainer() {
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
        console.log(`Unexpected key ${key} while formatting project: skipping`);
        break;
    }
  }
  return output;
}

function formatTitle(title) {
  const element = document.createElement('p');
  element.textContent = title;
  return element;
}

function formatTodos(todos) {
  const element = document.createElement('ul');
  todos.forEach(item => {
    element.appendChild(formatSingleTodo(item));
  });
  return element;
}

function formatSingleTodo(todo) {
  const output = document.createElement('li');
  for (let key in todo) {
    switch (key) {
      case 'title':
        output.appendChild(formatTitle(todo[key]));
        break;
      case 'description':
        output.appendChild(formatDescription(todo[key]));
        break;
      case 'deadline':
        output.appendChild(formatDate(todo[key]));
        console.log(todo[key]);
        break;
      case 'priority':
        setPriorityColor(todo[key], output)
        break;
      default:
        console.log(`Unexpected key ${key} while formatting todo: skipping`);
        break;
    }
  }
  return output;
}

function formatDescription(desc) {
  return formatTitle(desc);
}

function formatDate(date) {
  const element = document.createElement('p');
  element.textContent = formatISO(new Date(date), { representation: 'date'});
  return element;
}

function setPriorityColor(priority, target) {
  target.style.outline = `1px solid ${priority.color}`;
}

// importing format from date-fns breaks module.exports
export {
  renderProjects,
}