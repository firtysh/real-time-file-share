//Obsolete code
// const socket = io();
// socket.on('connect', () => {
//     console.log('Connected to server');
// });

// const button = document.querySelector('#join-button');
// const join_container = document.querySelector('#join-container');
// const room = document.querySelector('#room');
// const output = document.querySelector('#output')
// const filelist = document.querySelector('#file-list');

// button.addEventListener('click', () => {
//     console.log(room.value);
//     socket.emit('reciever-join', room.value);
// });

// socket.on('error',(err)=>{
//     alert(err.message)
// })

// socket.on('join-sucess',(data)=>{
//     console.log(data.message +" "+ data.id);
//     join_container.innerHTML = `You have joined ${data.id}`
// })

// socket.on('metadata',(data)=>{
//     console.log(data);
//     filelist.innerHTML = `<li><ul><li> Name : ${data.name}</li><li> Size : ${data.size} bytes</li><li> Type : ${data.type}</li></ul></li>`
// })

// socket.on('file',(file)=>{
//     let blob = new Blob([new Uint8Array(file.data)])
//     let anc= document.createElement('a');
//     anc.href =window.URL.createObjectURL(blob);
//     // window.location = window.URL.createObjectURL(blob);
//     anc.download= `${file.name}`
//     anc.target = '_blank'
//     anc.click()
//     window.URL.revokeObjectURL(anc.href);
// })
//New code to receive
(function () {
  let senderID;
  const socket = io();
  function generateID() {
    return `${Math.trunc(Math.random() * 999)}-${Math.trunc(
      Math.random() * 999
    )}-${Math.trunc(Math.random() * 999)}`;
  }
  document.querySelector("#join-button").addEventListener("click", function () {
    senderID = document.querySelector("#room").value;
    if (senderID.length == 0) {
      return;
    }
    let joinID = generateID();
    socket.emit("receiver-join", {
      uid: joinID,
      sender_uid: senderID,
    });
    
  });
  let fileShare = {};
  socket.on("fs-meta", function (metadata) {
    fileShare.metadata = metadata;
    fileShare.transmitted = 0;
    fileShare.buffer = [];
    socket.emit("fs-start", {
      uid: senderID
    });
  });
  socket.on("fs-share", function (buffer) {
    console.log("Buffer",buffer);
    fileShare.buffer.push(buffer);
    fileShare.transmitted += buffer.byteLength;
    if (fileShare.transmitted == fileShare.metadata.total_buffer_size) {
        console.log("Download file: ", fileShare);
      download(new Blob(fileShare.buffer), fileShare.metadata.filename);
      fileShare = {};
    } else {
      socket.emit("fs-start", {
        uid: senderID
      });
    }
  });
  
})();
