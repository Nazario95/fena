import {consulta} from "../../../panel/dist/js/firebase.js"

//verificar acceso al panel
const token = localStorage.getItem('token_access');
const usr = localStorage.getItem('usr');

// console.log(token)
// console.log(usr)

token!=null&&usr!=null?verificarAcesso():'';

//consultar nivel de usuario
async function verificarAcesso(){
    //consultar usr
    let res =  await consulta({email:usr},'admin_usr');
    // console.log(res.empty);
    res.empty==false ? enlacePanel():''    
}
//mostrar enlace
function enlacePanel(){
    // console.log('inyectando enlace al panel');
    const footer = document.querySelector('.footer-pera');
    //texto adminitracion
    let panelText = document.createElement('p')
    panelText.textContent = 'ADMINISTRACION:';
    panelText.classList.add('my-0');
    footer.appendChild(panelText);
    //link al panel
    let panelLink = document.createElement('a')    
    panelLink.classList.add('info2');
    panelLink.setAttribute('href','./panel/?access=admin');
    //texto link panel
    let textLink = document.createElement('p');
    textLink.textContent = 'Ir a panel de administracion';
    textLink.classList.add('admin-panel','text-danger')
    panelLink.appendChild(textLink);
    //inyectar al DOM
    footer.appendChild(panelLink);
}