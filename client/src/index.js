// index.js
import { TerminalUI } from "./TerminalUI";
import io from "socket.io-client";

// IMPORTANT: Make sure you replace this address with your server address.

const serverAddress = "http://localhost:8080";

function connectToSocket(serverAddress) {
  return new Promise((res) => {
    console.log(serverAddress);
    const socket = io(serverAddress, {
      transports: ['websocket'],
    });
    console.log("Socket has been connected");
    res(socket);
  });
}

function startTerminal(container, socket) {
  // Create an xterm.js instance (TerminalUI class is a wrapper with some utils. Check that file for info.)
  const terminal = new TerminalUI(socket);
  console.log("Attaching xTerm terminal to DOM");
  terminal.attachTo(container);
  console.log("terminal has starting listening");
  terminal.startListening();
}

function start() {
  const container = document.getElementById("terminal-container");
  console.log(container);
  // Connect to socket and when it is available, start terminal.
  connectToSocket(serverAddress).then((socket) => {
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
