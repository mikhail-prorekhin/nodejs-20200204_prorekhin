const url = require("url");
const http = require("http");
const path = require("path");
const fileSystem = require("fs");

const server = new http.Server();

const isNestedFile = path => path.split("/").length > 1;

server.on("request", (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, "files", pathname);

  switch (req.method) {
    case "GET":
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

      const stat = fileSystem.statSync(filepath);
      //console.log(JSON.stringify(stat));
      res.writeHead(200, {
        "Content-Length": stat.size
      });

      const readStream = fileSystem.createReadStream(filepath);

      readStream.pipe(res);

      break;

    default:
      res.statusCode = 501;
      res.end("Not implemented");
  }
});

module.exports = server;
