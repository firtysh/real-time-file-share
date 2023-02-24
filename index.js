const express = require('express');
const app = express();
const path = require('path');

const server = require('http').createServer(app);


app.use(express.static(path.join(__dirname, '/public')));

const io = require('socket.io')(server);
//Obsolete code
// io.on('connection', (socket) => {
//   console.log('id = ', socket.id);
//   socket.on('sender-join', (msg) => {
//     socket.join(msg)
//   });
//   socket.on('reciever-join',(msg)=>{
//     if(io.sockets.adapter.rooms.get(`${msg}`)){
//       socket.join(msg)
//       io.to(msg).emit('init',{message:'Receiver Connected',id:socket.id})
//       io.to(socket.id).emit('join-sucess',{message:'Room Joined',id:msg})
//     }else{
//       socket.emit('error',{'message':'Invalid Room Name'})
//     }
//   })
//   socket.on('metadata',(data)=>{
//     console.log(data);
//     io.to(socket.id).emit('metadata',data)
//   })
//   socket.on('file',(data)=>{
//     console.log(data);
//     io.to(socket.id).emit('file',data)
//   })
// })
io.on("connection",function(socket){
  socket.on("sender-join",function(data){
    socket.join(data.uid);
  });
  socket.on("receiver-join",function(data){
  socket.join(data.uid);
  socket.in(data.sender_uid).emit("init",data.uid);
  });
  socket.on("file-meta",function(data){
socket.in(data.uid).emit("fs-meta",data.metadata);
  });
  socket.on("fs-start",function(data){
socket.in(data.uid).emit("fs-share",{})
  });
  socket.on("file-raw",function(data){
    socket.in(data.uid).emit("fs-share",data.buffer);
      });
})
app.get("/",(req,res)=>{
  res.sendFile(__dirname+'/public/home.html');
})

app.get('/send', (req, res) => {
  res.sendFile(__dirname + '/public/sender.html');
})
app.get('/receive', (req, res) => {
  res.sendFile(__dirname + '/public/receiver.html');
})

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
})
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
})

server.listen(process.env.PORT || 4000, () => {
  console.log("listening on port 4000");
})