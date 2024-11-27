import {avisos, comunicados, noticias, getImg, getIdUpdates} from "./switch-data.js";
//permitir carga de imagenes
export const loadImg = true;

document.addEventListener("DOMContentLoaded",()=>{
    checkUpdate();    
});

//>>>>>>>Verificar nuevos datos
async function checkUpdate(){
    //obtener id de actualizacion del servidor
    let versionRemota = {};
    let versionLocal;
    let estadoDeActualizacion = 0;

    let getActualizaciones = await getIdUpdates();
    if(getActualizaciones.empty == false){       
        getActualizaciones.forEach(versionActual=>{
            versionRemota[versionActual.id] = versionActual.data()        
        })
        // console.log(versionRemota);
        crearVersionLocal()
    }   

    //obtener id locales
    function crearVersionLocal(){
        if(localStorage.getItem('versionLocal')){
            versionLocal = JSON.parse(localStorage.getItem('versionLocal'));
            comprarVersiones(); 
        }
        else{
            console.log('No hay version Local');
            actualizarVersionLocal()
        }        
    }

    function actualizarVersionLocal(){
        if(localStorage.getItem('versionLocal')){
            localStorage.removeItem('versionLocal');
        }
        localStorage.setItem('versionLocal',JSON.stringify(versionRemota));
        crearVersionLocal();
    }
    //comprar id
    function comprarVersiones(){        
        // console.log('--------version remota---------')
        // console.log(versionRemota)
        // console.log('--------version local---------')
        // console.log(versionLocal);

        //comprar las versiones
        let actualizar = false;
        let idCheckVersion = ['aviso','new','personal','pub'];
        for(let i=0;i<idCheckVersion.length;i++){
            let remoto = versionRemota[idCheckVersion[i]].fecha;
            let local = versionLocal[idCheckVersion[i]].fecha;
            // console.log('remoto==>',remoto)
            // console.log('local==>',local)
            if(remoto == local){
                // console.log('No es Necesario Actualiza')
                estadoDeActualizacion++
            }
            else if(remoto != local){
                console.log(`Es Necesario Actualizar ${idCheckVersion[i]}`)
                let res = realizarActualizacion(idCheckVersion[i]);
                res?actualizar = true:'';
            }
        }
        if(actualizar){
            localStorage.removeItem('versionLocal')
            location.href = './index.html'
        }
    }

    //realizar actualizacion, si es necesario
    function realizarActualizacion(tipo){
        if(tipo == 'aviso'){
            localStorage.removeItem('avisosLocal');
            return true;
        }
        else if(tipo == 'new'){
            localStorage.removeItem('noticiasLocalData');
            return true;
        }
        else if(tipo == 'personal'){
            return true;
        }
        else if(tipo == 'pub'){
            return true;
        }
    }

    // console.log(estadoDeActualizacion)
    if(estadoDeActualizacion == 4){
        getNoticias()
        insertComunicados();
        init()
    }
}

//>>>>>>>Cargar Noticias
async function  getNoticias() {
    // console.log(localStorage.getItem('noticiasLocalData') == null)
    localStorage.getItem('noticiasLocalData') == null ? noticias():''
    // console.log('Noticia_Local==>true');    
}


// *******MODIFICACIONES DEL DOM*****
export function fechaHoy(){
    return new Date(Date.now()).toISOString().split('T')[0]
}

