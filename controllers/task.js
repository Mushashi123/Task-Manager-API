const url = require("url");
const task = require("../db/task");

const getAllTask = (req, res) => {
  // res.write("This endpoint is for getting all the task");
  res.writeHead(200, {
    "content-type": "application/json",
  });
  res.write(JSON.stringify(task));
  res.end();
};

const insertTask = (req, res) => {
  // res.write("This endpoint is for inserting new task");
  //parsing the payload or body frm request
  let response;
  let data = "";
  req.on("data", (chunk) => {
    // console.log(chunk);
    data += chunk;
  });
  //when the reading of data ends in request stream
  req.on("end", () => {
    let jsonData = JSON.parse(data);
    const id = getId(task);
    jsonData.id = id;
    // attach id and push it to our mock Data base
    task.push(jsonData);
  });

  //as a response send a json object with status and new list of task
  response = {
    success: true,
    tasks: task,
  };
  res.writeHead(200, {
    "content-type": "application/json",
  });
  res.write(JSON.stringify(response));
  res.end();
};

const updateTask = (req, res) => {
  //parsing the query string as an object and accesing the id
  const { id } = url.parse(req.url, true).query;
  //finding index of that object with id given to update it s
  const index = getIndex(id);
  //updates the element while parsing the body
  updateElement(req, index);
  //response to the client
  res.writeHead(200, {
    "content-type": "application/json",
  });
  let response = {
    success: true,
    updated: task[index],
  };
  res.write(JSON.stringify(response));
  res.end();
};

const deleteTask = (req, res) => {
  // res.write("This endpoint is for deleting existing task");
  const { id } = url.parse(req.url, true).query;
  const index = getIndex(id);

  //removes the task without leaving holes
  task.splice(index, 1);

  res.writeHead(200, {
    "content-type": "application/json",
  });
  let response = {
    success: true,
    deleted: task,
  };
  res.write(JSON.stringify(response));
  res.end();
};

const notAvailable = (req, res) => {
  res.statusCode = 404;
  res.write("Route does not exist");
  res.end();
};

// additional functions

//creates an id for a task to identify it uniquely
function getId(array) {
  return array[array.length - 1].id + 1;
}

//this will give the index of the array with unique id
function getIndex(id) {
  return task.findIndex((element) => parseInt(id) === element.id);
}

//this function will updata the array element
function updateElement(req, index) {
  body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });
  req.on("end", () => {
    task[index].name = JSON.parse(body).name;
  });
}

module.exports = {
  getAllTask,
  insertTask,
  updateTask,
  deleteTask,
  notAvailable,
};
