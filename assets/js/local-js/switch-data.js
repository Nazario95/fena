import { coleccionDatos, downMultimedia } from "../../../panel/dist/js/firebase.js";
//Datos Avisos
export const avisos = [
    {
        codigo:'0001-fe',
        aviso:  'Bienvenido a la pagina oficial de la FENA'
    },
    {
        codigo:'0002-fe',
        aviso:  'Esta es la pagina Oficial de la Federacion de Natacion de la Republica de Guinea Ecuatorial.'
    },
    {
        codigo:'0002-fe',
        aviso:  'Aqui encontrara toda la actualidad informativa de esta Federacion y mucho mas.'
    }
];

//------------>GET COMUNICADOS
    export async function comunicados(){
        let res = await coleccionDatos('comunicados');
        return res;
    }

// ---------> GET NOTICIAS
    export async function noticias(){
        let totalNoticias = [];
        let res = await coleccionDatos('noticias');
        if(res.empty == false){
            res.forEach(noticia => {
                if(noticia.data().publicar == true){
                    let contrucNoticia = {
                        id:noticia.id,
                        noticia:noticia.data()
                    }
                    if(totalNoticias.length >= 30) return;
                    else totalNoticias.push(contrucNoticia); 
                }                
                               
            });

            // console.log(totalNoticias)
            localStorage.setItem('noticiasLocalData',JSON.stringify(totalNoticias));
            return true;
        }
        else return false;
    }
// -----------> GET IMG
    export async function getImg(ruta,id){
        let res = await downMultimedia(ruta,id);
        return res;
    }

// ------------> GET ID UPDATE
export async function getIdUpdates(){
    let res = await coleccionDatos('update');
    return res;
}