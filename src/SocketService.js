// SocketService.js

// Manage Socket.IO server
const socketIO = require("socket.io");
const { spawn, ChildProcess } = require("child_process");
const { Readable} =  require('stream');
// const fetchOutput = (input) => {
//   child.stdout.on("data", (data) => {
//     let buff = data;
//     let output = buff.toString();
//     return output;
//   });
// };
const insertInput = (input, child) => {
  input = input+"\n";
  child.stdin.write(input);
 
  // child.stdout.on("data", (data) => {
  //   let buff = data;
  //   let output = buff.toString();
  //   console.log("insertInput - ", output);
  //   return output;
  // });
};

class SocketService {
  constructor() {
    this.socket = null;
    this.pty = null;
    this.currentLine = "";
  }

  attachServer(server) {
    if (!server) {
      throw new Error("Server not found...");
    }

    const io = socketIO(server);
    console.log("Created socket server. Waiting for client connection.");
    // "connection" event happens when any client connects to this io instance.
    io.on("connection", (socket) => {
      console.log("Client connect to socket.", socket.id);
      let childName = process.platform =="win32" ? "main.exe" : "./a.out";
      const child = spawn(childName);
      child.on("error", (errMsg) => {
        console.log("Error Occured while spawning the exe file  : ", errMsg);
      });
      this.socket = socket;
      child.on('close',()=>{
        console.log('XML Parser Closed')
        this.socket.emit("output","socket_disconnected");
        this.socket.disconnect();
      })
      // Just logging when socket disconnects.
      this.socket.on("disconnect", () => {
        console.log("Disconnected Socket: ", socket.id);
      });
      child.stdout.on("data", (data) => {
        debugger
        let buff = data;
        let output = buff.toString();
        console.log(output);
        this.socket.emit("output",output);
      });
      
      // Attach any event listeners which runs if any event is triggered from socket.io client
      // For now, we are only adding "input" event, where client sends the strings you type on terminal UI.
      this.socket.on("input", (input) => {
        //Runs this event function socket receives "input" events from socket.io client
        console.log("Enter");
        debugger
        insertInput(input, child);
        this.currentLine = "";
        console.log(input);
      });
    });
  }
}

module.exports = SocketService;
