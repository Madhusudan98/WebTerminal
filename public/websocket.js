import { io } from "https://cdn.socket.io/4.4.1/socket.io.esm.min.js";
console.log("js connected");

let socket = undefined;

export default class UIWebSocket {
  constructor() {
    this.socket = undefined;
    this.connect;
    this.disconnect;
    this.send;
  }
  connect() {
    return new Promise((resolve, reject) => {
      this.socket = io();
      this.socket.on("connect", (data) => {
        console.log("Connection has been established");
        resolve(this.socket);
        // this.socket.on("output", (data) => {
        //   debugger;
        //   console.log(data);
        //   resolve(data);
        // });
      });
    });
  }
  disconnect() {
    if (this.socket) {
      console.log("disconnecting from UI");
      this.socket.disconnect();
      this.socket = undefined;
    } else {
      console.log("socket not connected");
    }
  }
  send(input) {
    if (this.socket) {
      this.socket.emit("input", input);
    } else {
      console.log("socket not connected");
    }
  }
}
