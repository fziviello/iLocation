'use strict';

const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.load();

//recupero parametri di configurazione
const host=process.env.MYSQL_HOSTNAME;
const port=process.env.MYSQL_PORT;
const database=process.env.MYSQL_DB;
const user=process.env.MYSQL_USER;
const psw=process.env.MYSQL_PSW;

module.exports=()=>{

    let connectDB =(req,res,next)=>{

        let connection=mysql.createConnection({
            host: host,
            port:port,
            user: user,
            password: psw,
            database: database
        });

        connection.connect(function(err) {
            if (err) {
                console.error('Errore Connessione DB: ' + JSON.stringify(err));
                return;
            }
          
            console.log('threadId DB:' + connection.threadId);
          });


        connection.on("error",function(err){
            if(err.code===protocol_connection_host)
            {
                connectDB();
            }
            else
            {
                console.error("connectDB: "+JSON.stringify(err));
            }
        });

        return next(connection);
    }

    let disconnectDB =(conn, req, res, next)=>{
        
        conn.end(

            function(err){
                
                if(!err)
                {
                    conn=null;
                }   
                else
                {
                   console.error("disconnectDB: "+JSON.stringify(err));
                } 
            }
        );

        return;
    }
    return {
        connect:connectDB,
        disconnect:disconnectDB
    }
}
