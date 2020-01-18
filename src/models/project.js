function Project(title, todos) {
  return {
    title: title ? title : "My Todo List (click to edit)",
    todos: todos ? todos : [],
  };
}

export {
  Project,
}