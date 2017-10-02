'use strict';

const express=require('express');
const fs = require('fs');
const path=require('path');
const bodyParser=require('body-parser');
const dotenv = require('dotenv');
const socketio = require('socket.io');
const http = require('http');
const https = require('https');
const cors = require('cors');
const app=express();
const pathApi="/api/v1/";

//MIDDLEWARE
app.use(bodyParser.json());
app.use(cors());
app.use('/static',express.static(path.join(__dirname,'..','build')));
app.use('/medias',express.static(path.join(__dirname,'..','build','medias')));
app.use('/view',express.static(path.join(__dirname,'..','build','view')));
app.use('/vendors',express.static(path.join(__dirname,'..','build','vendors')));

//IMPORT CONTROLLER
const loginController=require('./login/login.controller.js')();
const userController=require('./user/user.controller.js')();
const ruoloController=require('./ruolo/ruolo.controller.js')();

const connectDB=require('./db.js')();
const auth=require('./auth.js');

const PORT=process.env.PORT;
const PORT_SOCKET=process.env.PORT_SOCKET;

//CERTIFICATI
const certificato = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem' )
};

//ROUTING
app.get('/',function(req,res,next){
    res.sendFile(path.join(__dirname,'..','build','index.html'));
});

//LOGIN
app.post(pathApi+'login', connectDB.connect,loginController.login,connectDB.disconnect);
app.post(pathApi+'logout', auth.bearer(),connectDB.connect,loginController.logout,connectDB.disconnect);

//USER
app.post(pathApi+'user/add', auth.bearer(),connectDB.connect,userController.add,connectDB.disconnect);//aggiunge utente
app.post(pathApi+'user/update', auth.bearer(),connectDB.connect,userController.change,connectDB.disconnect);//aggiorna utente
app.post(pathApi+'user/delete', auth.bearer(),connectDB.connect,userController.del,connectDB.disconnect);//cancella utente
app.get(pathApi+'user/search/:id', auth.bearer(),connectDB.connect,userController.searchID,connectDB.disconnect); //return utente senza password
app.post(pathApi+'user/profile', auth.bearer(),connectDB.connect,userController.UserProfile,connectDB.disconnect); //return il profilo personale
app.get(pathApi+'user/list', auth.bearer(),connectDB.connect,userController.list,connectDB.disconnect); //return lista utenti limitata
app.post(pathApi+'user/listFull', auth.bearer(),connectDB.connect,userController.listFull,connectDB.disconnect); //return lista utenti completa solo x ruolo admin
app.get(pathApi+'user/connected', auth.bearer(),connectDB.connect,userController.listConnected,connectDB.disconnect); //return lista utenti Connessi
app.post(pathApi+'user/update/pwd', auth.bearer(),connectDB.connect,userController.changePwd,connectDB.disconnect); //aggiorna la passowrd dell utente selezionato
app.post(pathApi+'user/update/profile/pwd', auth.bearer(),connectDB.connect,userController.changeProfilePwd,connectDB.disconnect); //aggiorna la passowrd dell utente loggato

//RUOLO
app.get(pathApi+'ruolo/list', auth.bearer(),connectDB.connect,ruoloController.lista,connectDB.disconnect); //return lista ruoli
app.get(pathApi+'ruolo/search/:id', auth.bearer(),connectDB.connect,ruoloController.searchID,connectDB.disconnect); //return ruolo selezionato
app.post(pathApi+'ruolo/add', auth.bearer(),connectDB.connect,ruoloController.add,connectDB.disconnect); //inserisci ruolo
app.post(pathApi+'ruolo/update', auth.bearer(),connectDB.connect,ruoloController.change,connectDB.disconnect); //aggiorna ruolo
app.post(pathApi+'ruolo/delete', auth.bearer(),connectDB.connect,ruoloController.del,connectDB.disconnect); //elimina ruolo

//SERVER API

https.createServer(certificato,app)
  .listen(PORT,function(){
     console.log("Server HTTPS in ascolto su "+PORT);
});

//SERVER SOCKET IO
const serverSocket=https.createServer(certificato,myServer);

function myServer (req, res) {
  res.header("Access-Control-Allow-Origin", "*");
  res.writeHead(200, {'Content-Type': 'json/plain'});
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

//SERVER SOCKET IO
serverSocket.listen(PORT_SOCKET,function(){
  console.log("Server Socket in ascolto su "+PORT_SOCKET);
});