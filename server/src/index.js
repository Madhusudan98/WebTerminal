// index.js

const http = require("http");
const SocketService = require("./SocketService");
const path = require('path');
/* 
  Create Server from http module.
  If you use other packages like express, use something like,
  const app = require("express")();
  const server = require("http").Server(app);

*/
const express = require("express");
const app = express();
const server = require("http").Server(app);
// const server = http.createServer((req, res) => {
//   res.write("Terminal Server Running.");
//   res.end();
// });
console.log(path.join(__dirname,'/../public'));
app.use(express.static(path.join(__dirname,'/../public')));
// app.use(express.static(path.join(__dirname,'')))
// app.get('/',(req,res)=>{
//   res.sendFile(path.join(__dirname,));
// })
const port = 8080;

server.listen(port, function () {
  console.log("Server listening on : ", port);
  const socketService = new SocketService();
  socketService.attachServer(server);
});
