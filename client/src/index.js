// index.js
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

function start() {
  const container = document.getElementById("terminal-container");
  console.log(container);
  // Connect to socket and when it is available, start terminal.
  connectToSocket(serverAddress).then((socket) => {
    // const uploadForm = document.querySelector('.upload')
    // uploadForm.addEventListener('submit', function(e) {
    //   e.preventDefault()
    //   console.log('File Uploaded')
    //   let file = e.target.uploadFile.files[0]
    //   console.log(file);
    // })
    console.log('Socket Connected to backend')
    let currentLineInput = '';
    socket.on('output',output=>{
      let lastLine = document.querySelector('p:last-child');
      // output = JSON.stringify(output);
      console.log(output);
      const regex = /\r\n/g;
      output = output.replace(regex,'</br>')
      lastLine.innerHTML = output
      const para = document.createElement("p");
      para.innerHTML = ""
      terminal.append(para);
      terminal.scrollTop = terminal.scrollHeight;
    })



    let terminal = document.querySelector('#terminal');
    let textArea = document.querySelector('textarea');
    
    textArea.focus();
    terminal.addEventListener("click",function(){
        textArea.focus()
    })
    let commandIndex = 0;
    textArea.addEventListener('keydown',function(evt){
        console.log(evt)
        let paraList = document.querySelectorAll("p");
        let lastLine = document.querySelector('p:last-child');
        
        if(evt.key =='Enter'){
            if(currentLineInput=="--upload"){
                document.querySelector('#imgupload').click();
            }
            else{
              const para = document.createElement("p");
              para.innerHTML = ""
              terminal.append(para);
              terminal.scrollTop = terminal.scrollHeight;
              socket.emit('input',currentLineInput);
              currentLineInput = '';
              commandIndex = paraList.length;
            }
            
        }
        else if (evt.key=="Backspace"){
            currentLineInput = currentLineInput.substring(0,currentLineInput.length-1);
            lastLine.innerHTML = currentLineInput;
        }
        else if (evt.key =="ArrowUp" || evt.key=="ArrowDown"){
            if(commandIndex &&evt.key =="ArrowUp" ){
                commandIndex--;
                lastLine.innerHTML = paraList[commandIndex].innerHTML
                currentLineInput=paraList[commandIndex].innerHTML
                
            }
            else if(commandIndex < paraList.length-2 && evt.key =="ArrowDown"){
                commandIndex++;
                lastLine.innerHTML = paraList[commandIndex].innerHTML
                currentLineInput=paraList[commandIndex].innerHTML
                
            }
        }
        else if(evt.key.length==1){
            currentLineInput += evt.key;
            lastLine.innerHTML = currentLineInput;
        }
        
    })
  });
}

// Better to start on DOMContentLoaded. So, we know terminal-container is loaded
start();


