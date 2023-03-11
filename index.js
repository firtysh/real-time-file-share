const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const connectToMongo = require('./db');


connectToMongo();

app.use(express.static(path.join(__dirname, 'public')));

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('id = ', socket.id);
  socket.on('sender-join', (msg) => {
    socket.join(msg)
  });
  socket.on('reciever-join',(msg)=>{
    if(io.sockets.adapter.rooms.get(`${msg}`)){
      socket.join(msg)
      io.to(msg).emit('init',{message:'Receiver Connected',id:socket.id})
      io.to(socket.id).emit('join-sucess',{message:'Room Joined',id:msg})
    }else{
      socket.emit('error',{'message':'Invalid Room Name'})
    }
  })
  socket.on('metadata',(data)=>{
    console.log(data);
    io.to(socket.id).emit('metadata',data)
  })
  socket.on('file',(data)=>{
    console.log(data);
    io.to(socket.id).emit('file',data)
  })
})

//Setting up EJS Template Engine
app.set('view engine', 'ejs');

app.get("/",(req,res)=>{
  res.render(__dirname+'/public/home');
})
app.get("/about",(req,res)=>{
  res.render(__dirname+'/public/About');
})
app.get("/testimonial",(req,res)=>{
  res.render(__dirname+'/public/testimonial');
})

app.get('/send', (req, res) => {
  res.render(__dirname + '/public/sender');
})
app.get('/contact', (req, res) => {
  res.render(__dirname + '/public/contact');
})
app.get('/receive', (req, res) => {
  res.render(__dirname + '/public/receiver');
})

app.get('/signup', (req, res) => {
  res.render(__dirname + '/public/signup');
})
app.get('/login', (req, res) => {
  res.render(__dirname + '/public/login');
})

server.listen(process.env.PORT || 3000, () => {
  console.log("listening on port 3000");
})