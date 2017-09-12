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

        connection.connect();

        connection.on("error:",function(r){
            if(r.code===protocol_connection_host)
            {
                connectDB();
            }
            else
            {
                console.error(r);
            }
        });

        return next(connection);
    }

    let disconnectDB =()=>{
        
        connection.end(

            function(err){
                
                if(!err)
                {
                    connection=null;
                }   
                else
                {
                   console.error(err);
                } 
            }
        );

        return;
    }


    return {connect:connectDB,disconnect:disconnectDB}
}
