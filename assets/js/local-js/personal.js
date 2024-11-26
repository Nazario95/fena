import { coleccionDatos, downMultimedia } from "../../../panel/dist/js/firebase.js"
import { loadImg } from "./app.js";

//pabras clave
// const palabraClave = [
//     {
//         id:'first-dg-info',
//         wordKey:['primer','presidente','fena']
//     },
//     {
//         id:'dg-info',
//         wordKey:['presidente','presidenta','fena']
//     },
//     {
//         id:'vice-presi-info',
//         wordKey:['vicepresidente','vicepresidenta','fena']
//     },
//     {
//         id:'secretario-info',
//         wordKey:['secretario','secretaria','general','fena']
//     },
//     {
//         id:'del-provincial-annobon',
//         wordKey:['delegado','delegada','provincial','fena','annobon']
//     },
//     {
//         id:'del-provincial-bata',
//         wordKey:['delegado','delegada','provincial','fena','bata']
//     },
//     {
//         id:'del-provincial-bata-adjunto',
//         wordKey:['delegado','delegada','provincial','adjunta','adjunto','fena','bata']
//     }
// ]

let personals = [];

//capturar imagenes
async function getPersonalData(){    
    let res = await coleccionDatos('personal');
    res.forEach(data => {
        // console.log(data.data())
        personals.push(data.data());        
    });
    inyectarPersonal()
}
getPersonalData();

function inyectarPersonal(){
    personals.forEach(personal=>{
        //nombre
        if(document.querySelector(`.nom-${personal.cargo}`)){
            let nombres = document.querySelectorAll(`.nom-${personal.cargo}`);
            nombres.forEach(nombre=>{
                nombre.textContent = `${personal.nombre} ${personal.apellidos}`
            });
        }

        //info
        if(document.querySelector(`.info-${personal.cargo}`)){
            // console.log(document.querySelector(`.info-${personal.cargo}`))
            document.querySelector(`.info-${personal.cargo}`).textContent = `${personal.info!='undefined'?personal.info:'-'}`
        }

        //img
        if(document.querySelector(`.img-${personal.cargo}`)){
            // console.log(document.querySelector(`.img-${personal.cargo}`));
            //imagen
            loadImg ? urlImg(personal.nomImg, personal.cargo) : '';
        }
    })
}

async function urlImg(nomImg,domELemnt) {
    let resUrl = await downMultimedia('img-personal',nomImg)
    let imgs =  document.querySelectorAll(`.img-${domELemnt}`)
    imgs.forEach(img=>{
        img.setAttribute('src',resUrl)
    })
}
