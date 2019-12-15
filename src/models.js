function Project(title, todos) {
  return {
    title: title ? title : "Default",
    todos: todos ? todos : [],
  };
}

function Todo(title, description, deadline, priority) {
  return {
    title: title ? title : "Todo",
    description: description ? description : "Task description",
    deadline: deadline ? deadline : new Date(),
    priority: priority ? priority : _priorityLevels.normal,
  };
}

const _priorityLevels = { 
  low: {
    level: "Low",
    color: "green"
  },
  normal: {
    level: "Normal",
    color: "orange"
  },
  high: {
    level: "High",
    color: "red"
  },
};

module.exports = {
  Project,
  Todo,
};