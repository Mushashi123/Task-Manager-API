const http = require("http");
const fs = require("fs");
const hostname = "127.0.0.1";
const port = process.env.PORT || 3000;

//inporting the handler functions
const {
  getAllTask,
  insertTask,
  updateTask,
  deleteTask,
  notAvailable,
} = require("./controllers/task");

// our server
const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  //   routing is done here for different endpoints
  //serving our index.html
  if (url === "/" && method === "GET") {
    const stream = fs.createReadStream("./public/index.html", {
      encoding: "utf-8",
    });
    stream.pipe(res);
  } else if (url === "/api/v1/task" && method === "GET") {
    getAllTask(req, res);
  } else if (url === "/api/v1/task" && method === "POST") {
    insertTask(req, res);
    // this regex helps to allow query paramters in the endpoint
  } else if (url.search(/\/api\/v1\/task\?id=/) === 0 && method === "PATCH") {
    updateTask(req, res);
  } else if (url.search(/\/api\/v1\/task\?id=/) === 0 && method === "DELETE") {
    deleteTask(req, res);
  } else {
    notAvailable(req, res);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server listening at http://${hostname}:${port}`);
});
