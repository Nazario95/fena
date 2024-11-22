//==============IMPORT DB
    // https://firebase.google.com/docs/web/setup#available-libraries
    // import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-analytics.js";
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";    
    import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
    import {getFirestore,collection,getDocs, addDoc,updateDoc, doc, getDoc, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
    import {getStorage, ref, getDownloadURL,uploadBytes, deleteObject} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

    const firebaseConfig = {
        apiKey: "AIzaSyDo9aV_yl9KAzBBXabNwcN3SVVS92q1GRE",
        authDomain: "fenaeg-46281.firebaseapp.com",
        projectId: "fenaeg-46281",
        storageBucket: "fenaeg-46281.appspot.com",
        messagingSenderId: "547523336916",
        appId: "1:547523336916:web:75883741859da8e50b7941",
        measurementId: "G-PRDLNVDJ97"
    };
    const app = initializeApp(firebaseConfig); 

//=============>crud analitic
    //const analytics = getAnalytics(app);

//=============>crud auth
    const auth = getAuth(app);

    //***********1.Conexion con app de sesion    
    // console.log('-----check: app de login. funciona-----')
    // console.log(auth)

    //***********2.Crear usuario
    // const email = 'nazario@fenaeg.com';
    // const password = '399395';
    // crearUsuario(email,password)
    
    // function crearUsuario(email,password){        
    //     createUserWithEmailAndPassword(auth, email, password)
    //         .then((userCredential) => {
    //             let usr = userCredential.user;
    //             console.log(usr.email);                
    //             // let sesion = {
    //             //     usr:'',
    //             //     nombre:'',
    //             //     correo:''
    //             // }
    //         })
    //         .catch((error) => {
    //             var errorCode = error.code;
    //             var errorMessage = error.message;
    //             console.log(errorCode);
    //             alert(errorCode == 'auth/email-already-in-use' ? 
    //                 'Ya existe un usuario con este nombre' : '');
    //         });
    // }
    
    //*********** 3. Iniciar sesion
    // if(document.querySelector('#btn-access')){
    //     document.querySelector('#btn-access').addEventListener('click',(e)=>{
    //         e.preventDefault();
    //         const email = document.querySelector('.usuario').value;
    //         const password = document.querySelector('.psw').value;

    //         console.log(email,password)
    //         iniciarSesion(email,password);
    //     });


    export async function iniciarSesion(email,password){  
        try {
            let res = await signInWithEmailAndPassword(auth, email, password);
            return res;
        } catch (error) {
            const errorCode = error.code;
            // const errorMessage = error.message;
            // console.log(errorCode)
            if(errorCode == 'auth/invalid-credential'){
                alert('Datos de sesion invalidos')
            }
            else{alert('Ha ocurrido un error, recargue la paguina e intentelo de nuevo')}
        }
    }
    // }

    //**************4. Cerar sesion */
    export function logOut(){
        auth.signOut()
            .then(()=>{
                location.href = './login/';
            })
            .catch(error=>{console.log(error)});
    }
    

//=================>CRUD FIRESTORE
    const db = getFirestore(app)
    // ------>subir datos
        export function guardarDoc(){

        }
        export async function guardarColeccion(ruta,datos){
            const respuesta =  await addDoc(collection(db,ruta),datos);
            if(respuesta)  return true;
            else return false;      
        }
        export async function actualizar(ruta,id,datos){
           let res =  await updateDoc(doc(db,ruta,id),datos);
           return res;
        }

        export async function borrar(ruta,id){
            let res = await deleteDoc(doc(db,ruta,id));
            return res;
        }

        export async function obtenerDoc(ruta,id){
            const res = await getDoc(doc(db,ruta,id));
            return res;
        }

    //---------> CONSULTAR DATOS
    
        export async function consulta(consultarDatos,ruta) {
            // console.log(consultarDatos)
            // console.log(`${Object.keys(consultarDatos)[0]}`)
            // console.log(`${Object.values(consultarDatos)[0]}`)
            let res
            try {
                res = await getDocs(query(collection(db,ruta,),  where(`${Object.keys(consultarDatos)[0]}`, "==", `${Object.values(consultarDatos)[0]}`)));
                return res
            } catch (error) {
                return error
            }
        }
        
        export async function coleccionDatos(ruta) {
            const res = await getDocs(collection(db,ruta));
            return res;
        }

//=================>CRUD STORAGE    
    const storage = getStorage(app); 
    //>>>>> Descargar
    export async function subirMultimedia(nomArchivo,archivo,path){

        const storageRef = ref(storage, `${path}/${nomArchivo}`);

        uploadBytes(storageRef, archivo)
            .then((res) => {
                localStorage.setItem('up_file','true');
                return res;
            })
            .catch(err=>{
                return err
            })
    }   
    //>>>>>Borrar
    export async function  borrarMultimedia(ruta,nomImg){
        const archivoRef = ref(storage,`${ruta}/${nomImg}`);		
		deleteObject(archivoRef)
            .then((res) => {return res})
            .catch((err) => {return err});
    }
    //>>>>>>Descargar
    export async function downMultimedia(ruta,id){
        const res = getDownloadURL(ref(storage, `${ruta}/${id}`));
        return res;
    }

