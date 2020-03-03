const url = require("url");
const http = require("http");
const path = require("path");
const fileSystem = require("fs");

const isNestedFile = path => path.split("/").length > 1;
const server = new http.Server();

server.on("request", (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, "files", pathname);

  switch (req.method) {
    case "DELETE":
      if (isNestedFile(pathname)) {
        res.statusCode = 400;
        res.end(`the path ${pathname} is nested`);
        break;
      }
      if (!fileSystem.existsSync(filepath)) {
        res.statusCode = 404;
        res.end(`the file ${pathname} does not exists`);
        break;
      }
      fileSystem.unlinkSync(filepath);
      res.statusCode = 200;
      res.end("0k");
      break;

    default:
      res.statusCode = 501;
      res.end("Not implemented");
  }
});

module.exports = server;
