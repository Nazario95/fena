import { actualizar } from "./firebase.js";

//>>>>>>>sweet alert
export function alerta(type,msg){
    var Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
    });
    //tipos de alerta: success, info, error, warning
    Toast.fire({
        icon: type,
        title: msg
    });    
}

//>>>>>>>>>generador de id
    export function idgenerator(){
        let mes = new Date(Date.now()).toISOString()
        let split1 = mes.split('T');

        let split2 = split1[0].split('-');
        let split3 = split1[1].split(':');
        
        let split4 = split2[0]+split2[1]+split2[2];// -> Parte 1
        let split5 = split3[0]+split3[1]+split3[2];//

        let split6 = split5.split('.');
        
        let split7 = split6[0]+split6[1].split('Z')[0];

        let splitFinal = split4+split7;
        
        return splitFinal  ;  
    }

//>>>>>>>>fehca actual
    export function fechaHoy(){
        return new Date(Date.now()).toISOString().split('T')[0]
    }
//>>>>>>>>recargar pagina
    // export function recargar(){
    //     setTimeout(() => {
    //         location.reload()
    //     }, 2000);
    // }

//>>>>>>>>>indicador de cambios
    export async function cambioRealizado(seccion,fecha){
        if(seccion == 'noticia'){
            console.log('guarando cambios ==>',fecha)
            let res = await actualizar('update','new',{fecha:fecha});
            return res;
        }
        else{
            console.log('guarando cambios ==>',fecha)
            let res = await actualizar('update',seccion,{fecha:fecha});
            return res;
        }
    }

//>>>>>>>>>Msg Alerta por Codigo
    export function msgSys(code){
        code == 10 ? alerta('error', 'Error fatal, recargue la pagina'):''
    }

    export function congelarBtn(elmento){
        let x = document.querySelector(`${elmento}`);
        x.setAttribute('disabled','true');
        document.querySelectorAll('.cargando').forEach(cargando=>{
            cargando.classList.remove('d-none');
        })
    }