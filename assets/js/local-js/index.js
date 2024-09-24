import { cargarImg, fechaHoy, loadImg } from "./app.js";
import {getImg, noticias} from "./switch-data.js";
//Check Noticias Local
if(localStorage.getItem('noticiasLocalData') == null ){
    async function getNoticias() {
        console.log('Cargando en remoto');
        let res = await noticias();
        res == true ? mostrarNoticia() : '';
    }
    getNoticias()
}
else{
    console.log('Cargando en local');
    mostrarNoticia()
}


function mostrarNoticia(){
    console.log('mostrando noticias');
    let noticiasLocal = JSON.parse(localStorage.getItem('noticiasLocalData'))
    console.log(noticiasLocal);

    //------>SECCION#1.3. NOTICIAS IMPORTANTES DE 1-3
        let filtroDestacados = [];
        noticiasLocal.forEach(objNew => {
            let {destacado,publicar} = objNew.noticia;
            //check Destacado
            destacado && publicar ? filtroDestacados.push(objNew) : '';
        }); 
        // console.log(filtroDestacados);
        
        let compDestacado = document.querySelector(`.noticia-importante`);
        let componente = '';
        //>>>>>>>Crear Componente-Noticia-Importante-Slider
        for(let i=0;i<3;i++){  
            // console.log(filtroDestacados[i])
            // console.log(filtroDestacados[i] != undefined)
            if(filtroDestacados[i] != undefined){
                // console.log(filtroDestacados[i].id)
                // console.log(filtroDestacados[i].noticia)

                let id = filtroDestacados[i].id
                let {categoria,fecha,imgPortada,reportero,titulo} = filtroDestacados[i].noticia;
                componente += `
                <div class="single-slider">
                    <div class="trending-top mb-30">
                        <div class="trend-top-img" id="trending-1"> 
                            <img src="./assets/img/gallery/load_img.jpg" alt="img-left-trending" id="${imgPortada}" class="noticia-header">
                            <div class="trend-top-cap">
                                <span class="bgr" data-animation="fadeInUp" data-delay=".2s" data-duration="1000ms">
                                    ${categoria != '0'?categoria : 'Sin Categoria'}
                                </span>
                                <h2>
                                    <a href="./noticia.html?news=${id}" data-animation="fadeInUp" data-delay=".4s" data-duration="1000ms" class="trendng-new-title">
                                        ${titulo}
                                    </a>
                                </h2>
                                <p data-animation="fadeInUp" data-delay=".6s" data-duration="1000ms" class="trending-new-date">
                                    ${reportero}   -   ${fecha}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- ---------------------------------------------------------- -->
            `;
            }
            else{
                componente += `
                <div class="single-slider">
                    <div class="trending-top mb-30">
                        <div class="trend-top-img" id="trending-1"> 
                            <img src="./assets/img/gallery/load_img.jpg" alt="img-left-trending" id="${imgPortada}" class="noticia-header">
                            <div class="trend-top-cap">
                                <span class="bgr" data-animation="fadeInUp" data-delay=".data-duration="1000ms">
                                    categoria
                                </span>
                                <h2>
                                    <a href="./noticia.html?news=ab1ab1ab1" data-animation="fadeIndata-delay=".4s" data-duration="1000ms" class="trendng-new-title">
                                        FENA-FENA-FENA-FENA
                                    </a>
                                </h2>
                                <p data-animation="fadeInUp" data-delay=".6s" data-duration="1000class="trending-new-date">
                                -
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- ---------------------------------------------------------- -->
                `
            }        
        }
        // console.log(componente)
        compDestacado.innerHTML = componente;

    //------>SECCION#1.2. NOTICIAS IMPORTANTES DE 4-5
        let otraNoticiaImportante1 = document.getElementById('other-trendn-news-1');        
        if(filtroDestacados[3] != undefined){  
            let id = filtroDestacados[3].id
            let {categoria,fecha,imgPortada,reportero,titulo} = filtroDestacados[3].noticia;

            otraNoticiaImportante1.innerHTML = `
                <img src="./assets/img/gallery/load_img.jpg" alt="img-right-trending-news" id="${imgPortada}" class="noticia-header">
                <div class="trend-top-cap trend-top-cap2">
                    <span class="bgb">${categoria != '0'?categoria : 'Sin Categoria'}</span>
                    <h2>
                        <a href="./noticia.html?news=${id}" class="other-trnd-title">
                           ${titulo}
                        </a>
                    </h2>
                    <p class="other-trnd-title-autor">
                        by ${reportero}  -   ${fecha}
                    </p>
                </div>
            `;
        }
        let otraNoticiaImportante2 = document.getElementById('other-trendn-news-2');
        if(filtroDestacados[4] != undefined){  
            let id = filtroDestacados[4].id
            let {categoria,fecha,imgPortada,reportero,titulo} = filtroDestacados[4].noticia;

            otraNoticiaImportante2.innerHTML = `
                <img src="./assets/img/gallery/load_img.jpg" alt="img-right-trending-news" id="${imgPortada}" class="noticia-header">
                <div class="trend-top-cap trend-top-cap2">
                    <span class="bgb">${categoria}</span>
                    <h2>
                        <a href="./noticia.html?news=${id}" class="other-trnd-title">
                           ${titulo}
                        </a>
                    </h2>
                    <p class="other-trnd-title-autor">
                        by ${reportero}  -   ${fecha}
                    </p>
                </div>
            `;
        }
        loadImg ? cargarImg('index','header'):'';

    //------>SECCION#2. TODAS LAS NOTICIAS FILTRADAS
        //#1:Selecionar Contenedores
        const deportePrincipal = document.getElementById('nav-card-deporte-principal')
        const navDeporte = document.querySelector('.componente-nav-deporte');

        const politicaPrincipal = document.getElementById('nav-card-politica-principal')
        const navPolitica = document.querySelector('.componente-nav-politica');

        const techPrincipal = document.getElementById('nav-card-tech-principal')
        const navTech = document.querySelector('.componente-nav-tech');

        const culturaPrincipal = document.getElementById('nav-card-cultura-principal')
        const navCultura = document.querySelector('.componente-nav-cultura');

        //#2clasificar Noticias
        let filtroDeporte = [];
        let filtroPolitica = [];
        let filtroTech = [];
        let filtroCUltura = [];

        noticiasLocal.forEach(news => {
            let id= news.id;
            let noticia = news.noticia;
            //Filtrar Deporte
            let datos = {
                id:id,
                noticia:news.noticia
            }
            noticia.categoria == 'deporte' ? filtroDeporte.push({datos}):'';
            //Filtrar Politica
            noticia.categoria == 'politica' ? filtroPolitica.push({datos}):'';
            //Filtrar Tecg
            noticia.categoria == 'tecnologia' ? filtroTech.push({datos}):'';
            //Filtrar Politica
            noticia.categoria == 'cultura' ? filtroCUltura.push({datos}):'';
        });
        // console.log('-------DEPORTE-------');
        // console.log(filtroDeporte);
        // console.log('-------POLITICA-------');
        // console.log(filtroPolitica);
        // console.log('-------TECNOLOGIA-------');
        // console.log(filtroTech);
        // console.log('-------CULTURA-------');
        // console.log(filtroCUltura);

        //#3: Inyecar en DOM
        // ---------------noticia Deporte-------------------
        if(filtroDeporte.length > 0){
            //>>>>>Inyectar Deporte
            let elemento = '';
            let newPrincipal = '';
            filtroDeporte.forEach(noticia=>{
                let idnoticia = noticia.datos.id;
                let {titulo,redactor,fecha,parafos,categoria,imgPortada} = noticia.datos.noticia;

                if(newPrincipal == ''){
                    newPrincipal = `
                          <div class="whats-news-single mb-40 mb-40">
                            <div class="whates-img">
                                <img src="./assets/img/gallery/load_img.jpg" alt="" class="img-noticia-filtro" id="${imgPortada}">
                            </div>
                            <div class="whates-caption">
                                <h4>
                                    <a href="./noticia.html?news=${idnoticia}">
                                       ${titulo}
                                    </a>
                                </h4>
                                <span>
                                    by ${redactor}   -   ${fecha}
                                </span>
                                <p>
                                    ${parafos[0].texto.split(' ').slice(0,25).join(' ')}...
                                </p>
                            </div>
                        </div>
                    `;                   

                }

                else if(newPrincipal != ''){
                    elemento += `
                        <div class="col-xl-12 col-lg-6 col-md-6 col-sm-10">
                            <div class="whats-right-single mb-20">
                                <div class="whats-right-img">
                                  <img src="./assets/img/gallery/load_img.jpg" alt="" class="w-100 img-noticia-filtro"
                                  style="height:104px;width:124px;" id="${imgPortada}">
                                </div>
                                <div class="whats-right-cap">
                                    <span class="colorb">${categoria}</span>
                                    <h4>
                                        <a href="./noticia.html?news=${idnoticia}">
                                            ${titulo}
                                        </a>
                                    </h4>
                                    <p>${fecha}</p>
                                </div> 
                            </div>
                        </div>
                    `
                }
                
            });

            deportePrincipal.innerHTML = newPrincipal;
            navDeporte.innerHTML = elemento;
        }
        // --------------- Noticia Politica-------------------
        if(filtroPolitica.length > 0){
            //>>>>>Inyectar Deporte
            let elemento = '';
            let newPrincipal = '';
            filtroPolitica.forEach(noticia=>{
                let idnoticia = noticia.datos.id;
                let {titulo,redactor,fecha,parafos,categoria,imgPortada} = noticia.datos.noticia;

                if(newPrincipal == ''){
                    newPrincipal += `
                          <div class="whats-news-single mb-40">
                            <div class="whates-img">
                                <img src="./assets/img/gallery/load_img.jpg" alt="" class="img-noticia-filtro" id="${imgPortada}">
                            </div>
                            <div class="whates-caption">
                                <h4>
                                    <a href="./noticia.html?news=${idnoticia}">
                                       ${titulo}
                                    </a>
                                </h4>
                                <span>
                                    by ${redactor}   -   ${fecha}
                                </span>
                                <p>
                                    ${parafos[0].texto.split(' ').slice(0,25).join(' ')}...
                                </p>
                            </div>
                        </div>
                    `;                   

                }

                else if(newPrincipal != ''){
                    elemento += `
                        <div class="col-xl-12 col-lg-6 col-md-6 col-sm-10">
                            <div class="whats-right-single mb-20">
                                <div class="whats-right-img">
                                  <img src="./assets/img/gallery/load_img.jpg" alt="" class="w-100 img-noticia-filtro"
                                  style="height:104px;width:124px;" id="${imgPortada}">
                                </div>
                                <div class="whats-right-cap">
                                    <span class="colorb">${categoria}</span>
                                    <h4>
                                        <a href="./noticia.html?news=${idnoticia}">
                                            ${titulo}
                                        </a>
                                    </h4>
                                    <p>${fecha}</p>
                                </div> 
                            </div>
                        </div>
                    `
                }
                
            });
            // cs
            // console.log('--------Principal------');
            // console.log(newPrincipal);
            // console.log('------General-------');
            // console.log(elemento);
            
            politicaPrincipal.innerHTML = newPrincipal;
            navPolitica.innerHTML = elemento;    
        }
        // ----------------Notocia Tecnologia--------------------
        if(filtroTech.length > 0){
            //>>>>>Inyectar Deporte
            let elemento = '';
            let newPrincipal = '';
            filtroTech.forEach(noticia=>{
                let idnoticia = noticia.datos.id;
                let {titulo,redactor,fecha,parafos,categoria,imgPortada} = noticia.datos.noticia;

                if(newPrincipal == ''){
                    newPrincipal += `
                          <div class="whats-news-single mb-40">
                            <div class="whates-img">
                                <img src="./assets/img/gallery/load_img.jpg" alt="" class="img-noticia-filtro" id="${imgPortada}">
                            </div>
                            <div class="whates-caption">
                                <h4>
                                    <a href="./noticia.html?news=${idnoticia}">
                                       ${titulo}
                                    </a>
                                </h4>
                                <span>
                                    by ${redactor}   -   ${fecha}
                                </span>
                                <p>
                                    ${parafos[0].texto.split(' ').slice(0,25).join(' ')}...
                                </p>
                            </div>
                        </div>
                    `;                   

                }

                else if(newPrincipal != ''){
                    elemento += `
                        <div class="col-xl-12 col-lg-6 col-md-6 col-sm-10">
                            <div class="whats-right-single mb-20">

                                <div class="whats-right-img">
                                  <img src="./assets/img/gallery/load_img.jpg" alt="" class="img-noticia-filtro w-100"
                                  style="height:104px;width:124px;" id="${imgPortada}">
                                </div>

                                <div class="whats-right-cap">
                                    <span class="colorb">${categoria}</span>
                                    <h4>
                                        <a href="./noticia.html?news=${idnoticia}">
                                            ${titulo}
                                        </a>
                                    </h4>
                                    <p>${fecha}</p>
                                </div>

                            </div>
                        </div>
                    `
                }
                
            });
            // cs
            // console.log('--------Principal------');
            // console.log(newPrincipal);
            // console.log('------General-------');
            // console.log(elemento);
            
            techPrincipal.innerHTML = newPrincipal;
            navTech.innerHTML = elemento;        
            
        }
        // ----------------Noticia Cultura---------------------
        if(filtroCUltura.length > 0){
            //>>>>>Inyectar Deporte
            let elemento = '';
            let newPrincipal = '';
            filtroCUltura.forEach(noticia=>{
                let idnoticia = noticia.datos.id;
                let {titulo,redactor,fecha,parafos,categoria,imgPortada} = noticia.datos.noticia;

                if(newPrincipal == ''){
                    newPrincipal += `
                          <div class="whats-news-single mb-40">
                            <div class="whates-img">
                                <img src="./assets/img/gallery/load_img.jpg" alt="" class="img-noticia-filtro" id="${imgPortada}">
                            </div>
                            <div class="whates-caption">
                                <h4>
                                    <a href="./noticia.html?news=${idnoticia}">
                                       ${titulo}
                                    </a>
                                </h4>
                                <span>
                                    by ${redactor}   -   ${fecha}
                                </span>
                                <p>
                                    ${parafos[0].texto.split(' ').slice(0,25).join(' ')}...
                                </p>
                            </div>
                        </div>
                    `;                   

                }

                else if(newPrincipal != ''){
                    elemento += `
                        <div class="col-xl-12 col-lg-6 col-md-6 col-sm-10">
                            <div class="whats-right-single mb-20">
                                <div class="whats-right-img">
                                  <img src="./assets/img/gallery/load_img.jpg" alt="" class="img-noticia-filtro w-100"
                                  style="height:104px;width:124px;" id="${imgPortada}">
                                </div>
                                <div class="whats-right-cap">
                                    <span class="colorb">${categoria}</span>
                                    <h4>
                                        <a href="./noticia.html?news=${idnoticia}">
                                            ${titulo}
                                        </a>
                                    </h4>
                                    <p>${fecha}</p>
                                </div> 
                            </div>
                        </div>
                    `
                }
                
            });
            // cs
            // console.log('--------Principal------');
            // console.log(newPrincipal);
            // console.log('------General-------');
            // console.log(elemento);
            
            culturaPrincipal.innerHTML = newPrincipal;
            navCultura.innerHTML = elemento;           
            
        }
        //-----------------Actualizar Boton Vermas--------
        let btnNavegacion = document.querySelectorAll('.nav-item');
        btnNavegacion.forEach(navActive=>{
            navActive.addEventListener('click',()=>{
                console.log();
                let seccion = navActive.getAttribute('href').split('-')[1];
                actualizaBtnVerMas(seccion)
            })
        })
        function actualizaBtnVerMas(seccion){
            seccion = seccion == 'tech'?'tecnologia':seccion;
            document.querySelector('.nav-card-section').textContent = seccion
            let urlSeccionActiva = document.querySelector('.url-seccion');
            urlSeccionActiva.setAttribute('href',`./noticias.html?section=${seccion}`)
        } 
        //cargar Imagenes
        loadImg ? cargarImg('index','noticias-categoria'):''; 

        
    // ------>SECCION#3. NOTICIAS MAS RECINTES
        // Las Noticias recientes-Noticias subidas hace menos de 10 dias
        // Maximo 1(Principal) + 5 Pequexo

        let filtroRecientes = [];
        noticiasLocal.forEach(filtro=>{
            let fechaNoticia = filtro.noticia.fecha;
            let res = checkReciente(fechaNoticia);             
            res && filtroRecientes.length <= 6 ? filtroRecientes.push(filtro) : '';
        })
        //inyectar noticia reciente;
        inyectarNewReciente()

        //Check Noticias si es reciente
        function checkReciente(fechaNoticia){ 
            let reciente = false; 
            let noticia = fechaNoticia.split('-')//fehca de la noticia
            let hoy = fechaHoy() .split('-')//fecha actual
            
            // #1.comparar axos
            if(Number(noticia[0]) == Number(hoy[0])){
                //#2meses iguales
                if(Number(noticia[1]) == Number(hoy[1])){
                    (Number(hoy[2]) - Number(noticia[2])) <= 10 ? reciente = true : '';
                }
                //meses no iguales
                else if(Number(noticia[1]) != Number(hoy[1])){
                    ((Number(hoy[2])) + (30-Number(noticia[2]))) <= 10 ? reciente = true  : '';
                }
            }
            return reciente;
        }

        //inyectar Noticia reciente
        function inyectarNewReciente(){
            let componente = '';
            let recietePrincipal = '';
            filtroRecientes.forEach(reciente =>{
                let idNoticia = reciente.id;
                let {categoria, titulo, redactor, fecha, imgPortada} = reciente.noticia;

                if(recietePrincipal == ''){
                    recietePrincipal = `
                        <img src="./assets/img/gallery/load_img.jpg" class="img-reciente" id=${imgPortada}>
                        <div class="most-recent-cap">
                            <span class="bgbeg">${categoria}</span>
                            <h4>
                                <a href="./noticia.html?news=${idNoticia}">
                                   ${titulo}<br>
                                </a>
                            </h4>
                            <p>${redactor}  | ${fecha}</p>
                        </div>
                    `
                }
                else{
                    componente +=`
                        <div class="most-recent-single">
                            <div class="most-recent-images">
                                <img id=${imgPortada} src="./assets/img/gallery/load_img.jpg" class="w-100 img-reciente"
                                  style="height:104px;width:124px;">
                            </div>
                            <div class="most-recent-capt">
                                <h4>
                                    <a href="./noticia.html?news=${idNoticia}">${titulo}</a>
                                </h4>
                                <p>${redactor}  |  ${fecha}</p>
                            </div>
                        </div>
                    `
                }
            });

            // inyectar componentes
            document.querySelector('.most-recent-img').innerHTML = recietePrincipal
            document.querySelector('.new-reciente-miniatura').innerHTML = componente

            //cargar Imagenes
            loadImg ? cargarImg('index','reciente'):'';
        }


    // ------>Seccion#4. Noticias mas populares    
}
