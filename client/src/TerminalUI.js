import { Terminal } from "xterm";
import "xterm/css/xterm.css";


export class TerminalUI {
    constructor(socket) {
      this.terminal = new Terminal();
      this.terminal.setOption("theme", {
        background: "#000000",
        foreground: "#F5F8FA",
      });
      this.socket = socket;
    }
    startListening() {
      let currLine = "";
      this.terminal.onData((data) => {
        //to move cursor to newline when pressed enter
        if (data.charCodeAt(0) == 13) {
          data = "\r\n$ ";
          this.sendInput(currLine);
          currLine = "";
        }
        else if(data.charCodeAt(0)==27){
          data = "";
        }
        //to handle backspace
        else if (data.charCodeAt(0) == 127) {
          if (currLine.length) {
            data = "\b \b";
            currLine = currLine.substring(0, currLine.length - 1);
          }
          else{
              data = "";
          }
        } else {
          currLine += data;
        }
        console.log(currLine);
        this.write(data);
        
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
      console.log('sending intput : ',input);
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