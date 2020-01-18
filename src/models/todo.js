function Todo(title, description, deadline, priority) {
  return {
    title: title ? title : "Buy groceries (click to edit)",
    description: description ? description : "We're out of broccoli (click to edit)",
    deadline: deadline ? deadline : new Date(),
    priority: priority ? priority : priorityLevels.normal,
    completed: false,
  };
}

const priorityLevels = { 
  low: {
    level: " Low priority",
    color: "hsl(122, 64%, 56%)"
  },
  normal: {
    level: " Normal priority",
    color: "hsl(204, 91%, 56%)"
  },
  high: {
    level: " High priority",
    color: "hsl(35, 100%, 63%)"
  },
};

export {
  Todo,
  priorityLevels,
};