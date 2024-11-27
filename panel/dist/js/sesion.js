import {consulta, guardarColeccion } from "./firebase.js";

let url = location.pathname
let parrametroUrl= new URLSearchParams(location.search);
url.includes('login') ? checkTokenStateLocal() : checkAccess();

export function checkAccess(){ 
    // check url acess
    if(parrametroUrl.size > 0){
        // console.log(parrametroUrl)
        parrametroUrl.forEach((valor,clave)=>{ 
            //verifiar equipo con token           
            if(clave == 'access' && valor != 'admin' && valor != 'null'){
                console.log('token autorizado ==>',valor);
            }
            //generar nuevo token de acceso
            else if(clave == 'access' && valor == 'admin'){
                console.log('Generar nuevo token');
                generarNuevoToken()
            }
            //equipo no autorizado
            else if(clave == 'access' && valor == 'null'){
                accessDenied();
            }
        });    }
    else  accessDenied();
}
  
//verificar acceso local
async function checkTokenStateLocal(){
    if(localStorage.getItem('token_access')){
        // console.log('xxx')
        let tokenLocal = localStorage.getItem('token_access')
        //Auth token
        let res = await consulta({token:tokenLocal},'hwid');
        // console.log(res)
        if(res.empty == false){
            // console.log(res.docs);
            res.forEach(doc=>{
                //verficar acceso
                // console.log(tokenLocal != doc.data().token);
                tokenLocal != doc.data().token ?  location.href='../?access=null' : '';
            })
        }
        else location.href='../?access=null';
    }
    else{
        location.href='../?access=null'
    }
}

function accessDenied(){
    localStorage.clear();
    location.href = './wd-login.html'
}

// =========Funciones Globales
    function generarNuevoToken(){
        let usr  = prompt('user')
        let psw  = prompt('password')
        // console.log(res1,res2);
        usr&&psw?checkCredentials(usr,psw):accessDenied();
    }

    async function checkCredentials(usr,psw){
        let consultar = {};
        consultar['usr'] = usr;
        consultar['psw'] = psw;

        console.log(consultar);

        let res = await consulta(consultar,'admin_usr');        
        if(res.empty){
            accessDenied()
        }
        else{
            // guardarColeccion()
            res.forEach((doc) => {
                if(usr == doc.data().usr){
                    guardarToken()
                }
            });
        }
    }

    async function guardarToken(){
        //generar random token
        let accessToken = crypto.randomUUID();
        // guardar en db
        let res = await guardarColeccion('hwid',{token:accessToken})
        if(res == true){
            localStorage.setItem('token_access',`${accessToken}`);
            location.href = './login';
        }
    }

    


