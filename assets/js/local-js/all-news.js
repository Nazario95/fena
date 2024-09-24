import { cargarImg, loadImg, searchParamURL } from "./app.js";
import { noticias } from "./switch-data.js";

//>>>>>>>Configurar mes
let meses = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];

// localStorage.removeItem('noticiasLocalData')
document.addEventListener('DOMContentLoaded',init);
function init(){
    // console.log( searchParamURL())
    let paginacion = searchParamURL()[1] != undefined  ? Number(searchParamURL()[1].page) : '';
    let seccion = searchParamURL()[0] != undefined  ? searchParamURL()[0].section : 
    location.href = `./noticias.html?section=all&page=1`;

    //>>>>>>Obtener Noticias
    let totalNoticias;
    localStorage.getItem('noticiasLocalData') ? 
    totalNoticias = JSON.parse(localStorage.getItem('noticiasLocalData')) : 
    descargarNoticias(); 

    // console.log(paginacion)
    console.log(searchParamURL()[0].section)

    //>>>>>>>>>check parametro page en url
    searchParamURL()[1] == undefined ? location.href = `./noticias.html?section=${searchParamURL()[0].section}&page=1`:'';
    //>>>>>>>>>>check section all
    searchParamURL()[0].section == 'all' ? mostrarTodo(paginacion,totalNoticias) : '';
    //>>>>>>>>>>check section politica
    searchParamURL()[0].section != 'all' ? mostrarFiltrado(paginacion,totalNoticias,seccion) : '';
}

//>>>>>>>>>>MOSTRAR TODAS LAS NOTICAS
function mostrarTodo(paginacion,totalNoticias){
     
    // console.log(totalNoticias.length)
    // console.log(totalNoticias)
    //>>>>>>>>>>Ordenar Noticias
    let noticiasOrdenadas = totalNoticias.length > 10 ? ordenarNoticia(paginacion,totalNoticias) : totalNoticias ;
    //>>>>>>>>>>>ocultar contenedor de noticia sobrante
    if(noticiasOrdenadas.length !=0 && noticiasOrdenadas.length <= 10){
        for(let i=noticiasOrdenadas.length+1;i<=10;i++){
            document.querySelector(`.noticia-${i}`).classList.add('d-none');
        }
    }
    //>>>>>>>>>>>inyectar datos
    // console.log(noticiasOrdenadas)
    for(let i=0;i<noticiasOrdenadas.length; i++){
        let idNoticia = noticiasOrdenadas[i].id;
        let {fecha, imgPortada, parafos, titulo, redactor} = noticiasOrdenadas[i].noticia

        //ineyctar img portada
            document.querySelector(`.noticia-${i+1}-img`).setAttribute('id',imgPortada);
        //ineyctar dia publicacion
            document.querySelector(`.noticia-${i+1}-dia`).textContent = fecha.split('-')[2]
        //ineyctar mes publicaion
            document.querySelector(`.noticia-${i+1}-mes`).textContent = meses[Number(fecha.split('-')[1])-1];
        //ineyctar link url de la noticia
            document.querySelector(`.noticia-${i+1}-url`).setAttribute('href',`noticia.html?news=${idNoticia}`)
        //ineyctar titulo de la noticia
            document.querySelector(`.noticia-${i+1}-titulo`).textContent = titulo;
        //ineyctar texto de la noticia
            document.querySelector(`.noticia-${i+1}-texto`).textContent = parafos[0].texto.split(' ').slice(0,15).join(' ')+'...';
        //ineyctar redator
            document.querySelector(`.noticia-${i+1}-redactor`).textContent = redactor;
        //inyectar total visto
        
    }
    //Descargar Imagenes
    loadImg ? cargarImg('noticias') : '';

    //crear paginadores
    totalNoticias.length > 10 ? crearPaginador(totalNoticias.length) : '';
}

