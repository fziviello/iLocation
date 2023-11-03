'use strict';

const express=require('express');
const fs = require('fs');
const path=require('path');
const fileUpload = require('express-fileupload');
const bodyParser=require('body-parser');
const {Server} = require("socket.io");
const https = require('https');
const cors = require('cors');
const pathApi="/api/v1/";
const app=express();

//MIDDLEWARE
app.use(bodyParser.json());
app.use(cors());
app.options('*', cors());
app.use(fileUpload());
app.use('/static',express.static(path.join(__dirname,'..','build')));
app.use('/medias',express.static(path.join(__dirname,'..','build','medias')));
app.use('/uploads',express.static(path.join(__dirname,'..','build','uploads')));
app.use('/view',express.static(path.join(__dirname,'..','build','view')));
app.use('/vendors',express.static(path.join(__dirname,'..','build','vendors')));
app.disable('x-powered-by');

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
app.post(pathApi+'user/update/profile/photo',auth.bearer(),userController.photo);//aggiorna immagine del profilo dell utente loggato

//RUOLO
app.get(pathApi+'ruolo/list', auth.bearer(),connectDB.connect,ruoloController.lista,connectDB.disconnect); //return lista ruoli
app.get(pathApi+'ruolo/search/:id', auth.bearer(),connectDB.connect,ruoloController.searchID,connectDB.disconnect); //return ruolo selezionato
app.post(pathApi+'ruolo/add', auth.bearer(),connectDB.connect,ruoloController.add,connectDB.disconnect); //inserisci ruolo
app.post(pathApi+'ruolo/update', auth.bearer(),connectDB.connect,ruoloController.change,connectDB.disconnect); //aggiorna ruolo
app.post(pathApi+'ruolo/delete', auth.bearer(),connectDB.connect,ruoloController.del,connectDB.disconnect); //elimina ruolo

//SERVER API

https.createServer(certificato,app)
  .listen(PORT,function(){
     console.log("Server HTTPS listen on port: " + PORT);
});

//SERVER SOCKET IO
const serverSocket=https.createServer(certificato);

const io = new Server(serverSocket, { cors: { origin: true, credentials: true, }, allowEIO3: true });

io.on("connection", (socket) => {
  
    socket.on('subscribe', function (data) 
    { 
      console.log("subscribe: " + socket.id + " " + data.cognome + " " + data.nome + " " + "Add to room: " + data.room);
      data.idSocketClient=socket.id;
      socket.join(data.room);
      socket.broadcast.to(data.room).emit('user-status',data);
    });

    socket.on('unsubscribe', function (data) 
    { 
      console.log("unsubscribe: " + socket.id + " " + data.cognome + " " + data.nome + " " + "Remove to room: " + data.room);
      data.idSocketClient=socket.id;
      socket.leave(data.room);
      socket.broadcast.to(data.room).emit('user-status',data);

    });

    socket.on('send-position', function (data) {
      console.log("send-position: " +JSON.stringify(data));
      data.idSocketClient=socket.id;
      io.sockets.in(data.room).emit('posizione', data); 
    });  

  });

//SERVER SOCKET IO
serverSocket.listen(PORT_SOCKET,function(){
  console.log("Server Socket listen on port : " + PORT_SOCKET);
});