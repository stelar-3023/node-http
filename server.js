const http = require("http");

const hostname = "localhost";
const port = 3000;

const path = require("path");
const fs = require("fs");

const server = http.createServer((req, res) => {
  console.log(`Request for ${req.url} by method ${req.method}`);

  if (req.method === "GET") {
    let fileUrl = req.url;
    if (fileUrl === "/") {
      fileUrl = "/index.html";
    }
    // absolute path
    const filePath = path.resolve("./public" + fileUrl);
    // only grant requests for html files
    const fileExt = path.extname(filePath);

    if (fileExt === ".html") {
      // check if the file exists on the server
      fs.access(filePath, (err) => {
        if (err) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/html");
          res.end(
            `<html><body><h1>Error 404: ${fileUrl} not found</h1></body></html>`
          );
          // add return so the code following isn't executed
          return;
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        // send the html document
        fs.createReadStream(filePath).pipe(res); // read a chunk at a time
      });
    } else {
      res.statusCode = 404;
      res.setHeader("Content-Type", "text/html");
      res.end(
        `<html><body><h1>Error 404: ${fileUrl} is not an HTML file</h1></body></html>`
      );
    }
  } else {
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");
    res.end(
      `<html><body><h1>Error 404: ${req.method} not supported</h1></body></html>`
    );
  }
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
