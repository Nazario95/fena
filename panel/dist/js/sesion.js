//1. Check estado de sesion
    const usr = localStorage.getItem('session');
    // console.log(usr)
    usr ? document.querySelector('.user-name').textContent = usr:''