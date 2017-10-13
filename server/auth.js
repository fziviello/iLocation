'use strict';

const passport=require('passport');
const Bearer=require('passport-http-bearer');
const bcrypt=require('bcrypt-nodejs');
const dotenv=require('dotenv');
const mysql=require('mysql');

dotenv.load();

const BearerStrategy = Bearer.Strategy;
const host=process.env.MYSQL_HOSTNAME;
const port=process.env.MYSQL_PORT;
const database=process.env.MYSQL_DB;
const userDB=process.env.MYSQL_USER;
const pswDB=process.env.MYSQL_PSW;

var auth = {
  bearer: () => {
    return passport.authenticate('bearer', {session: false});
  }
};

passport.use('bearer', new BearerStrategy(
  (accessToken, next) => {
    let user = false;
    let response = false;
    if(!!!accessToken){
      return next(null, false);
    }

    let connection = mysql.createConnection({
        host: host,
        port:port,
        user: userDB,
        password: pswDB,
        database: database
    });

    connection.connect();
    connection.query('SELECT token FROM user WHERE token = ?', [accessToken], function(err, rows, fields) {
      
      if(err) {
        connection.end();
        return next(null, false);
      }
      if(rows.length !== 1){
        connection.end();
        return next(null, false);
      }
      else
      {
        connection.end();
        return next(null, rows);
      }
    });
  }
));

module.exports = auth;