//>>>>>>>mostrar comunicados
function insertComunicados(){
    let componente = '';
    const listaAvisos = document.querySelector('.content-avisos');
    //Cargar  comunicado en Local o descargar en Servidor
    localStorage.getItem('avisosLocal') == null ? getAvisos() : cargarAvisos();
    // console.log(componente)
    listaAvisos.innerHTML = componente;    
    async function getAvisos(){
        let resComunicado = await comunicados();
        // console.log(resComunicado)
        resComunicado.empty ? avisosPredeterminados() : cargarAvisoEnLocal(resComunicado);
    } 
    
    //----------> Cargar avisos en local
    function cargarAvisoEnLocal(avisos){
        let comunicados = [];
        avisos.forEach(aviso =>{
            if(aviso.data().publicar == true){
                comunicados.push({
                    id:aviso.id,
                    aviso:aviso.data(),
                    publicar:aviso.publicar
                });
            }            
        });
        console.log(comunicados)
        localStorage.setItem('avisosLocal',JSON.stringify(comunicados));
        cargarAvisos()
    }
    // console.log(listaAvisos);    
    
    //------> Si No hay Comunicados
    function avisosPredeterminados(){        
        avisos.forEach(aviso => {        
            componente += `    
                <div class="avisos">
                    <small class="text-dark px-3">
                        ${aviso.aviso} //
                    </small>
                </div>
            `
        });
        // console.log(componente)
        listaAvisos.innerHTML = componente;    
    }
    //----------> Si Hay Comunicados
    function cargarAvisos(){
        let avisosLocal = localStorage.getItem('avisosLocal') != null ? JSON.parse(localStorage.getItem('avisosLocal')):'';

        avisosLocal.forEach(aviso => { 
            if(aviso.aviso.publicar == true){
                componente += `    
                    <div class="avisos">
                        <small class="text-dark px-3">
                            ${aviso.aviso.comunicado} //
                        </small>
                    </div>
                 `
            }
            
        });
        if(componente == ''){
            localStorage.removeItem('avisosLocal');
            avisosPredeterminados()
        }
        else{
            listaAvisos.innerHTML = componente;
        }   
    }    
    
}
function init(){    
    // =====>Solo competiciones.html
    if(location.pathname.indexOf('competiciones.html') != -1){
        let section =  searchParamURL();
        if(section == false)console.log('No hay parametros en la URL. Mostrando 404');
        else{
            //Ver Seccion Memoria de participaciones
            if(section[0].section == 'memorias'){
                removeDnone('id','memorias-competiciones');
            }
            else if(section[0].section == 'masculino'){
                removeDnone('id','tabla-clasificacion');
            }
            else if(section[0].section == 'femenino'){
                removeDnone('id','tabla-clasificacion');
            }
        }
    }

     // =====>Solo fena.html
    if(location.pathname.indexOf('fena.html') != -1){        
        let section =  searchParamURL();
         //Ver Seccion Memoria de participaciones
         if(section[0].section == 'nosotros'){
            removeDnone('id','fena-nosotros');
        }
        if(section[0].section == 'junta'){            
            removeDnone('id','fena-junta');
        }
        if(section[0].section == 'personal'){
            removeDnone('id','fena-personal');
        }
    }

}

//FUNCIONES GLOBALES:
    // Lector de parametros URL
    export function searchParamURL(){
        const readParamsURL = new URLSearchParams(location.search)
        if(readParamsURL.size == 0){
            return false;
        }
        else{
            let paramsKeyValue = []
            readParamsURL.forEach((value,key) => {
                // console.log(key, '=>', value);
                paramsKeyValue.push({[key]:value});                
            });
            return paramsKeyValue;
        }
    }

    //Borra el d-none de una etiqueta
    function removeDnone(type,link){
        if(type == 'id'){
            document.getElementById(`${link}`).classList.remove('d-none');
        }
        else if(type == 'class'){
            document.getElementsByClassName(`${link}`).classList.remove('d-none');
        }        
    }

    //Cargar Imagenes en pagina
    export function  cargarImg(pagina,seccion) {
        console.log('cargando img')
        // console.log(pagina,seccion)
        //-------> Pagina Index
        if(pagina == 'index'){
            //#Secion header
            if(seccion == 'header'){
                let imgNoticiaHeader = document.querySelectorAll('.noticia-header');
                initDescargaImg(imgNoticiaHeader);
            }
            //#Seccion categorias
            if(seccion == 'noticias-categoria'){
                let imgNoticiaCategoria = document.querySelectorAll('.img-noticia-filtro');
                initDescargaImg(imgNoticiaCategoria);
            }

            //#Seccion Recientes
            if(seccion == 'reciente'){
                let imgNoticiaReciete = document.querySelectorAll('.img-reciente');
                initDescargaImg(imgNoticiaReciete);
            }
        }
        //-------> Pagina noticia
        else if(pagina == 'noticia'){
            let imgNotciaParrafo = document.querySelectorAll('.img-parafo');
                initDescargaImg(imgNotciaParrafo);
        }
        //-------> Pagina noticias
        else if(pagina == 'noticias'){
            let imgNotcias = document.querySelectorAll('.card-img');
                initDescargaImg(imgNotcias);
        }
        function initDescargaImg(imagenes){
            console.log(imagenes)
            imagenes.forEach(srcImg=>{
                let nomImg = srcImg.getAttribute('id');
                let descargarImg = async() => {
                    let urlImg = await getImg('img-noticia',nomImg);
                    //inyectar url
                    // console.log(urlImg)
                    srcImg.setAttribute('src',urlImg)
                }
                descargarImg();
            })
        }
       
    }