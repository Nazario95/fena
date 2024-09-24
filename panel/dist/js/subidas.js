import { alerta, cambioRealizado, congelarBtn, fechaHoy, idgenerator} from "./app.js";
import { actualizar, guardarColeccion, subirMultimedia } from "./firebase.js";
// >>>>>>>>>>>Mostrar Secciones 
    // Verificar y mostrar secicion actual
    let seccionUrl = new URLSearchParams(location.search)
    let seccion; //guardar seccion actual

    seccionUrl.size == 0 ?seccion = 'noticia':'';
    seccionUrl.size == 0 ? mostrarSeccion('noticia'):checkParam();
    function checkParam(){   
        seccionUrl.forEach((value,key)=>{
            if(key == 'upload'){
                seccion = value;
                // console.log(value)
                value == 'trofeos'? mostrarSeccion('funcion-indisponible'):
                value == 'nadador'? mostrarSeccion('funcion-indisponible'):
                mostrarSeccion(value); 
            }       
        })
    }
    function mostrarSeccion(seccion){
        document.getElementById(`seccion-subir-${seccion}`).classList.remove('d-none')
    }

// >>>>>>>>>>>>subir noticia
    if(seccion == 'noticia'){ 
        let totalParafos = 1;        
        let updte = false; 
        let idNoticia;

        //check edit option
        seccionUrl.forEach((value,key)=>{
            // console.log(key)
            if(key == 'edit' && value!=''){
                updte = true;
                idNoticia  = value;
                editarNoticia(value);
            }           
        })
        
        //>>>>>>Control de paginador
        //Selec total parrafos
        let textoPrrafos = document.getElementById('total-parrafos'); 
        //btn guardar parrafo  
        let controlPaginador = document.querySelector('.control-paginador');  

        // console.log(totalParafos);         
        textoPrrafos.addEventListener('change',()=>{
            //Noticia de un solo parrafo
            if(updte == true){                
                alerta('warning','No se puede agregar mas parrafos a esta noticia');
                // console.log(textoPrrafos.value);
                textoPrrafos.value = totalParafos;
            } 
            //Noticia de Muchos parrafos
            else{
                let confirmaCambio = confirm('(CUIDADO). Al Cambiar el numero de parrafos, toda al informacion introducida en los parrafos anteriormente sera eliminada');

                if(confirmaCambio && updte==false){
                    borrarParrafos();
                    //Mostrar paginadores
                    totalParafos = textoPrrafos.value;                
                    // console.log(textoPrrafos.value)
                    if(totalParafos > 1){
                        //mostrar titulo
                        document.querySelector('.titulo-info-parrafo').classList.remove('d-none');
                        //crear paginadores
                        let componentePag = `<small class="h-25 p-1 bg-danger control-paginador pag-1" type="button" value="1">Guardar informacion del parrafo</small>`;
                        
                        for(let i=0;i<totalParafos;i++){
                            if(i==0){
                                componentePag += `
                                    <small class="text-light h-25 p-1 parafo-${i+1} bg-primary">${i+1}</small>
                                `;
                            }
                            else{
                                componentePag += `
                                    <small class="text-light h-25 p-1 parafo-${i+1} bg-dark">${i+1}</small>
                                `;
                            }                    
                        }
                        //mostrar paginador
                        document.getElementById('container-parrafos').classList.remove('d-none')
                        document.querySelector('.parafos-paginadores').innerHTML = componentePag; 
                        controlPaginador = document.querySelector('.control-paginador');               
                    }
                    else if(totalParafos <= 1){
                        //ocultar titulo
                        document.querySelector('.titulo-info-parrafo').classList.add('d-none');
                        //ocultar paginador
                        document.getElementById('container-parrafos').classList.add('d-none');
                    }

                    //Control del paginado
                    controlPaginador.addEventListener('click',()=>{                  
                        guardarInfoDepaginador()
                    });
                } 
            }                      
        });

        const btnSubirNoticia = document.getElementById('btn-subir-noticias');
        btnSubirNoticia.addEventListener('click',e=>{
            e.preventDefault();
            //check parrafos
            if(totalParafos > 1){
                chkParrafos(Number(totalParafos)) ?
                capturarDatos(updte,idNoticia,totalParafos):
                alerta('warning','completa el texto de los parrafos')
            }
            else if(totalParafos == 1){
                capturarDatos(updte,idNoticia,totalParafos)
            }           
        });
    

    //Guardar informacion de paginador
    function guardarInfoDepaginador(){
        let controlPaginador = document.querySelector('.control-paginador'); 
          //leer paginador actual
          let parfoActual = Number(controlPaginador.classList[4].split('-')[1]);
          // console.log(parfoActual)

          let siguienteParafo = confirm(`Cambiar a parrafo ${parfoActual+1}?. (ATENCION) No podras modificar la informacion introducida en el parrafo ${parfoActual}`);

          if(siguienteParafo){
              //Guardar en Local
              let subtituloParafo = document.getElementById('subtitul-noticia').value////
              let textoParrafo = document.getElementById('texto-parrado').value////

               //Generar formato de datos
               let datosParrafos = {
                  subitulo:subtituloParafo,
                  texto:textoParrafo
              }
              console.log(datosParrafos);
              //Guardar
              localStorage.setItem(`parafo-${parfoActual}`,JSON.stringify(datosParrafos));

              //Control de estado de paginadores
              if(document.querySelector(`.parafo-${parfoActual+1}`) != null){
                  //cambiar fondo parrafo anterior
                  document.querySelector(`.parafo-${parfoActual}`).classList.remove('bg-primary');
                  document.querySelector(`.parafo-${parfoActual}`).classList.add('bg-success');
                  //cambiar fondo parrafo actual
                  document.querySelector(`.parafo-${parfoActual+1}`).classList.remove('bg-dark');
                  document.querySelector(`.parafo-${parfoActual+1}`).classList.add('bg-primary');
                  //actualizar parafo selecionado
                  controlPaginador.classList.remove(`pag-${parfoActual}`);
                  controlPaginador.classList.add(`pag-${parfoActual+1}`);
                  //Borrar parrafos y subtitulo
                  document.getElementById('subtitul-noticia').value = '';
                  document.getElementById('texto-parrado').value = '';
                  //verificar si estamos editando
                  if(updte){
                      editParafoMultiple(false,'mostrar-parrafos',parfoActual+1)
                  }
              }
              if(document.querySelector(`.parafo-${parfoActual+1}`) == null){
                  //cambiar fondo parrafo actual
                  document.querySelector(`.parafo-${parfoActual}`).classList.add('bg-success');
                  //Bloqueamos paginador
                  controlPaginador.textContent = 'Completado';
                  controlPaginador.classList.remove('bg-danger');
                  controlPaginador.removeAttribute('type');
                  controlPaginador.classList.add('bg-dark');
                  controlPaginador.classList.remove('control-paginador');
              }
          }
    }
    function capturarDatos(updte,idNoticia,totalParafos){  
        // console.log(JSON.parse(localStorage.getItem('parafo-1')))
        console.log(totalParafos);       
        //----Capturar parrafos
            let parrafos = []
            if(localStorage.getItem('parafo-1') != null && totalParafos > 1){
                for(let i=1;i<=10;i++){
                    let parrafo = localStorage.getItem(`parafo-${i}`);
                    if(parrafo != null){
                        parrafos.push(JSON.parse(parrafo));
                    }
                }
                console.log(parrafos);
            }
            
        //Capturar valores
            //datos-noticia
            let imgPortada = document.getElementById('noticia-img-portada').files[0];
            let tituloNoticia = document.getElementById('noticia-titulo-principal').value;
            let fechaNoticia = document.getElementById('fecha-noticia').value;
            let categoria = document.getElementById('noticia-categoria').value;
            //parrafos
            let imgParafo = document.getElementById('img-parrafo').files[0]////
            let subtituloParafo;
            let textoParrafo;

            if(totalParafos == 1){
                subtituloParafo = document.getElementById('subtitul-noticia').value
                textoParrafo = document.getElementById('texto-parrado').value

                parrafos[0] = {
                    subitulo:subtituloParafo,
                    texto:textoParrafo
                } 
            }           
            // let totalParrafos = chkParrafos(parrafos,imgParafo,'final');
            
            //lugar de noticia
            let pais = document.getElementById('noticia-pais').value;
            let provincia = document.getElementById('noticia-provincia').value;
            let ciudad = document.getElementById('noticia-ciudad').value;
            let bario = document.getElementById('noticia-bario').value;
            //reporteo y redactor
            let reportero = document.getElementById('noticia-reportero').value;
            let redactor = document.getElementById('noticia-redactor').value;

            // verificar informacion
            imgPortada == undefined && updte == false? alerta('warning','Selecione una imagen de portada'):
            tituloNoticia == '' && updte == false? alerta('warning','Escriba un titulo de portada') : 
            // parrafos.length == 0  && updte == false? alerta('warning','No se ha detectado nigun parafo') :  
            categoria == '0'    && updte == false? alerta('warning','Selecione la categoria de la noticia') : 
            reportero == ''     && updte == false? alerta('warning','Falta el nombre del reportero') : 
            redactor == ''      && updte == false? alerta('warning','Falta el nombrel del redactor') : subirNoticia(updte,idNoticia);    
            
            // subirNoticia(updte,idNoticia);
            
            //subir noticia
            function subirNoticia(updte,idNoticia){
                //bloquear btn subir parrafo
                document.getElementById('btn-subir-noticias').setAttribute('disabled','true');
                removeDnone('class','efx-carga-1');
                let arrImg = [
                    {
                        imgFile:imgPortada==undefined  ? 'undefined' : imgPortada,
                        nomImg:imgPortada==undefined ? '' : `img_por-${idgenerator()}`
                    },
                    {
                        imgFile:imgParafo==undefined ? 'undefined' : imgParafo,
                        nomImg:imgParafo==undefined ? '' : `img_par-${idgenerator()}`
                    }
                ]

                //formatear datos
                let editData = updte == true ? JSON.parse(localStorage.getItem('editar')) : '';
                //guardar img parrafo
                if(updte == true ){
                    parrafos[0].imgParafo = editData.parafos[0].imgParafo;
                }
                else{
                    parrafos[0].imgParafo = arrImg[1].nomImg;
                }               

                let noticia = {
                    titulo:tituloNoticia,
                    imgPortada:updte==true?editData.imgPortada:arrImg[0].nomImg,
                    categoria:categoria,
                    fechaPublicacion:'undefined',
                    ubicacion:{
                            pais:pais,
                            provincia:provincia,
                            ciudad:ciudad,
                            barrio:bario
                        },
                    fecha:fechaNoticia,
                    reportero:reportero,
                    redactor:redactor,
                    parafos:parrafos,
                    publicar:false,
                    destacado:false
                }    
                console.log(noticia) 

                // subir noticia
                let ruta = 'noticias';
                let guardarNoticia = async()=>{
                    // console.log('idNoticia',idNoticia)
                    if(idNoticia){
                        let res = await actualizar('noticias',idNoticia,noticia);
                        res == undefined ? cambioRealizado('noticia',idgenerator()):'';
                        
                        !res ? alerta('error','hubo un problema al actualizar los datos'): 
                        alerta('success','datos actualizados correctame...(subiendo imagenes)')
                        subirImg();
                    }
                    else{
                        let res = await guardarColeccion(ruta,noticia);
                        !res ? alerta('error','hubo un problema al guardar los datos'): 
                        alerta('success','datos subidos correctame...(subiendo imagenes)');
                        res ? cambioRealizado('noticia',idgenerator()):'';
                        borrarParrafos();
                        subirImg();
                    }                    
                } 
                guardarNoticia()

                //subir imagenes
                function subirImg(){
                    if(updte==true){
                        let nomImg= JSON.parse(localStorage.getItem('editar'));
                        let arrImg = [
                            {
                                imgFile:imgPortada==undefined  ? 'undefined' : imgPortada,
                                nomImg:imgPortada==undefined ? '' : nomImg.imgPortada
                            },
                            {
                                imgFile:imgParafo==undefined ? 'undefined' : imgParafo,
                                nomImg:imgParafo==undefined ? '' : nomImg.parafos[0].imgParafo
                            }
                        ]
                        let contImgSubida = 0;
                        arrImg.forEach(img=>{
                            let {imgFile,nomImg} = img;                        
                            let initSubidaImg = async ()=>{
                                let res = await subirMultimedia(nomImg,imgFile,'img-noticia');
                                res ? console.log(res) : alerta('success', 'imganes subidas correctamente');
                                cambioRealizado('noticia',idgenerator());

                                let awaitMultimedia = setInterval(()=>{
                                    console.log('Subiendo img')
                                    if(localStorage.getItem('up_file') && contImgSubida < 2){
                                        contImgSubida++
                                        console.log('img ',contImgSubida,' subido')
                                        clearInterval(awaitMultimedia);
                                        localStorage.removeItem('up_file');
                                        // location.reload();
                                    }
                                    if(contImgSubida >= 2){
                                        localStorage.removeItem('editar');
                                        location.href='bd.html?db=noticia';
                                    }
                                },100);
                                
                            };
                            imgFile != undefined ? initSubidaImg() : '';                         
                        });
                    }

                    else{
                        let contImgSubida = 0
                        arrImg.forEach(img=>{                            
                            let {imgFile,nomImg} = img;   
                            console.log('subiendo imagen ==> ', nomImg)                     
                            let initSubidaImg = async ()=>{
                                let res = await subirMultimedia(nomImg,imgFile,'img-noticia');
                                // console.log(res)
                                res ? console.log(res) : '';

                                let awaitMultimedia = setInterval(()=>{
                                    console.log('img ',contImgSubida,' subido')
                                    if(localStorage.getItem('up_file') && contImgSubida < 2){
                                        contImgSubida++
                                        clearInterval(awaitMultimedia);
                                        localStorage.removeItem('up_file');
                                    }
                                    if(contImgSubida >= 2){
                                        if(localStorage.getItem('editar')){
                                            localStorage.removeItem('editar');
                                        }                                        
                                        location.reload();
                                    }
                                },100);
                            };
                            imgFile != undefined ? initSubidaImg() : '';                         
                        });
                        
                    }  
                                     
                }
            }
    }

    //------->Acciones de parrafos
        function chkParrafos(totalCheck){
            let parrafosCompletados = false;
            for(let i=1;i<=totalCheck;i++){
                localStorage.getItem(`parafo-${i}`) == null ? parrafosCompletados = false:
                parrafosCompletados = true;
                // console.log(parrafosCompletados)
            }            
            return parrafosCompletados;
        }

        function borrarParrafos(){
            for(let i=1;i<=10;i++){
                if(localStorage.getItem(`parafo-${i}`)){
                    localStorage.removeItem(`parafo-${i}`)
                }
            }
        }

    //------> EDITAR NOTICIA
    function editarNoticia(idNoticia){
        // console.log('editar')
        let datosEditacion = JSON.parse(localStorage.getItem('editar'));
        console.log(datosEditacion)
        let {categora,fecha,parafos,redactor,reportero,titulo,ubicacion} = datosEditacion      

        //insertar en los inputs
        document.querySelector('.title-subir-noticia').textContent = 'Editar Noticia'
        // document.getElementById('noticia-img-portada').files[0];
        document.getElementById('noticia-titulo-principal').value = titulo;
        document.getElementById('fecha-noticia').value = fecha;
        document.getElementById('total-parrafos').value = parafos.length;
        totalParafos = parafos.length
        // document.getElementById('noticia-categoria').value = categora;
        //parrafos
        // document.getElementById('img-parrafo').files[0]
        document.getElementById('subtitul-noticia').value = parafos[0].subitulo;
        //lugar de noticia
        document.getElementById('noticia-pais').value = ubicacion.pais;
        document.getElementById('noticia-provincia').value  = ubicacion.provincia;
        document.getElementById('noticia-ciudad').value  = ubicacion.ciudad;
        document.getElementById('noticia-bario').value  = ubicacion.barrio;
        //reporteo y redactor
        document.getElementById('noticia-reportero').value = redactor;
        document.getElementById('noticia-redactor').value = reportero;
        //inyectar parrafos
        editParafoMultiple(parafos,'crear-paginador');

        document.querySelector('#btn-subir-noticias').innerHTML = `
        Actualizar Noticia
        <img class="efx-carga-1 d-none" src="./dist/img/load.svg" alt="" style="width:1.2rem">
        `;

        document.querySelector('#btn-subir-noticias').classList.add('btn-actualizar-noticia');
        document.querySelector('#btn-subir-noticias').classList.add(idNoticia);
    }

    function editParafoMultiple(parafos,accion,seccionParafo){
        console.log(parafos)
        if(parafos && parafos.length == 1){
            document.getElementById('texto-parrado').value = parafos[0].texto;
        }

        else if(accion == 'crear-paginador'){
            //crear paginadores
            crearPaginadores(parafos.length);
            //inyectar texto de parrafos
            guardarDatosEnLocal('parrafos',parafos);
            editParafoMultiple(undefined,'mostrar-parrafos',1);
        }

        // console.log(seccionParafo)
        // !seccionParafo ? seccionParafo = 1 :'';
        // console.log(seccionParafo)
        if(accion == 'mostrar-parrafos'){
            inyectarParafo(seccionParafo)

            function inyectarParafo(num){
                let getparafo = localStorage.getItem(`parafo-${num}`) ? 
                JSON.parse(localStorage.getItem(`parafo-${num}`)) : false;

                if(getparafo == false){
                    alerta('error', `Error al obtener parrafo numero ${num}`);
                }
                else{
                    document.getElementById('subtitul-noticia').value = getparafo.subitulo;
                    document.getElementById('texto-parrado').value = getparafo.texto;
                }                
            }
        }        
    }

    //>>>>>>>>>>>>>>>>FUNCIONES COMUNES - SECCION SUBIDAS
    // crear paginadores
    function removeDnone(type,link){
        
        if(type == 'id'){
            document.getElementById(`${link}`).classList.remove('d-none');
        }
        else if(type == 'class'){
            let elemento  = document.getElementsByClassName(`${link}`);
            if(typeof elemento == 'object'){
                for(let i=0;i<elemento.length;i++){
                    elemento[i].classList.remove('d-none');
                }
            }
            else{
                elemento.classList.remove('d-none');
            }
            
        }        
    }

    function crearPaginadores(totalParafos){
        let controlPaginador = document.querySelector('.control-paginador');  
        //mostrar titulo
        document.querySelector('.titulo-info-parrafo').classList.remove('d-none');
        //crear paginadores
        let componentePag = `<small class="h-25 p-1 bg-danger control-paginador pag-1" type="button" value="1">Guardar informacion del parrafo</small>`;
        
        for(let i=0;i<totalParafos;i++){
            if(i==0){
                componentePag += `
                    <small class="text-light h-25 p-1 parafo-${i+1} bg-primary">${i+1}</small>
                `;
            }
            else{
                componentePag += `
                    <small class="text-light h-25 p-1 parafo-${i+1} bg-dark">${i+1}</small>
                `;
            }                    
        }
        //mostrar paginador
        document.getElementById('container-parrafos').classList.remove('d-none')
        document.querySelector('.parafos-paginadores').innerHTML = componentePag; 
        controlPaginador = document.querySelector('.control-paginador');  

        //escuchar vento click paginador
        controlPaginador.addEventListener('click',()=>{                  
            guardarInfoDepaginador()
        });
    }    
    //guradar en local
    function guardarDatosEnLocal(tipo, datos){
        if(tipo =='parrafos'){
            let i = 1;
            datos.forEach(parafo=>{
                guardarObj(parafo,`parafo-${i}`);
                i++;
            });            
        }

        function guardarObj(datos,nombre){
            localStorage.setItem(nombre,JSON.stringify(datos));
        }
    }

}
//>>>>>>>>>>>>>Subir Personal
    if(seccion == 'personal'){ 
        let updte = false; 
        let idNoticia;
        //check edit option
        seccionUrl.forEach((value,key)=>{
            // console.log(key)
            if(key == 'edit' && value!=''){
                updte = true;
                idNoticia  = value;
                editarPersonal(value)
            }           
        })
         
        // console.log('seccion personal')
        const btnSubirPersonal = document.getElementById('subir-personal');
        btnSubirPersonal.addEventListener('click',e=>{
            e.preventDefault();            
            subirPersonal(updte,idNoticia)
        })
    }

    function subirPersonal(updte,idNoticia){
        // console.log('subiendo personal')
         //datos-personal
         let imgPersonal = document.getElementById('personal-img').files[0];
         let nombre = document.getElementById('personal-nombre').value;
         let apellidos = document.getElementById('personal-apellidos').value;
         let cargo = document.getElementById('personal-funcion').value;
         let masInfo = document.getElementById('personal-mas-info').value;
        
        //verificar datos
        if(updte == false){
            imgPersonal == undefined ? alerta('warning','Selecione una imagen del personal'):
            nombre == ''? alerta('warning','Escriba un nombre para el personal') : 
            apellidos == ''? alerta('warning','escriba un apellidos para el personal') :  
            cargo == ''? alerta('warning','Especifique el cargo') : formatearDatos();
        }
        else{formatearDatos()}

        function formatearDatos(){
            congelarBtn('#subir-personal');

            let {nomImg} = localStorage.getItem('editar') ? JSON.parse(localStorage.getItem('editar')) :'';
            let codImg = nomImg? nomImg.split('_')[1]:'';

            let img = [
                imgPersonal,
                updte==false? `personal_${idgenerator()}`:`personal_${codImg}`
            ]
            let datosPersonal = {
                // id:'xxxxx',
                nomImg:img[1],
                nombre:nombre,
                apellidos:apellidos,
                cargo:cargo,
                info:masInfo==''?'undefined':masInfo
             }
            //   console.log(datosPersonal) 
            //   console.log(img) 
             updte == false ? 
             subirDatosPersonal(datosPersonal,img) :
             actualizarDatosPersonal(datosPersonal,img) 
        } 
         
        function subirDatosPersonal(datosPersonal,img){
           let initSubidaDatos = async()=> {
                await guardarColeccion('personal',datosPersonal);
                await cambioRealizado('personal',idgenerator());
                initSubidaImg()
           } 

           let initSubidaImg = async ()=>{
                console.log('subiendo img personal')
                await subirMultimedia(img[1],img[0],'img-personal');
                let awaitMultimedia = setInterval(()=>{
                    console.log('Subiendo img')
                    if(localStorage.getItem('up_file')){
                        clearInterval(awaitMultimedia);
                        localStorage.removeItem('up_file');
                        //borrar info edicion local, si hay
                        if(localStorage.getItem('editar')){
                            localStorage.removeItem('editar')
                        }                        
                        location.reload();
                    }
                },100);
           }
           initSubidaDatos()
        }

        function actualizarDatosPersonal(datosPersonal,img){
            let initUpdate = async ()=>{
                await actualizar('personal',idNoticia,datosPersonal);
                await cambioRealizado('personal',idgenerator());
                if(img[0] != undefined){
                    console.log('Actualizando img...');
                    initSubidaImg()
                }
            }   
            initUpdate();

            let initSubidaImg = async ()=>{
                console.log('subiendo img personal')
                await subirMultimedia(img[1],img[0],'img-personal');
                alerta('success','completado') ;
                let awaitMultimedia = setInterval(()=>{
                    console.log('Subiendo img')
                    if(localStorage.getItem('up_file')){
                        clearInterval(awaitMultimedia);
                        localStorage.removeItem('up_file');
                        localStorage.removeItem('editar')
                        location.href='bd.html?db=personal';
                    }
                },100);           
           }
        }
    }

     function editarPersonal(idData){
        let {nombre,apellidos,cargo,info,nomImg} = JSON.parse(localStorage.getItem('editar')) 
        document.querySelector('.txt-subir-personal').textContent =' Editar Personal'
        document.getElementById('personal-nombre').value = nombre;
        document.getElementById('personal-apellidos').value = apellidos;
        document.getElementById('personal-funcion').value = cargo;
        document.getElementById('personal-mas-info').value = info=='undefined'?'':info;
        document.getElementById('subir-personal').innerHTML = `
            Actualizar Personal
            <img src="./dist/img/load.svg" style="width:1.3rem" class="cargando d-none">
        `;
        document.getElementById('subir-personal').classList.add(nomImg.split('_')[1]);
        document.getElementById('subir-personal').classList.add(idData);
     }


