import { iniciarSesion } from "./firebase.js";

console.log('iniciando sesion')

const btnlogin = document.querySelector('#btn-access')
btnlogin.addEventListener('click',(e)=>{
    e.preventDefault();
    //captudad datos de sesion
    let usr = document.querySelector('.usuario').value;
    let psw = document.querySelector('.psw').value;
    usr&&psw?checkCredenciales(`${usr}@gmail.com`,psw):alert('No se admiten campos vacios');
})

async function checkCredenciales(usr,psw) {
    //inciar sesion en firebase
    let res = await iniciarSesion(usr,psw);
    if(res != null){
        // console.log(res.user.email)
        // console.log(usr)
        if(res.user.email == usr){
            //check existencia de token local
            if(localStorage.getItem('token_access')){
                // generarToken();
                localStorage.setItem('usr',res.user.email)
                location.href = '../bd.html';
            }
        }
        // console.log(res)
    }
}