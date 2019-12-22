import { formatISO } from 'date-fns';
import { formatTitle } from './common';

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
        break;
      case 'priority':
        setPriorityColor(todo[key], output)
        break;
      default:
        console.warn(`Unexpected key ${key} while formatting todo: skipping`);
        break;
    }
  }
  return output;
}

function formatDescription(description) {
  return formatTitle(description);
}

function formatDate(date) {
  const element = document.createElement('p');
  element.textContent = formatISO(new Date(date), { representation: 'date'});
  return element;
}

function setPriorityColor(priority, target) {
  target.style.outline = `1px solid ${priority.color}`;
}

export {
  formatTodos,
}