//>>>>>>>>>Subir comunicado
    if(seccion == 'comunicado'){ 
        let edit = false; 
        let idEdit;

        seccionUrl.forEach((value,key)=>{
            key == 'edit' && value!='' ? edit = true : '';
            key == 'edit' && value!='' ? idEdit = value : '';
            key == 'edit' && value!='' ? editarComunicado(value) : '';
        })
        // console.log('seccion comunicado')
        const btnSubirPersonal = document.getElementById('subir-comunicado');
        btnSubirPersonal.addEventListener('click',e=>{
            e.preventDefault();
            // console.log(btnSubirPersonal)
            subirComnuicado(edit,idEdit)
        })
    }
    function subirComnuicado(edit,idEdit){
        let comunicado = document.getElementById('comunicado').value;
        let redactor = document.getElementById('comunicado-redactor').value;
        //verificar informacion
        comunicado == ''? alerta('warning','Escriba el comunicado primero') : formatearDatos();

        function formatearDatos(){
            let datosComunicado = {
                comunicado:comunicado,
                redactor:redactor,
                fecha:fechaHoy(),
                publicar:false
            }
            // console.log(datosComunicado);
            initSubidaComunicado(datosComunicado);
        }

        async function initSubidaComunicado(datos){
            if(edit){
                await  actualizar('comunicados',idEdit,datos)
                await cambioRealizado('aviso',idgenerator());
                alerta('success','completado');
                //limpiar inputs
                localStorage.removeItem('editarComunicado');
                setTimeout(() => {
                    location.href ='./bd.html?db=comunicado';
                }, 500);
            }
            else if(edit == false){
                await guardarColeccion('comunicados',datos);
                alerta('success','completado');
                //limpiar inputs
                recargar()
            }
           
        }      
    }
    function editarComunicado(id){
        //capturar datos de comunicado
        let {comunicado,redactor} = JSON.parse(localStorage.getItem('editarComunicado'));
        //inyectar datos en DOM
        document.getElementById('comunicado').value = comunicado;
        document.getElementById('comunicado-redactor').value = redactor;
        document.getElementById('subir-comunicado').classList.add(id);
    }

