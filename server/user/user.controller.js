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
            
             return next(conn);
        }

        conn.query('SELECT user.id,user.id_ruolo, user.nome,user.cognome,user.email,user.room,user.colorMarker,user.status_connected,user.status,user.timestamp, ruolo.nome AS nome_ruolo FROM user INNER JOIN ruolo ON (user.id_ruolo=ruolo.id)WHERE user.id=?',[req.params.id], function (err, rows, fields) { 
            
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
        
        if(req.body.user==undefined)
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

        if(!!!req.body.user.id || isNaN(req.body.user.id) || (!!!req.body.user.token))
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

    let add =(conn,req,res,next)=>{
    
        if(req.body.user==undefined)
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
        if((!!!req.body.user.nome) || (!!!req.body.user.cognome) || (!!!req.body.user.password) || (!!!req.body.user.email ) || (!!!req.body.user.room) || (!!!req.body.user.colorMarker) || (!!!req.body.user.status || isNaN(req.body.user.status)) || (!!!req.body.user.id_ruolo || isNaN(req.body.user.id_ruolo)))
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

        conn.query('SELECT email FROM user WHERE email=?',[req.body.user.email], function (err, rows, fields) { 
            
            if (!err) {
                if (rows.length>0)
                {
                    res.status(201).json({  
                        'success':false,
                        'error':{
                                'code':'201',
                                'message': 'Email già esistente'
                        }
                    });

                    return next(conn);
                }
                else
                {
                    extAdd(conn,req,res,next);
                }
            }
        
        });
    }

    let extAdd=(conn,req,res,next)=>{

        req.body.user.token=base64url(crypto.randomBytes(64));
        
        conn.query('INSERT INTO user SET nome=?,cognome=?,password=SHA1(?),email=?,room=?,colorMarker=?,token=?,id_ruolo=?,status=?',[req.body.user.nome,req.body.user.cognome,req.body.user.password,req.body.user.email,req.body.user.room,req.body.user.colorMarker,req.body.user.token,req.body.user.id_ruolo,req.body.user.status], function (err, rows, fields) { 
            
        if (!err) 
        {
            res.status(200).json({
                'success':true,
                'result':'Utente Inserito'
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

        if(req.body.user==undefined)
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

        if((!!!req.body.user.id || isNaN(req.body.user.id)) || (!!!req.body.user.nome) || (!!!req.body.user.cognome) || (!!!req.body.user.email) || (!!!req.body.user.room) || (!!!req.body.user.colorMarker) || (!!!req.body.user.status || isNaN(req.body.user.status)) || (!!!req.body.user.id_ruolo || isNaN(req.body.user.id_ruolo)))    
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

            conn.query('UPDATE user SET nome=?,cognome=?,email=?,room=?,colorMarker=?,id_ruolo=?,status=? WHERE id=?',[req.body.user.nome,req.body.user.cognome,req.body.user.email,req.body.user.room,req.body.user.colorMarker,req.body.user.id_ruolo,req.body.user.status,req.body.user.id], function (err, rows, fields) { 
                
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
       
        if(req.body.user==undefined)
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

    let listFull =(conn,req,res,next)=>{
        
        if(req.body.user==undefined)
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

        if((!!!req.body.user.id || isNaN(req.body.user.id)) || (!!!req.body.user.token))
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

        conn.query('SELECT id,token FROM user WHERE id=? AND token=? AND id_ruolo=1',[req.body.user.id,req.body.user.token], function (err, rows, fields) { 
            
            if (!err) {
                if (rows.length<=0)
                {
                    res.status(201).json({  
                        'success':false,
                        'error':{
                                'code':'401',
                                'message': 'Accesso Negato'
                        }
                    });

                    return next(conn);
                }
                else
                {
                    extListFull(conn,req,res,next);
                }
            
            } 
            else
            {
                res.status(403).json({  
                    'success':false,
                    'error':{
                            'code':'403',
                            'message': err
                    }
                });

                return next(conn);
            };
        
        });

    }

    let extListFull=(conn,req,res,next)=>{
    
        conn.query('SELECT user.id, user.nome, user.cognome, user.email, user.room, user.colorMarker, user.status_connected, user.status,user.timestamp, ruolo.nome AS nome_ruolo FROM user INNER JOIN ruolo ON (user.id_ruolo=ruolo.id)', function (err, rows, fields) { 
            
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
                            'message': err
                    }
                });
            };

            return next(conn);            
            
            });
    };

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

    //CAMBIA LA PASSWORD UTENTE LOGGATO
    let changeProfilePwd =(conn,req,res,next)=>{
        
        if(req.body.user==undefined)
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

        if((!!!req.body.user.id || isNaN(req.body.user.id)) || (!!!req.body.user.id_change || isNaN(req.body.user.id_change)) || (!!!req.body.user.token))
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

        conn.query('SELECT id,token FROM user WHERE id=? AND token=?',[req.body.user.id,req.body.user.token], function (err, rows, fields) { 
            
            if (!err) {
                if (rows.length<=0)
                {
                    res.status(201).json({  
                        'success':false,
                        'error':{
                                'code':'401',
                                'message': 'Accesso Negato'
                        }
                    });

                    return next(conn);
                }
                else
                {
                    extChangePwd(conn,req,res,next);
                }
            
            } 
            else
            {
                res.status(403).json({  
                    'success':false,
                    'error':{
                            'code':'403',
                            'message': err
                    }
                });

                return next(conn);
            };
        
        });

    }

    //CAMBIA LA PASSWORD UTENTE SOLO DA PARTE DI UN ADMIN
    let changePwd =(conn,req,res,next)=>{
        
        if(req.body.user==undefined)
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

        if((!!!req.body.user.id || isNaN(req.body.user.id)) || (!!!req.body.user.id_change || isNaN(req.body.user.id_change)) || (!!!req.body.user.token))
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

        conn.query('SELECT id,token,id_ruolo FROM user WHERE id=? AND token=? AND id_ruolo=1',[req.body.user.id,req.body.user.token], function (err, rows, fields) { 
            
            if (!err) {
                if (rows.length<=0)
                {
                    res.status(201).json({  
                        'success':false,
                        'error':{
                                'code':'401',
                                'message': 'Accesso Negato'
                        }
                    });

                    return next(conn);
                }
                else
                {
                    extChangePwd(conn,req,res,next);
                }
            
            } 
            else
            {
                res.status(403).json({  
                    'success':false,
                    'error':{
                            'code':'403',
                            'message': err
                    }
                });

                return next(conn);
            };
        
        });

    }

    //ESEGUO CAMBIO PASSWORD
    let extChangePwd=(conn,req,res,next)=>{
    
        conn.query('UPDATE user SET password=SHA1(?) WHERE id=?',[req.body.user.password,req.body.user.id_change], function (err, rows, fields) { 
            
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
    };

    return {
        searchID:searchID,
        UserProfile:UserProfile,
        add:add,
        change:change,
        del:del,
        list:list,
        listFull:listFull,
        listConnected:listConnected,
        changePwd:changePwd,
        changeProfilePwd:changeProfilePwd
    }
}