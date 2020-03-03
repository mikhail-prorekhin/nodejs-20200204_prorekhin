const url = require("url");
const http = require("http");
const path = require("path");
const { createWriteStream } = require("fs");
const fileSystem = require("fs");
const LimitSizeStream = require("./LimitSizeStream");

const isNestedFile = path => path.split("/").length > 1;

const server = new http.Server();

server.on("request", (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, "files", pathname);

  switch (req.method) {
    case "POST":
      if (isNestedFile(pathname)) {
        res.statusCode = 400;
        res.end(`the path ${pathname} is nested`);
        break;
      }
      if (fileSystem.existsSync(filepath)) {
        res.statusCode = 409;
        res.end(`file ${pathname} is already exist`);
        break;
      }
      const writeStream = createWriteStream(filepath);

      req
        .pipe(new LimitSizeStream({ limit: 1000000 }))
        .on("error", err => {
          fileSystem.unlinkSync(filepath);
          res.statusCode = 413;
          res.end("limit");
        })
        .pipe(writeStream);

      req.on("aborted", function() {
        res.statusCode = 500;
        fileSystem.unlinkSync(filepath);
        res.end("Abort");
      });

      req.once("end", () => {
        res.statusCode = 201;
        res.end("ok");
      });
      break;
    default:
      res.statusCode = 501;
      res.end("Not implemented");
  }
});

module.exports = server;
