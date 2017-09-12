'use strict';

const express=require('express');
const path=require('path');
const bodyParser=require('body-parser');
const dotenv = require('dotenv');
const socketio = require('socket.io');
const http = require('http');
const app=express();
const pathApi="/api/v1/";

//middleware
app.use(bodyParser.json());
app.use('/static',express.static(path.join(__dirname,'..','build')));
app.use('/medias',express.static(path.join(__dirname,'..','build','medias')));
app.use('/view',express.static(path.join(__dirname,'..','build','view')));
app.use('/vendors',express.static(path.join(__dirname,'..','build','vendors')));

//Import Controller
const loginController=require('./login/login.controller.js')();
const userController=require('./user/user.controller.js')();
const connectDB=require('./db.js')();
const auth=require('./auth.js');

const PORT=process.env.PORT;

//rounting
app.get('/',function(req,res,next){
    res.sendFile(path.join(__dirname,'..','build','index.html'));
});
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Authorization, Accept");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  next();
});
app.post(pathApi+'login', connectDB.connect,loginController.login,connectDB.disconnect);
app.post(pathApi+'updateStatus', auth.bearer(),connectDB.connect,loginController.updateStatus,connectDB.disconnect);
app.post(pathApi+'logout', auth.bearer(),connectDB.connect,loginController.logout,connectDB.disconnect);
app.get(pathApi+'user/:id', auth.bearer(),connectDB.connect,userController.searchID,connectDB.disconnect); //return utente
app.get(pathApi+'userList', auth.bearer(),connectDB.connect,userController.list,connectDB.disconnect); //return lista utenti
app.get(pathApi+'userConnected', auth.bearer(),connectDB.connect,userController.listConnected,connectDB.disconnect); //return lista utenti Connessi
app.post(pathApi+'userUpdate', auth.bearer(),connectDB.connect,userController.change,connectDB.disconnect);//update utente
app.post(pathApi+'user', auth.bearer(),connectDB.connect,userController.del,connectDB.disconnect);//delete utente

app.listen(PORT,function(){
  console.log("Server in ascolto su "+PORT);
});

//SOCKET IO

const serverSocket=http.createServer(myServer);

function myServer (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  //res.write('Hello World!');
  res.end();
}

const io= socketio.listen(serverSocket);

io.on('connection', function (socket) {
  
    socket.on('subscribe', function (data) 
    { 
      console.log(socket.id+" "+data.cognome+" "+data.nome+" "+"Aggiunto alla room:"+data.room);
      data.idSocketClient=socket.id;
      socket.join(data.room);
      socket.broadcast.to(data.room).emit('user-status',data);
    });

    socket.on('unsubscribe', function (data) 
    { 
      console.log(socket.id+" "+data.cognome+" "+data.nome+" "+"Uscito dalla room:"+data.room);
      data.idSocketClient=socket.id;
      socket.leave(data.room);
      socket.broadcast.to(data.room).emit('user-status',data);

    });

    socket.on('send-position', function (data) {
      console.log(JSON.stringify(data));
      data.idSocketClient=socket.id;
      io.sockets.in(data.room).emit('posizione', data); 
    });  
  
  });


serverSocket.listen(4200,function(){
  console.log("Server Socket in ascolto su 4200");
});

