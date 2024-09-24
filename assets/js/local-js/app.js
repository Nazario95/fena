import { avisos, comunicados, noticias, getImg, getIdUpdates} from "./switch-data.js";
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
        console.log(versionRemota);
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
                console.log('No es Necesario Actualiza')
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
    }

    console.log(estadoDeActualizacion)
    if(estadoDeActualizacion == 4){
        getNoticias()
        insertComunicados();    
        fechaActual()//mostrar fecha actual
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
//>>>>>>>>>>Mostrar fehca actual
function fechaActual(){
    const days = {
        'Lunes':'Mon',
        'Martes':'Tue',
        'Miercoles':'Wed',
        'Jueves':'Thu',
        'Viernes':'Fri',
        'Sabado':'Sat',
        'Domingo':'Sun',
    }
    const months = {
        'Enero':'Jan',
        'Febrero':'Feb',
        'Marzo':'Mar',
        'Abril':'Apr',
        'Mayo':'May',
        'Junio':'Jun',
        'Julio':'Jul',
        'Agosto':'Aug',
        'Septiembre':'Sep',
        'Octubre':'Oct',
        'Noviembre':'Nov',
        'Diciembre':'Dec',
    }
    //get full Date
    const localDate = new Date(Date.now()).toString().split(' ');
    // console.log(localDate);
    
    let dia = localDate[0] ; //dia local en ingles
    let mes = localDate[1] ; // mes local, en ingles
    let diaNum = localDate[2] ; //dia local, numerico    
    let axo = localDate[3] ; // axo local

    //Show Date Data
    let showDay=''
    let showMonth=''

    //show Date
    for(let key in days){
        if(days[key] == dia){
            // console.log(key)
            showDay = key            
        }
    }
    //Show month
    for(let key in months){
        if(months[key] == mes){
            // console.log(key);
            showMonth = key;
        }
    }

    let showDate = `${showDay}, ${diaNum} de ${showMonth} de ${axo}`;
    //Show Date in DOM
    // console.log(showDate);
    document.querySelector('.date-today').textContent = showDate;
}
export function fechaHoy(){
    return new Date(Date.now()).toISOString().split('T')[0]
}

//>>>>>>>mostrar comunicados
function insertComunicados(){
    let componente = ''
<<<<<<< HEAD
    const listaAvisos = document.querySelector('.content-avisos');
    //Cargar  comunicado en Local o descargar en Servidor
    localStorage.getItem('avisosLocal') == null ? getAvisos() : cargarAvisos();
=======
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
>>>>>>> 7eb57924ff105ef40732120006120803cfab8f0d
    
    async function getAvisos(){
        let resComunicado = await comunicados();
        resComunicado.empty ? avisosPredeterminados() : cargarAvisoEnLocal(resComunicado);
        cargarAvisos()
    } 
    
    //----------> Cargar avisos en local
    function cargarAvisoEnLocal(avisos){
        let comunicados = [];
        avisos.forEach(aviso =>{
            comunicados.push({
                id:aviso.id,
                aviso:aviso.data()
            });
        });
        localStorage.setItem('avisosLocal',JSON.stringify(comunicados));
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
    }
    //----------> Si Hay Comunicados
    function cargarAvisos(){
        let avisosLocal = JSON.parse(localStorage.getItem('avisosLocal'));
        avisosLocal.forEach(aviso => { 
            componente += `    
                <div class="avisos">
                    <small class="text-dark px-3">
                        ${aviso.aviso.comunicado} //
                    </small>
                </div>
            `
        });
    }    
    listaAvisos.innerHTML = componente;    
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