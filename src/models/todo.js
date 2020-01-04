function Todo(title, description, deadline, priority) {
  return {
    title: title ? title : "Todo",
    description: description ? description : "Task description",
    deadline: deadline ? deadline : new Date(),
    priority: priority ? priority : priorityLevels.normal,
  };
}

const priorityLevels = { 
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

export {
  Todo,
  priorityLevels,
};