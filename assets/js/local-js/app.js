import { avisos } from "./switch-data.js";

document.addEventListener("DOMContentLoaded",()=>{
    insertComunicados();
    fechaActual()//mostrar fecha actual
    init()
});

// *******MODIFICACIONES DEL DOM*****
//Mostrar fehca actual
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

//mostrar comunicados
function insertComunicados(){
    const listaAvisos = document.querySelector('.content-avisos');
    // console.log(listaAvisos);
    let componente = ''
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
    function searchParamURL(){
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