//>>>>>>>>>Subir publicidad
    if(seccion == 'publicidad'){          
        // console.log('seccion comunicado')
        const btnSubirPersonal = document.getElementById('subir-publicidad');
        btnSubirPersonal.addEventListener('click',e=>{
            e.preventDefault();
            subirPublicidad();
        });
    }
    function subirPublicidad(){
        let imgPub = document.getElementById('publicidad-img').files[0]
        let empresa = document.getElementById('empresa-publicidad').value;
        let slogan = document.getElementById('slogan-publicidad').value;
        //verificar datos
        imgPub == undefined? alerta('warning','Selecione una imagen') : 
        empresa == '' ? alerta('warning','Indicar empresa o persona que solicita publicidad') :
        formatearDatos();

        function formatearDatos(){
            congelarBtn('#subir-publicidad');
            let datosImgPub = [imgPub,`pub-${idgenerator()}`]
            let datosPub = {
                nomImg:datosImgPub[1],
                empresa:empresa,
                slogan:slogan
            }
            // console.log(datosPub)
            subirDatosPub(datosPub,datosImgPub)
        }

        async function subirDatosPub(datosPub,datosImgPub){
            let res = await guardarColeccion('publicidad',datosPub)
            await cambioRealizado('pub',idgenerator());
            !res ? alerta('error','hubor un problema') : subirImgPub(datosImgPub)
        }

        async function  subirImgPub(datos) {
            let res = await subirMultimedia(datos[1],datos[0],'img-publicidad');
            res != undefined ? alerta('error al subir la imagen'):
            alerta('success','subida de publicidad completa');

            let awaitMultimedia = setInterval(()=>{
                console.log('Subiendo img')
                if(localStorage.getItem('up_file')){
                    clearInterval(awaitMultimedia);
                    localStorage.removeItem('up_file');
                    location.reload();
                }
            },100);
        }
    }