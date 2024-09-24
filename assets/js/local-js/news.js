import { cargarImg, loadImg, searchParamURL } from "./app.js";

console.log(searchParamURL())
let idNoticia = searchParamURL()[0].news;
let noticias = localStorage.getItem('noticiasLocalData')? 
                JSON.parse(localStorage.getItem('noticiasLocalData')) :
                location.href = './index.html';

noticias.forEach(noticia => {
    noticia.id == idNoticia ? mostrarNoticia(noticia) : '';
});

function mostrarNoticia(noticia){
    // console.log(noticia)
    let {imgPortada,titulo,parafos} = noticia.noticia;
    //----->insertar codigo de descarga de img
    document.querySelector('.img-principal').setAttribute('id',imgPortada);
    //----->Insertar titulo de la notica
    document.querySelector('.titulo-principal').textContent = titulo;
    //----->Insertar Parrafos    
    //#1-->check si existe img de parrafo
    let idImgParrafo = undefined;
    parafos.forEach(parafo=>{
        let {imgParafo} = parafo;  
        if( idImgParrafo == undefined && imgParafo != undefined){
            idImgParrafo =  imgParafo
        }        
    });
    console.log(idImgParrafo)
    //#2-->Crear parrafos
    let componenteParrafo = '';
    let inyectarImgParafo = Math.round(parafos.length / 2)+1;//zona de inyeccion de img parrafo
    let parafoImg = 0;//calcular zona de inyeccion de img del parrafo
    parafos.forEach(parafo=>{
        let {subitulo, texto} = parafo;        
        parafoImg++
        componenteParrafo += `
            <div class="parrafo">                
               <div class="heading-news mb-30 pt-30 ${subitulo==''?'d-none':''}">
                   <h4>${subitulo=='undefined'?'':subitulo}</h4>
               </div>
               <div class="about-img ${idImgParrafo==undefined?'d-none':''}">
                ${idImgParrafo != undefined && parafoImg == inyectarImgParafo ? inyectarImgParrafo(idImgParrafo):''}
                </div>
               <div class="about-prea contenedor-noticia">
                  <p class="fw-bold"> ${texto}</p>
               </div> 
            </div>
        `;
    });
    document.querySelector('.parrafos').innerHTML = componenteParrafo;
    loadImg ? cargarImg('noticia'):'';

    function inyectarImgParrafo(imgParafo){
        console.log('inyectando img parrafo')
        return `<img alt="img_parrafo" class="img-parafo w-75 my-4" id="${imgParafo}">`
    }
}
