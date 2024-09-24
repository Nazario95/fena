import { alerta, cambioRealizado, fechaHoy, idgenerator, msgSys } from "./app.js"
import { coleccionDatos, actualizar, obtenerDoc, borrar, borrarMultimedia, downMultimedia } from "./firebase.js";

// >>>>>>>>>>>Mostrar Secciones 
    // Verificar y mostrar secicion actual
    let seccionUrl = new URLSearchParams(location.search)
    let seccion; //guardar seccion actual

    seccionUrl.size == 0 ?seccion = 'noticia':'';
    seccionUrl.size == 0 ? mostrarSeccion('noticia'):checkParam();

    function checkParam(){   
        seccionUrl.forEach((value,key)=>{
            seccion = value;
            // console.log(value)
            value == 'trofeos'? mostrarSeccion('indisponible'):
            value == 'nadador'? mostrarSeccion('indisponible'):
            mostrarSeccion(value);        
        })
    }
    function mostrarSeccion(seccion){
        document.getElementById(`seccion-bd-${seccion}`).classList.remove('d-none')
    }

//>>>>>>>>>>seccion noticia
if(seccion == 'noticia'){
    //GLOBALES: insertar valores despues de crear tablas
    let btnsPrevisualizar;
    let btnDestacados;
    let btnBorrar;
    let btnEditar;

    //----->INYECTAR TABLA NOTICIAS
    let coleccionNoticias = async () =>{
        let res = await coleccionDatos('noticias');
            res.empty == true ? alerta ('warning','No hay publicidad disponible'):
            formatDatos(res);

            // console.log('vacio? ',res.empty)
            // console.log('total doc ',res.size)
            // console.log('doc ',res.docs)
    }
    coleccionNoticias();

    function formatDatos(noticias){
        let compNoticia='';
        let totalNoticias = noticias.size

        noticias.docs.forEach(noticia=>{
            // console.log(noticia.data())
            let {fecha,redactor,categoria,titulo,publicar,destacado, imgPortada} = noticia.data()
            compNoticia += `
                 <tr class="text-center">
                  <td>${totalNoticias}</td>
                  <td>${fecha}</td>
                  <td>${redactor}</td>
                  <td>${categoria}</td>
                  <td>${titulo}</td>
                  <td>
                    <button class="btn-publicar btn btn-${publicar?'success':'warning'} ${noticia.id}" data-toggle="modal" data-target="#${publicar?'ocultar-noticia':'publicar-noticia'}">
                      ${publicar?'Publicado':'No Publicado'}
                    </button>                    
                  </td>
                  <td>
                    <button class="btn btn-success btn-previsualizar ${noticia.id}" data-toggle="modal" data-target="#previsualizar-noticia">
                      <i class="fas fa-eye"></i>
                    </button>
                  </td>
                  <td>                    
                    <input type="checkbox" id="destacado" class="btn-destacado ${noticia.id}" ${destacado==true?'checked':''}>
                    <label for="">Destacada</label>
                  </td>
                  <td>
                    <button class="btn btn-danger btn-borrar ${noticia.id} ${imgPortada.split('-')[1]}">
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                  <td>
                    <button class="btn btn-editar btn-primary ${noticia.id}">
                      <i class="fa fa-edit"></i>
                    </button>
                  </td>
                </tr>
            `;
            totalNoticias--
        });

        //inyectar tabla noticias
        document.querySelector('#tabla-componente-noticias').innerHTML = compNoticia

         //Pubilicar noticia
        let btnPublicar = document.querySelectorAll('.btn-publicar');
        btnPublicar.forEach(publicar=>{
            publicar.addEventListener('click',()=>{
                // console.log(publicar.classList[3])
                let idNoticia = publicar.classList[3]
                document.querySelectorAll('.show-id').forEach(show=>{show.textContent = idNoticia})
            })
        })

        //Previsualizar
        btnsPrevisualizar = document.querySelectorAll('.btn-previsualizar');
        btnsPrevisualizar.forEach(preview=>{
            preview.addEventListener('click',()=>{
                // console.log(preview)
                previsualizar(preview)
            })
        });
        //CheckBox Destacados
        btnDestacados = document.querySelectorAll('.btn-destacado');
        let totalDestacado = 0
        btnDestacados.forEach(btn=>{
            btn.checked? totalDestacado++:'';
            btn.addEventListener('change',()=>{
                // console.log(totalDestacado)
                // console.log(btn.classList[1])
                // console.log(btn.checked)
                if(totalDestacado < 5 || btn.checked == false){
                    let id = btn.classList[1];
                    let destacar = btn.checked
                    destacado(id, destacar, totalDestacado);
                }
                else if(totalDestacado >= 5 && btn.checked == true){                    
                    alerta('error','Solo se permite un maximo de 5 noticias destacadas')
                    btn.checked = false;
                }
                
            })
        })
        //Borrar
        btnBorrar = document.querySelectorAll('.btn-borrar');
        btnBorrar.forEach(borrar=>{
            borrar.addEventListener('click',()=>{
                borarNoticia(borrar);
            })
        })
        // btnEditar
        btnEditar = document.querySelectorAll('.btn-editar');
        btnEditar.forEach(edita=>{
            edita.addEventListener('click',()=>{
                editarNoticia(edita)
            })
        })
    }

    //------> CAMBIAR ESTADO DE PUBLICACION
    let btnPublicar = document.getElementById('publicar-noticia');
    let btnOcultar = document.getElementById('ocultar-noticia');
    btnPublicar.addEventListener('click', publicar)
    btnOcultar.addEventListener('click', ocultar)

    function publicar(){
        let inputIdNoticia = document.querySelector('.input-id-noticia').value;
        inputIdNoticia == '' ? alerta('warning','copia y pega el codigo en el formulario') :
        cambiarEstadoPublicacion(inputIdNoticia,true)
    }

    function ocultar(){
        let inputIdNoticia = document.querySelector('.input-id-noticia-ocultar').value;
        inputIdNoticia == '' ? alerta('warning','copia y pega el codigo en el formulario') :
        cambiarEstadoPublicacion(inputIdNoticia,false)
    }
    function cambiarEstadoPublicacion(idNoticia,publica){
        //publicar
        if(publica){
            document.querySelector('#publicar-noticia').setAttribute('disbled','true')
            document.querySelector('.txt-publicar').textContent = 'Publicando';
            document.querySelector('.show-cargando').classList.remove('d-none')            
        }
        //ocultar
        else{
            document.querySelector('#ocultar-noticia').setAttribute('disbled','true')
            document.querySelector('.txt-ocultar').textContent = 'Ocultando';
            document.querySelector('.show-cargando-ocultar').classList.remove('d-none')
        }

        let publicar = async ()=>{
            let res = await actualizar('noticias',idNoticia,{publicar:publica});            
            res == undefined ? guardarCambios('noticia'):msgSys(10);
        }
        publicar()
    }

    //--------->PREVISUALIZAR
    function previsualizar(data){
        // console.log(data.classList[3])
        let idoc = data.classList[3]
       let leerDoc = async ()=>{
            let res = await obtenerDoc('noticias',idoc);
            console.log(res.data());
            // let componente = '';
            let {titulo,parafos,imgPortada,redactor} = res.data();
            //crear contenedor de parrafos
            let elemntParafos = '';
            let parafoNum = 0;
            let imgPosition = Math.round(parafos.length / 2);
            let componetImgParrafo;
            let imgParrafo;
            console.log(imgPosition);
            parafos.forEach((parafo)=>{
                
                if(parafo.imgParafo != '' && parafo.imgParafo != undefined){
                    // console.log(parafo.imgParafo)
                    componetImgParrafo=`
                        <div class="d-flex justify-content-center mt-2 prev-img-parafo-container">
                            <img src="./dist/img/logo.png" alt="" class="w-25 prev-img-parafo" id="${parafo.imgParafo}">
                        </div>
                    `;
                }

                elemntParafos += `
                    ${(parafoNum) == imgPosition || parafos.length == 1 && componetImgParrafo != undefined? componetImgParrafo : ''}
                    <h4 class="color-texto-nm text-center mt-2 prev-subtitulo-${parafoNum+1}"></h4>
                    <p class="color-texto-nm text-center mt-2 prev-parrafo-${parafoNum+1}"></p>
                `;
                parafoNum++;
            });
            document.querySelector('.container-parrafos').innerHTML = elemntParafos;
            // inyectar parrafos
            parafoNum = 0;
            
            parafos.forEach(parafo=>{
                parafoNum++
                // console.log(document.querySelector(`.prev-parrafo-${parafoNum}`))
                document.querySelector(`.prev-img-parafo`)?
                imgParrafo = document.querySelector(`.prev-img-parafo`).getAttribute('id')
                // imgParrafo = document.querySelector(`.prev-img-parafo`)
                : '';
                console.log(imgParrafo)
                document.querySelector(`.prev-subtitulo-${parafoNum}`).innerHTML =  parafo.subitulo;
                document.querySelector(`.prev-parrafo-${parafoNum}`).innerHTML =  parafo.texto;
            });
            cargarImg(imgParrafo,true);

            //inyectar datos
            document.querySelector('.prev-titulo').textContent=titulo
            // document.querySelector('.prev-parrafo').textContent=parafos[0].texto
            document.querySelector('.prev-subtitulo').textContent=parafos[0].subtitulo
            document.querySelector('.prev-text-subtitulo').classList.add('d-none')
            document.querySelector('.prev-autor').textContent=redactor;
            cargarImg(imgPortada,false);
       } 
       leerDoc();

       let cargarImg = async (nomImg,parafo)=>{
            if(parafo){
                let urlImg = await downMultimedia('img-noticia',nomImg);
                let previewImg = document.querySelector('.prev-img-parafo');
                previewImg.setAttribute('src',urlImg);
            }
            else{
                let urlImg = await downMultimedia('img-noticia',nomImg);
                let previewImg = document.querySelector('.preve-img-portada');
                previewImg.setAttribute('src',urlImg);
            }
           
       }
    }

    //-------->DESTACADO
    function destacado(id,estado){
        confirm(`Cambiar estado de visibilidad de noticia a "${estado}"`) ?
        destacarPublicacion(): '';

        async function destacarPublicacion(){
            let res = await actualizar('noticias',id,{destacado:estado});
            res == undefined ? guardarCambios('noticia'):msgSys(10);
        }
    }

    //-------->BORAR
    function borarNoticia(noticia){
        // console.log(noticia)
        let id = noticia.classList[3]
        let codImg = noticia.classList[4]

        let initBorado = async ()=>{
           let res = await borrar('noticias',id);
           console.log(res)           
           borrarImg();
        }

        let borrarImg = async ()=>{
            let res1 = await borrarMultimedia('img-noticia',`img_por-${codImg}`);
            console.log(res1) 
            let res2 = await borrarMultimedia('img-noticia',`img_par-${codImg}`);
            console.log(res2)
            alerta('success', 'La noticia se ha borrado completamente');
            guardarCambios('noticia')
        }   
         confirm('Borrar esta Noticia? Esta accion es irreversible') ? initBorado() : ''
        
    }

    //---------> EDITAR
    function editarNoticia(editar){
        console.log(editar)

        let id = editar.classList[3];
        let initEdicion = async ()=>{
            let res = await obtenerDoc('noticias',id);
            console.log(res.data());
            localStorage.setItem('editar',JSON.stringify(res.data()));
            location.href = `./subidas.html?upload=noticia&edit=${id}`;
         }

        confirm('Quieres modificar el contenido de esta noticia?') ? initEdicion() : '';       
    }
    
    //-------------->GUARADR CAMBIOS
       async  function guardarCambios(seccion){
            let res = await cambioRealizado(seccion,idgenerator())
            if(res == undefined){
                alerta('success','Operacion correctamente');
                    setTimeout(() => {
                    location.reload()
                }, 2000);
            }  
            else{
                alerta('error','Los cambios no se guardaron correctamente, verifique su conexion e intentelo de nuevo');
            }          
        }
} 
//>>>>>>>>>>seccion personal
if(seccion == 'personal'){
     //GLOBALES: insertar valores despues de crear tablas
     let btnsPrevisualizar;
     let btnBorrar;
     let btnEditar;

     //INYECTAR PERSONAL
     cargarPersonal()
     async function cargarPersonal() {
        let res = await coleccionDatos('personal');
        // console.log(res.docs());
        res.empty == false ? inyectarPersonal(res,res.size):'';

        function inyectarPersonal(datos,total){
            let componente = '';
            datos.forEach(dato=>{
                console.log(dato.id)
                console.log(dato.data())
                let {nombre, apellidos, cargo, info, nomImg} = dato.data();

                componente +=`
                    <tr class="text-center">
                        <td>${total}</td>
                        <td>${nombre}</td>
                        <td>${apellidos}</td>
                        <td>${cargo}</td>
                        <td>${info!='undefined'?info:'-'}</td>
                        <td>
                            <button class="btn btn-success ${dato.id} ${nomImg} btn-preview" data-toggle="modal" data-target="#previsualizar-noticia">
                            <i class="fas fa-eye"></i>
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-danger ${dato.id} btn-borrar ${nomImg.split('_')[1]}">
                            <i class="fa fa-trash"></i>
                            </button>
                        </td>
                        <td>
                            <button class="btn btn-primary ${dato.id} btn-edit">
                            <i class="fa fa-edit"></i>
                            </button>
                        </td>
                    </tr>
                `
                total--;
            });
            document.getElementById('tabla-personal').innerHTML = componente;

            //capturar nuevos botones
            btnsPrevisualizar = document.querySelectorAll('.btn-preview');
            btnsPrevisualizar.forEach(preview=>{
                preview.addEventListener('click',()=>{
                    previewPersonal(preview);
                })
            })
            btnBorrar = document.querySelectorAll('.btn-borrar');
            btnBorrar.forEach(borar=>{
                borar.addEventListener('click',()=>{
                    borarPersonal(borar);
                })
            })
            btnEditar = document.querySelectorAll('.btn-edit');
            btnEditar.forEach(editar=>{
                editar.addEventListener('click',()=>{
                    editarPersonal(editar);
                })
            })
        }
     }

     //------->previsualizar personal
        function previewPersonal(btn){
            console.log(btn.classList[2])
            console.log(btn.classList[3])
            let id = btn.classList[2];
            let nomImgCode = btn.classList[3];

            let infoPersonal = async()=>{
                let res = await obtenerDoc('personal',id)
                // console.log(res.data());
                let {nombre,cargo,apellidos,info} = res.data()
                //inyectar info personal
                document.querySelector('.prev-titulo').textContent = nombre;
                document.querySelector('.personal-apellidos').textContent = apellidos;
                document.querySelector('.text-autor').textContent = 'cargo';
                document.querySelector('.prev-autor').textContent = cargo;
                document.querySelector('.personal-info').textContent = info=='undefined'?'-':info;

                document.querySelector('.prev-parrafo').innerHTML = '';
                document.querySelector('.prev-img-parafo-container').innerHTML = '';
                document.querySelector('.prev-subtitulo').innerHTML = '';
                document.querySelector('.prev-text-subtitulo').innerHTML = '';
                document.querySelector('.personal-modal-salir').innerHTML = '';

                //inyectar img
                let resImg = await downMultimedia('/img-personal',nomImgCode);
                document.querySelector('.preve-img-portada').setAttribute('src',resImg);
            }
            infoPersonal()
            // document.querySelector('.previsualizar-noticia')
        }
     //------->borrar personal
        function borarPersonal(btn){
            // console.log(btn.classList)
            // console.log(btn.classList[2])
            // console.log(btn.classList[3])

            let id = btn.classList[2];
            let codImg = btn.classList[4];

            let initBorrado = async ()=>{
                await  borrar('personal',id)
                await cambioRealizado('personal',idgenerator());
                initBorradoImg();
            }

            let initBorradoImg = async()=>{
                let res = await borrarMultimedia('img-personal',`personal_${codImg}`);
                console.log(res)
                alerta('success','borrado completo');
                setTimeout(() => {
                    location.reload()
                }, 1500);
            }
            confirm('Borrar este persona ? Esta accion es irreversible')?initBorrado():''; 
            
            
        }

     //------->editar personal
        function editarPersonal(btn){
            // console.log(btn.classList);
             let id = btn.classList[2];
             let infoPersonal = async()=>{
                 let res = await obtenerDoc('personal',id)
                 console.log(res.data());                 
                 if(confirm('Editar informacion de personal?')){
                    localStorage.setItem('editar',JSON.stringify(res.data()))
                    location.href = `subidas.html?upload=personal&edit=${id}`;
                 }
             }
             infoPersonal();
        }
}
//>>>>>>>>>>seccion comunicado
if(seccion == 'comunicado'){
    //GLOBALES: insertar valores despues de crear tablas
    let btnPubComunicado;
    let btnsPrevisualizar;
    let btnBorrar;
    let btnEditar;
    
    // -------> tabla comunicados
    tablaComunicados();
    async function tablaComunicados() {
        let res = await coleccionDatos('comunicados');
        // console.log(res.empty)
            let componente = '';
            let totalComunicados = res.size;

            if(res.empty == false){
                res.forEach(elemnt => {
                    console.log(elemnt.data());
                    let id = elemnt.id;
                    let {comunicado,publicar} = elemnt.data();
                    let titulo = comunicado.split(' ').slice(0,6).join(' ')
                    // console.log(titulo)
                    
                    componente += `
                        <tr class="text-center">
                            <td>${totalComunicados}</td>
                            <td>${titulo}</td>
                            <td>
                                <input type="checkbox" ${publicar?'checked':''} class="pub-comunicado ${id}">
                            </td>
                            <td>
                                <button class="btn btn-success ${id} btn-preview" data-toggle="modal" data-target="#modal-limpio">
                                <i class="fas fa-eye"></i>
                                </button>
                            </td>
                            <td>
                                <button class="btn btn-danger ${id} btn-borrar">
                                <i class="fa fa-trash"></i>
                                </button>
                            </td>
                            <td>
                                <button class="btn btn-primary ${id} btn-editar"">
                                <i class="fa fa-edit"></i>
                                </button>
                            </td>
                            </tr>
                    `;totalComunicados--
                });
                document.querySelector('#tabla-comunicado').innerHTML = componente;
                
                btnPubComunicado = document.querySelectorAll('.pub-comunicado');
                btnPubComunicado.forEach(pubCom=>{
                    pubCom.addEventListener('click',()=>{
                        pubComunicado(pubCom)
                    });                
                });

                btnsPrevisualizar = document.querySelectorAll('.btn-preview');
                btnsPrevisualizar.forEach(preview=>{
                    preview.addEventListener('click',()=>{
                        previewComunicado(preview)
                    });                
                });
                btnBorrar = document.querySelectorAll('.btn-borrar');
                btnBorrar.forEach(borar=>{
                    borar.addEventListener('click',()=>{
                        confirm('Quieres borrar este comunicado? Esta accion es irreversible') ? borarComunicado(borar) : '';
                    })                
                });
                btnEditar = document.querySelectorAll('.btn-editar');
                btnEditar.forEach(editar=>{
                    editar.addEventListener('click',()=>{
                        confirm('Quieres Editar este comunicado?') ? editarComnucado(editar): '';
                    })                
                });  
            }
            else if(res.empty == true){alerta('warning', 'No se ha encontrado ningun comunicado')}          
    }

    //------->Publicar Comunicado
        function pubComunicado(dato){
            console.log(dato); 
            let idCom = dato.classList[1];
            // console.log(idCom);
            dato.checked ? publicarCom() : noPublicarCom();

            async function publicarCom(){
                // console.log('pub')
                if(confirm('Publicar este comunicado en la pagina web?')){
                    await actualizar('comunicados',idCom,{publicar:dato.checked});
                    alerta('success','Completado')
                    setTimeout(() => {
                        location.reload()
                    }, 1500);
                }               
            }

            async function noPublicarCom(){
                // console.log('No pub')
                if(confirm('Quitar este comunicado de la pagina web?')){
                    await actualizar('comunicados',idCom,{publicar:dato.checked});
                    alerta('success','Completado')
                    setTimeout(() => {
                        location.reload()
                    }, 1500);
                }
            }
            
        }
    //------->Previsualizar comunicado
        async function previewComunicado(dato){
            // console.log(dato);
            let id = dato.classList[2];
            let res = await obtenerDoc('comunicados',id);
            console.log(res.data());
            let comunicado = res.data();
                let componente = `
                    '<p  class="text-center color-texto-rojo">
                        <small>
                            comunicado
                        </small>
                    </p>
                     <h6 class="color-texto-nm text-center">
                        ${comunicado.comunicado}
                    </h6>
                `;
                document.querySelector('#modal-limpio-contenido').innerHTML  = componente;
        }
    //------->Borrar comunicado
        async function borarComunicado(dato){
            let id = dato.classList[2]
            // console.log(id)
            await borrar('comunicados',id);
            alerta('success','Registro Borrado Correctamente');
            cambioRealizado('aviso',idgenerator())
            setTimeout(() => {
                location.reload()
            }, 1500);
        }
    //------->Editar comunicado
        async function editarComnucado(dato){            
            let id = dato.classList[2];           
            // console.log(id);
            let res = await obtenerDoc('comunicados',id);
            console.log(res.data())
            // console.log(res.id)
            localStorage.setItem('editarComunicado',JSON.stringify(res.data()));
            setTimeout(() => {
                location.href=`./subidas.html?upload=comunicado&edit=${res.id}`
            }, 1500);
        }
}
//>>>>>>>>>>Seccion Publicidad
if(seccion == 'publicidad'){
    //GLOBALES: insertar valores despues de crear tablas
    let btnPrev;
    let btnBorrar;
    let btnEdit;

    //Mostrar trabla Pubiciadad
    getDatosPublicidad();
    async function getDatosPublicidad(){
        let res = await coleccionDatos('publicidad');
        res.empty == true ? alerta('warning','No se ha encontrado ninguna publicidad'):
        inyectartablaPub(res)
    }
    function inyectartablaPub(datos){
        let componente='';
        let totalPub = datos.size;

        datos.forEach((dato)=>{
            // console.log(dato.id)
            // console.log(dato.data())
            let idPub = dato.id;
            let {slogan,empresa,nomImg} = dato.data();
            
            componente +=`
                <tr class="text-center">
                  <td>${totalPub}</td>
                  <td>${empresa}</td>
                  <td>${slogan}</td>
                  <td>
                    <button class="btn btn-success btn-prev ${idPub} ${nomImg}" data-toggle="modal" data-target="#modal-limpio">
                      <i class="fas fa-eye"></i>
                    </button>
                  </td>
                  <td>
                    <button class="btn btn-danger btn-borrar ${idPub} ${nomImg}" data-toggle="modal">
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
            `;totalPub--;
        });
        document.getElementById('tabla-pub').innerHTML = componente;
        //acceder a los botones
        btnPrev = document.querySelectorAll('.btn-prev')
        btnBorrar = document.querySelectorAll('.btn-borrar')
        btnEdit = document.querySelectorAll('.btn-edit')

        //Habilitar Eventos
        //-----Previsualizar
        btnPrev.forEach(btn=>{
            btn.addEventListener('click',()=>{
                prevComunicado(btn)
            })            
        })
        //-----Borrar
        btnBorrar.forEach(btn=>{
            btn.addEventListener('click',()=>{
                confirm('Desea Borrar esta publicidad?. Esta accion es irreversible')?
                 borrarComunicado(btn): '';
            })  
        })
        //-----Previsualizar
        btnEdit.forEach(btn=>{
            btn.addEventListener('click',()=>{
                editComunicado()
            }) 
        })
    }

    async function prevComunicado(btn){
        //Mostrar img/info Modal Limpio
        let domImgPub = document.querySelector('.preve-img-pub') ;

        domImgPub.classList.remove('d-none');

        document.querySelector('.preve-img-pub').classList.remove('d-none');        
        // console.log('Previsualizar')

        let idDoc = btn.classList[3]
        //captar datos
        let res = await obtenerDoc('publicidad',idDoc)
        // console.log(res.data())

        //mostrar los datos
        let {slogan,nomImg} =  res.data()
        document.querySelector('.prev-titulo-pub').textContent = slogan;

        //previsualizar img
        let urlImg = await downImg('img-publicidad',nomImg);
        domImgPub.setAttribute('src',urlImg);
    }
    async function borrarComunicado(id){
        console.log('borar')
        // console.log(id.classList)
        let idPub = id.classList[3]
        let idImgPub = id.classList[4]

        await borrar('publicidad',idPub);
        await  borrarMultimedia('img-publicidad',idImgPub)

        alerta('success','Borrado Completado')

    }

}
async function downImg(path,nom){
    let res = await downMultimedia(path,nom);
    // console.log(res);
    return res;
}