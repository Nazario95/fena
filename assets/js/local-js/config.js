document.addEventListener("DOMContentLoaded",()=>{
    fechaActual();
    datosContacto();
});

//1.FECHA ACTUAL   
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

//2.DATOS DE CONTACTO
function datosContacto(){
    //Correo
    const email = document.querySelector('.correo-fena');
    let oficialEmail = 'fenaeg@gmail.com'
    email.textContent = `Email: ${oficialEmail}`
    
    //Telefono
    const telefono = document.querySelector('.telefono-fena');
    let numOficial = '+240333110099'
    telefono.textContent = `Tel: ${numOficial}`;

    //Ubicacion
    const ubicacion = document.querySelector('.ubicacion-fena');
    let ubicacionOficial = 'Estadio de Malabo II, Banapa, Malabo (Bioko Norte)'
    ubicacion.textContent = ubicacionOficial;
}

//3.PAGINAS DESABILITADAS
    const  listaMenuHeaderOculto = ['competiciones.html','equipo.html','normativa.html']; 
    listaMenuHeaderOculto.forEach(paginaOculta => {
        location.pathname.split('/').indexOf(paginaOculta) >=0 ? location.href='./404.html':''
    });
    
