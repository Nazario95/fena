import {avisos, comunicados, noticias, getImg, getIdUpdates} from "./switch-data.js";
// import { confMenu } from "./config.js";

//permitir carga de imagenes
export const loadImg = true;

document.addEventListener("DOMContentLoaded",()=>{
    configSite()
    printOrgIntLogos();
    printSponsorsLogos()
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
                    <small class="px-3">
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
        // console.log('cargando img')
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
            // console.log(imagenes)
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

//Imprimir Imagenes de Logo de los organismos internacionales
function printOrgIntLogos(){
    // document.querySelector('.title-org-int-natacion').textContent = ''

    //Variables locales necesarias
    const logoOrgImgContainer = document.querySelector('.natacion-org-logo');

    const orgLogosNames = [
        {
            orgTitle:'logo-org-africa-aquatic.png',
            orgUrl:'africaaquatics.org'
        },
        {
            orgTitle:'logo-org-word-aquatics.png',
            orgUrl:'www.worldaquatics.com'
        }
    ];

    let componentLogos = '';
    const rootUrlPics = 'assets/img/org-regulations';
    //Crear los componentes
    orgLogosNames.forEach(printLogo=>{
        let {orgTitle,orgUrl} = printLogo
        componentLogos += `
            <div class="">
                <a href="http://${orgUrl}" target="_blank">
                    <img src="./${rootUrlPics}/${orgTitle}" class="img-fluid" alt="${orgTitle}">
                </a>                
            </div>
        `
    });
    //inyectar los componentes
    logoOrgImgContainer.innerHTML = componentLogos;
}

//Imprimir Imagenes de Logo de los Sponsors
function printSponsorsLogos(){
    document.querySelector('.sponsors-section').classList.add('d-none')
}

function configSite(){
    //TEMAS DE LA PAGINA
    const pathColors = {
        //Clasico
        //Marino
        blueColors:{
            header:'#0099CC',
            mainBackground:'#FFFFFF',
            mainBtn:'#0099CC',
            hover:'#00CC99',
            selected:'#FFD43B'
        }        
    }

    //COLORES DE FONDO
        // GENERAL
            //#scrollUp -> fondo del btn de flecha ariba
            document.querySelector('#scrollUp')? document.querySelector('#scrollUp').style.backgroundColor = pathColors.blueColors.mainBtn:''

        // HEADER
            //bold-text aviso -> texto de aviso y comunicados
             document.querySelector('.aviso')?document.querySelector('.aviso').style.color = pathColors.blueColors.mainBackground:''

            // .header-area -> fondo del contenedor de avisos
            document.querySelector('.header-area')?document.querySelector('.header-area').style.backgroundColor = pathColors.blueColors.header:''
            // .header-bottom  -> fond del contenedor de menus
            document.querySelector('.header-bottom')?document.querySelector('.header-bottom').style.backgroundColor = pathColors.blueColors.header:''

            
            document.querySelector('.header-social')?document.querySelector('.header-social').style.backgroundColor = pathColors.blueColors.header:';'
        //MAIN
            //.bgr -> Fondo de las etiquetas de las noticias
            document.querySelectorAll('.bgr').forEach(label=>{
                label.style.backgroundColor = pathColors.blueColors.mainBtn
            });

        //FOOTER 
}
 if(document.querySelectorAll('.modulo-en-desarrollo')){
        document.querySelectorAll('.modulo-en-desarrollo').forEach((e)=>{
        e.addEventListener('click',(e)=>{
            if (e.target === e.currentTarget) {
                alert('Modulo en desarollo');
            }       
        })       
    })
 }

