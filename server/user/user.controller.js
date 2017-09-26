'use strict';

const crypto = require('crypto');
const base64url = require('base64url');

module.exports=()=>{

    let searchID =(conn,req,res,next)=>{

        if(!!!req.params.id || isNaN(req.params.id))
        {
            res.status(403).json({  
                'success':false,
                'error':{
                        'code':'403',
                        'message':'Parametri Errati'
                }
            });
            
             return;
        }

        conn.query('SELECT id,nome,cognome,email,room,colorMarker,status_connected,status,timestamp FROM user WHERE id=?',[req.params.id], function (err, rows, fields) { 
            
        if (!err) 
        {
            if (rows.length>0)
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

    let UserProfile =(conn,req,res,next)=>{
        
                if(!!!req.body.user.id || isNaN(req.body.user.id) && (!!!req.body.user.token || isNaN(req.body.user.token)))
                {
                    res.status(403).json({  
                        'success':false,
                        'error':{
                                    'code':'403',
                                    'message':'Parametri Errati'
                        }
                    });
                    
                     return;
                }
        
                conn.query('SELECT * FROM user WHERE id=? AND token=? AND status=1',[req.body.user.id,req.body.user.token], function (err, rows, fields) { 
                    
                if (!err) 
                {
                    if (rows.length>0)
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


    let UserProfileFull =(conn,req,res,next)=>{
        
                if(!!!req.body.user.id || isNaN(req.body.user.id) && (!!!req.body.user.token || isNaN(req.body.user.token)))
                {
                    res.status(403).json({  
                        'success':false,
                        'error':{
                                    'code':'403',
                                    'message':'Parametri Errati'
                        }
                    });
                    
                        return;
                }
        
                conn.query('SELECT * FROM user WHERE id=?',[req.body.user.id,req.body.user.token], function (err, rows, fields) { 
                    
                if (!err) 
                {
                    if (rows.length>0)
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

    let add =(conn,req,res,next)=>{

        req.body.user.token=base64url(crypto.randomBytes(64));

        conn.query('INSERT INTO user SET nome=?,cognome=?,password=?,email=?,room=?,colorMarker=?,token=?,id_ruolo=?,status=?',[req.body.user.nome,req.body.user.cognome,req.body.user.password,req.body.user.email,req.body.user.room,req.body.user.colorMarker,req.body.user.token,req.body.user.id_ruolo,req.body.user.status], function (err, rows, fields) { 
            
        if (!err) 
        {
            res.status(200).json({
                'success':true,
                'result':rows
            });
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

    let change =(conn,req,res,next)=>{

        conn.query('UPDATE user SET nome=?,cognome=?,password=?,email=?,room=?,colorMarker=?,id_ruolo=?,status=? WHERE id=?',[req.body.user.nome,req.body.user.cognome,req.body.user.password,req.body.user.email,req.body.user.room,req.body.user.colorMarker,req.body.user.id_ruolo,req.body.user.status,req.body.user.id], function (err, rows, fields) { 
            
        if (!err) 
        {
            res.status(200).json({
                'success':true,
                'result':rows
            });
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

    let del =(conn,req,res,next)=>{
       
        if(!!!req.body.user.id || isNaN(req.body.user.id))
        {
            res.status(403).json({  
                'success':false,
                'error':{
                            'code':'403',
                            'message':'Parametri Errati'
                }
            });
            
            return next(conn);  
        }

        conn.query('DELETE FROM user WHERE id=?',[req.body.user.id], function (err,fields) { 
            
            if (!err) 
            {
                res.status(200).json({
                    'success':true,
                    'result':fields
                });
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

    let list =(conn,req,res,next)=>{
        
        conn.query('SELECT id,nome,cognome,email,room,colorMarker,status_connected,status,timestamp FROM user WHERE status=1', function (err, rows, fields) { 

            if (!err) {
                if (rows.length>0)
                {
                    res.status(200).json({
                        'success':true,
                        'result':rows
                    });
                }
                else
                {
                    res.status(200).json({
                        'success':true,
                        'result':null
                    });
                }
            } else {
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

    let listConnected =(conn,req,res,next)=>{
        
        conn.query('SELECT id,nome,cognome,email,room,colorMarker,status_connected,status,timestamp FROM user WHERE status=1 AND status_connected=1', function (err, rows, fields) { 

            if (!err) {
                if (rows.length>0)
                {
                    res.status(200).json({
                        'success':true,
                        'result':rows
                    });
                }
                else
                {
                    res.status(200).json({
                        'success':true,
                        'result':null
                    });
                }
            } else {
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

    return {
        UserProfile:UserProfile,
        UserProfileFull:UserProfileFull,
        searchID:searchID,
        add:add,
        del:del,
        change:change,
        list:list,
        listConnected:listConnected
    }
}