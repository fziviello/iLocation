'use strict';

const crypto = require('crypto');
const base64url = require('base64-url');

module.exports=()=>{
    
        let login =(conn,req,res,next)=>{
    
            if(req.body.login==undefined)
            {
                res.status(400).json({  
                    'success':false,
                    'error':{
                                'code':'400',
                                'message':'Richiesta Errata'
                    }
                });
    
                return next(conn);
            }
            else if(!!!req.body.login.email || !!!req.body.login.password)
            {
                res.status(403).json({  
                    'success':false,
                    'error':{
                                'code':'403',
                                'message':'Parametri non corretti'
                    }
                });
                return next(conn);
            }
            
            conn.query('SELECT * FROM user WHERE email=? AND password=SHA1(?) AND status=1',[req.body.login.email,req.body.login.password], function (err, rows, fields) { 
                       
            if (!err) 
            {
                if (rows.length>0)
                {
                    
                    res.status(200).json({
                                            'success':true,
                                            'result':rows
                                        });

                    updateStatus(conn,rows[0].id);
                }
                else
                {
                    res.status(401).json({  
                                            'success':false,
                                            'error':{
                                                        'code':'401',
                                                        'message':'Accesso Negato'
                                            }
                                        });
                }
            } 
            else 
            {
                res.status(403).json({  
                    'success':false,
                    'error':{
                                'code':'403',
                                'message':err
                    }
                });
            };
    
            return next(conn);            
            
            });
        }

        let updateStatus =(conn,id)=>{
            conn.query('UPDATE user SET status_connected=1 AND status=1 WHERE id=?',[parseInt(id)], function (err, rows, fields) { });
        }
        
        let logout =(conn,req,res,next)=>{
            
            if(req.body.logout==undefined)
            {
                res.status(400).json({  
                    'success':false,
                    'error':{
                                'code':'400',
                                'message':'Richiesta Errata'
                    }
                });
    
                return next(conn);
            }
            else if(!!!req.body.logout.id || isNaN(req.body.logout.id))
            {
                res.status(403).json({  
                    'success':false,
                    'error':{
                                'code':'403',
                                'message':'Errore'
                    }
                });

                return next(conn);
            }

            conn.query('UPDATE user SET token=?,status_connected=0 WHERE id=?',[base64url.encode(crypto.randomBytes(64)),parseInt(req.body.logout.id)], function (err, rows, fields) { 
                    
                if (!err) 
                {
                    res.status(200).json({
                        'success':true,
                        'result':rows
                    });

                } 
                else 
                {
                    res.status(401).json({  
                        'success':false,
                        'error':{
                                    'code':'401',
                                    'message':err
                        }
                    });
                };
        
                return next(conn);
        
            });
         }
            
        return {
            login:login,
            updateStatus:updateStatus,
            logout:logout
        }
    }




