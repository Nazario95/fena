document.addEventListener("DOMContentLoaded",()=>{
    fechaActual();
    datosContacto();
    rrss()
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
    let oficialEmail = 'fenaguinea@gmail.com'
    email.textContent = `Email: ${oficialEmail}`
    
    //Telefono
    const telefono = document.querySelector('.telefono-fena');
    let numOficial = '(+240) 222 125 757'
    telefono.textContent = `Tel: ${numOficial}`;

    //Ubicacion
    const ubicacion = document.querySelector('.ubicacion-fena');
    let ubicacionOficial = 'Estadio de Malabo II, Banapa, Malabo (Bioko Norte)'
    ubicacion.textContent = ubicacionOficial;
}

//REDES SOCIALES 
function rrss(){
    const whatsappChanel = 'https://www.whatsapp.com/channel/0029VaoJxHV3LdQa0wd2Yx3K';
    const whatsappSuport = 'https://wa.me/+240222125757';
    const youtube = 'https://www.youtube.com/@fena-geqfederacionecuatogu723';
    const instagram = 'https://www.instagram.com/federaciondenatacion.fena_eg?igsh=MXhpdTU2bHZjY2Zucg%3D%3D';
    const tiktok = undefined;
    const facebook = 'https://www.facebook.com/profile.php?id=61560608371757&rdid=laj1lnurLcKkyDXG&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16YmsgUiqK%2F#';
    const xTwitter = 'https://x.com/FenaGuinea?t=1uO2cRMgWpF4q7meRwVE_g&s=09'

    //Enlazar en el DOM
    document.querySelector('#link-facebook').setAttribute('href',facebook);
    document.querySelector('#link-instagram').setAttribute('href',instagram);
    document.querySelector('#link-youtube').setAttribute('href',youtube);
    document.querySelector('#link-x-twitter').setAttribute('href',xTwitter);
    document.querySelector('#link-whatsapp-chanel-official').setAttribute('href',whatsappChanel);
}

//3.PAGINAS DESABILITADAS
    const  listaMenuHeaderOculto = ['competiciones.html','equipo.html','normativa.html']; 
    listaMenuHeaderOculto.forEach(paginaOculta => {        
        location.pathname.split('/').indexOf(paginaOculta) >=0 ? mostrar404():'';     
    });

    //FILTRO DE PAGINA
    function mostrar404(){        
        //competiciones.html
        if(location.pathname == '/competiciones.html'){
            // console.log(location.search.split('=')[1])
            //reglas
            location.search.split('=')[1] == 'masculino' ? location.href='./404.html':
            location.search.split('=')[1] == 'femenino' ? location.href='./404.html':
            location.search.split('=')[1] == 'first-division' ? location.href='./404.html':
            location.search.split('=')[1] == 'second-division' ? location.href='./404.html':
            location.search.split('=')[1] == 'young-division' ? location.href='./404.html':''
        }
        // else if(location.pathname == '/equipo.html'){
        //     location.href='./404.html'
        // }
        // else if(location.pathname == '/normativa.html'){
        //      location.href='./404.html'
        // }
        // location.href='./404.html'
    }

// export function confMenu(){
//    let x =  document.querySelector('#navigation').children
//    x[5].children[0].textContent = 'Nazza'
//    console.log(x[5].children[0].textContent)
// //    x.forEach(menu=>{
// //         console.log(menu.textContent)
        
        
// //     })
    
// }
    
