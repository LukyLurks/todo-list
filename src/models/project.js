function Project(title, todos) {
  return {
    title: title ? title : "Default",
    todos: todos ? todos : [],
  };
}

export {
  Project,
}