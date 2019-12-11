function Project(title, todos) {
  return {
    title: title ? title : "Default",
    todos: todos ? todos : [],
  };
}

function Todo(title, description, deadline, priority) {
  return {
    title: title ? title : "Todo",
    description: description ? description : "",
    deadline: deadline ? deadline : new Date(),
    priority: priority ? priority : _priorityLevels.normal,
  };
}

const _priorityLevels = { 
  low: "Low",
  normal: "Normal",
  high: "High",
};

module.exports = {
  Project,
  Todo,
};