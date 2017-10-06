'use strict';

const crypto = require('crypto');
const base64url = require('base64-url');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path=require('path');

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

        conn.query('SELECT user.id,user.id_ruolo, user.nome,user.cognome,user.email,user.room,user.colorMarker,user.status_connected,user.status,user.photo,user.timestamp, ruolo.nome AS nome_ruolo FROM user INNER JOIN ruolo ON (user.id_ruolo=ruolo.id)WHERE user.id=?',[req.params.id], function (err, rows, fields) { 
            
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

        req.body.user.token=base64url.encode(crypto.randomBytes(64));
        
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
        if(!!!req.body.user.photo)
        {
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
        else
        {
            conn.query('UPDATE user SET nome=?,cognome=?,email=?,room=?,colorMarker=?,id_ruolo=?,status=?,photo=? WHERE id=?',[req.body.user.nome,req.body.user.cognome,req.body.user.email,req.body.user.room,req.body.user.colorMarker,req.body.user.id_ruolo,req.body.user.status,req.body.user.photo,req.body.user.id], function (err, rows, fields) { 
                
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
        
        conn.query('SELECT id,nome,cognome,email,room,colorMarker,status_connected,status,photo,timestamp FROM user WHERE status=1', function (err, rows, fields) { 

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
    
        conn.query('SELECT user.id, user.nome, user.cognome, user.email, user.room, user.colorMarker, user.status_connected, user.status, user.photo, user.timestamp, ruolo.nome AS nome_ruolo FROM user INNER JOIN ruolo ON (user.id_ruolo=ruolo.id)', function (err, rows, fields) { 
            
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
        
        conn.query('SELECT id,nome,cognome,email,room,colorMarker,status_connected,status,photo,timestamp FROM user WHERE status=1 AND status_connected=1', function (err, rows, fields) { 

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
            res.status(400).json({  
                'success':false,
                'error':{
                            'code':'400',
                            'message':'Richiesta Errata'
                }
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

    let photo=(req,res,next)=>{
        
        if (!!!req.body.File || !!!req.body.ext || !!!req.body.id)
        {
            res.status(400).json({  
                'success':false,
                'error':{
                    'code':'400',
                    'message':'Richiesta Errata'
                }
            });

            return null;
        }

        if(req.body.ext=="jpeg" || req.body.ext=="jpg" || req.body.ext=="png")
        {
            let NameFile=Date.now()+"_profile_"+req.body.id+"."+req.body.ext;
            let path="build/uploads/profile";

            if(!SaveDecodeBase64(path,NameFile,req.body.File))
            {
                res.status(500).json({  
                    'success':false,
                    'error':{
                        'code':'500',
                        'message':'Impossibile Caricare il File'
                    }
                });

                return null;
            }

            if(req.body.oldFile)
            {
                //elimino vecchia foto
                fs.unlink(path+"/"+req.body.oldFile,function(err){
                    if(err) 
                    {
                        console.error("EliminaFotoProfilo:"+err);
                    }
               }); 
            }

            res.status(200).json({
                'success':true,
                'result':NameFile
            });
            
        }
        else
        {
            res.status(400).json({  
                'success':false,
                'error':{
                    'code':'400',
                    'message':'Formato immagine non supportato'
                }
            });

            return null;
        }

        return null;
        
    };

    let SaveDecodeBase64=function(path,NameFile,file) {

        var buff = new Buffer(file.replace(/^data:([A-Za-z-+\/]+)([A-Za-z-+\/]);base64,/,''), 'base64');

        mkdirp(path, function (err) 
        {
            if (err)
            {
                console.error("mkdirp:"+err);
                return false;
            }
            else
            {
                fs.writeFile(path+"/"+NameFile, buff, function (err) {
                    if(err)
                    {
                        console.error("SaveDecodeBase64:"+err);
                        return false;
                    }
                });   
            } 
          });

          return true;
          
    }

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
        changeProfilePwd:changeProfilePwd,
        photo:photo
    }
}