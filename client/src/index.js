// index.js

import io from "socket.io-client";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

class TerminalUI {
  constructor(socket) {
    this.terminal = new Terminal();
    this.terminal.setOption("theme", {
      background: "#202B33",
      foreground: "#F5F8FA"
    });
    this.socket = socket;
  }
  startListening() {
    this.terminal.onData((data) => {
      console.log(data);
      //to move cursor to newline when pressed enter
      if(data.charCodeAt(0)==13){
        data = '\r\n$ ';
      }
      this.write(data);
      this.sendInput(data);
    });
    this.socket.on("output", (data) => {
      this.write(data);
    });
  }

  write(text) {
    this.terminal.write(text);
  }
  prompt() {
    this.terminal.write(`\r\n$ `);
  }
  sendInput(input) {
    this.socket.emit("input", input);
  }
  attachTo(container) {
    this.terminal.open(container);
    // Default text to display on terminal.
    this.terminal.write("Terminal Connected");
    this.terminal.write("");
    this.prompt();
  }
  clear() {
    this.terminal.clear();
  }
}


// IMPORTANT: Make sure you replace this address with your server address.

const serverAddress = "http://localhost:8080";

function connectToSocket(serverAddress) {
  return new Promise(res => {
    const socket = io(serverAddress);
    res(socket);
  });
}

function startTerminal(container, socket) {
  // Create an xterm.js instance (TerminalUI class is a wrapper with some utils. Check that file for info.)
  const terminal = new TerminalUI(socket);
  console.log('Attaching xTerm terminal to DOM')
  terminal.attachTo(container);
  console.log('terminal has starting listening');
  terminal.startListening();
}

function start() {
  const container = document.getElementById("terminal-container");
  console.log(container)
  // Connect to socket and when it is available, start terminal.
  connectToSocket(serverAddress).then(socket => {
    startTerminal(container, socket);
  });
}

// Better to start on DOMContentLoaded. So, we know terminal-container is loaded
start();


// const uploadForm = document.querySelector('.upload')
// uploadForm.addEventListener('submit', function(e) {
//    e.preventDefault()
//    console.log('File Uploaded')
//    let file = e.target.uploadFile.files[0]
//    console.log(file);
// })