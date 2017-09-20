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

        conn.query('SELECT nome,cognome,email,room,colorMarker,status,timestamp FROM user WHERE id=?',[req.params.id], function (err, rows, fields) { 
            
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

    let FullsearchID =(conn,req,res,next)=>{
        
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
        
                conn.query('SELECT * FROM user WHERE id=?',[req.params.id], function (err, rows, fields) { 
                    
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

        conn.query('INSERT INTO user SET ?',[req.body.user], function (err, rows, fields) { 
            
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

        conn.query('UPDATE user SET ? WHERE id=?',[req.body.user,req.body.user.id], function (err, rows, fields) { 
            
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
        
        conn.query('SELECT * FROM user', function (err, rows, fields) { 

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
        
        conn.query('SELECT * FROM user WHERE status=1', function (err, rows, fields) { 

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
        FullsearchID:FullsearchID,
        searchID:searchID,
        add:add,
        del:del,
        change:change,
        list:list,
        listConnected:listConnected
    }
}