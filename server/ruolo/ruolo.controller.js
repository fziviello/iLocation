'use strict';

const crypto = require('crypto');
const base64url = require('base64url');

module.exports=()=>{
    
        let lista =(conn,req,res,next)=>{
            
            conn.query('SELECT * FROM ruolo ORDER BY nome', function (err, rows, fields) { 
                       
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
                    res.status(200).json({  
                                            'success':true,
                                            'result':null
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
            
            conn.query('SELECT * FROM ruolo WHERE id=? ORDER BY nome',[req.params.id], function (err, rows, fields) { 
                       
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
                    res.status(200).json({  
                                            'success':true,
                                            'result':null
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
                
            if(req.body.ruolo==undefined)
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

            if((!!!req.body.ruolo.nome) && (!!!req.body.ruolo.descrizione))
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

            conn.query('INSERT INTO ruolo SET nome=?,descrizione=?',[req.body.ruolo.nome,req.body.ruolo.descrizione], function (err, rows, fields) { 
                
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

            if(req.body.ruolo==undefined)
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
            
            if((!!!req.body.ruolo.nome) || (!!!req.body.ruolo.descrizione) || (!!!req.body.ruolo.id || isNaN(req.body.ruolo.id)))
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
            
            conn.query('UPDATE ruolo SET nome=?,descrizione=? WHERE id=?',[req.body.ruolo.nome,req.body.ruolo.descrizione,req.body.ruolo.id], function (err, rows, fields) { 
                
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
            
             if(req.body.ruolo==undefined)
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
     
             if(!!!req.body.ruolo.id || isNaN(req.body.ruolo.id))
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
     
             conn.query('DELETE FROM ruolo WHERE id=?',[req.body.ruolo.id], function (err,fields) { 
                 
                 
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
    
    return {
        searchID:searchID,
        lista:lista,
        add:add,
        change:change,
        del:del
    }
}