import { formatISO } from 'date-fns';
import { formatTitle } from './common';
import { classes } from '../selectors';
import { deleteTodo, toggleCompletion } from '../editing/display';
import { getTodoElement, getProjectElement, update } from '../editing/data';
import { Todo, priorityLevels } from '../models/todo';

function formatTodos(todos) {
  const todoList = createTodoList();
  todos.forEach(item => {
    todoList.appendChild(formatSingleTodo(item));
  });
  return todoList;
}

function createTodoList() {
  let todoList = document.createElement('ul');
  todoList.classList.add(classes.todoList);
  return todoList;
}

function formatSingleTodo(todo) {
  const output = createTodoItem();
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
        output.appendChild(formatPriority(todo[key]));
        setPriorityColor(todo[key], output);
        break;
      case 'completed':
        output.appendChild(formatCompletion(todo[key], output));
        break;
      default:
        console.warn(`Unexpected key ${key} while formatting todo: skipping`);
        break;
    }
  }
  addDeleteButton(output);
  return output;
}

function createTodoItem() {
  const todo = document.createElement('li');
  todo.classList.add(classes.todo);
  return todo;
}

function formatDescription(description) {
  const element = formatTitle(description);
  element.classList.remove(classes.title);
  element.classList.add(classes.description);
  return element;
}

function formatDate(date) {
  const element = document.createElement('p');
  element.classList.add(classes.editable, classes.deadline);
  element.textContent = formatISO(new Date(date), { representation: 'date'});
  return element;
}

function formatPriority(priority) {
  const element = document.createElement('select');
  element.classList.add(classes.prioritySelect);
  element.addEventListener('change', updatePriority);
  for (const key in priorityLevels) {
    const option = makeOptionElement(priority, key);
    element.appendChild(option);
  }
  return element;
}

function makeOptionElement(priority, key) {
  const option = document.createElement('option');
  option.value = key;
  option.textContent = priorityLevels[key].level;
  option.classList.add(classes.priority);
  if (priorityLevels[key].level === priority.level) {
    option.setAttribute('selected', '');
  }
  return option;
}

function updatePriority(event) {
  const todo = getTodoElement(event.target);
  setPriorityColor(priorityLevels[event.target.value], todo);
  update(todo);
}

function setPriorityColor(priority, element) {
  element.style.borderLeft = `2px solid ${priority.color}`;
}

function formatCompletion(completed, output) {
  const checkbox = document.createElement('input');
  checkbox.classList.add(classes.completedFlag);
  checkbox.setAttribute('type', 'checkbox');
  if (completed === true) {
    checkbox.setAttribute('checked', '');
    output.classList.add(classes.done);
  }
  checkbox.addEventListener('change', toggleCompletion);
  return checkbox;
}

function addDeleteButton(element) {
  const button = document.createElement('button');
  button.textContent = '❌ Delete';
  button.classList.add(classes.deleteTodoButton);
  button.addEventListener('click', deleteTodo);
  element.appendChild(button);
}

function deleteTodoFromDOM(element) {
  const todo = getTodoElement(element);
  return todo.parentNode.removeChild(todo);
}

function addTodoToDOM(target) {
  const project = getProjectElement(target);
  const newTodo = formatSingleTodo(Todo());
  const todoList = project.querySelector(`.${classes.todoList}`);
  return todoList.appendChild(newTodo);
}

/**
 * Adds a done class when a todo is checked, removes it when it's unchecked
 * the done class will add strikethrough to the text to show if it's done 
 */
function showIfDone(target) {
  const todo = getTodoElement(target);
  if (isDone(todo)) {
    todo.classList.remove(classes.done);
  } else {
    todo.classList.add(classes.done);
  }
  return todo;
}

function isDone(todo) {
  return todo.classList.contains(classes.done);
}

export {
  formatTodos,
  formatDate,
  formatDescription,
  addTodoToDOM,
  deleteTodoFromDOM,
  showIfDone,
}