//>>>>>>>>>MOSTRAR NOTICIAS - POLITICA
function mostrarFiltrado(paginacion,totalNoticias,seccion){
    //filtrar noticias
    let totalFiltrado = filtrarNews(totalNoticias,seccion)  
    // console.log(totalNoticias)    
    let noticiasFIltradas = totalFiltrado.length > 10 ? ordenarNoticia(paginacion,totalFiltrado) : totalFiltrado ;
    //>>>>>>>>>>>ocultar contenedor de noticia sobrante
    if(noticiasFIltradas.length !=0 && noticiasFIltradas.length <= 10){
        for(let i=noticiasFIltradas.length+1;i<=10;i++){
            document.querySelector(`.noticia-${i}`).classList.add('d-none');
        }
    }

    //>>>>>>>>>>>inyectar datos
    // console.log(noticiasOrdenadas)
    for(let i=0;i<noticiasFIltradas.length; i++){
        let idNoticia = noticiasFIltradas[i].id;
        let {fecha, imgPortada, parafos, titulo, redactor} = noticiasFIltradas[i].noticia

        //ineyctar img portada
            document.querySelector(`.noticia-${i+1}-img`).setAttribute('id',imgPortada);
        //ineyctar dia publicacion
            document.querySelector(`.noticia-${i+1}-dia`).textContent = fecha.split('-')[2]
        //ineyctar mes publicaion
            document.querySelector(`.noticia-${i+1}-mes`).textContent = meses[Number(fecha.split('-')[1])-1];
        //ineyctar link url de la noticia
            document.querySelector(`.noticia-${i+1}-url`).setAttribute('href',`noticia.html?news=${idNoticia}`)
        //ineyctar titulo de la noticia
            document.querySelector(`.noticia-${i+1}-titulo`).textContent = titulo;
        //ineyctar texto de la noticia
            document.querySelector(`.noticia-${i+1}-texto`).textContent = parafos[0].texto.split(' ').slice(0,15).join(' ')+'...';
        //ineyctar redator
            document.querySelector(`.noticia-${i+1}-redactor`).textContent = redactor;
        //inyectar total visto        
    }

    //Descargar Imagenes
    loadImg ? cargarImg('noticias') : '';

    //crear paginadores
    noticiasFIltradas.length > 10 ? crearPaginador(totalNoticias.length) : '';
}

//-----------Funciones Globales
    //filtrar noticias
    function filtrarNews(noticias,categoria){
        console.log(categoria)
       // console.log(noticias)
        let noticiasFIltradas = [];
        noticias.forEach(filtro => {
            filtro.noticia.categoria == categoria.toLowerCase() ? noticiasFIltradas.push(filtro) : '';
        });
        console.log(noticiasFIltradas);
        return noticiasFIltradas;
    }

    async function  descargarNoticias() {
    let res = await noticias();
    res ? init():'';
    }

    //Ordenar Noticias Segun Paginacion
    function ordenarNoticia(paginacion,totalNoticias){
        // console.log(paginacion)
        let maximo = paginacion * 10;
        let minimo = maximo - 10;
        let newsOrdenados = [];

        for(let i=minimo; i < maximo; i++){
            totalNoticias[i] != undefined ?  newsOrdenados.push(totalNoticias[i]) : '';
        }
        return newsOrdenados;
    }

    //crear paginador
    function crearPaginador(totalNoticias){
        //total a crear
        let crearTotal = totalNoticias / 10;
        let chkNumeroDecimal = `${crearTotal}`.indexOf('.') == 1 ? 'decimal' : 'entero';
        console.log(chkNumeroDecimal)

        if(crearTotal > 1 && chkNumeroDecimal == 'decimal'){
            let total = Math.round(crearTotal+1)
            console.log('Crear ',Math.round(crearTotal+1));
            paginadores(total)
        }
        else if(crearTotal > 1 && chkNumeroDecimal == 'entero'){
            console.log('crear ',crearTotal)
            paginadores(crearTotal)
        }

        function paginadores(total){
            let componentePaginador = '';
            for(let i=0;i<total;i++){
                componentePaginador += `
                    <li class="page-item">
                        <a class="page-link p-0 m-0" href="noticias.html?section=all&page=${i+1}">${i+1}</a>
                    </li>
                `
            }
            //inyectar paginador
            document.querySelector('.noticia-paginacion').innerHTML =  '';
            document.querySelector('.noticia-paginacion').innerHTML =  componentePaginador;
        }
    }

