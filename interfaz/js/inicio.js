window.onload = init;


function init() {

    const container = document.querySelector('.container');
    const registerBtn = document.querySelector('.register-btn');
    const loginBtn = document.querySelector('.login-btn');

    registerBtn.addEventListener('click', () => {
    container.classList.add('active');
    })
    loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
    })

    localStorage.removeItem('token');
    if(!localStorage.getItem("token")) {

        document.getElementById('inicio').addEventListener('click', login);
        document.getElementById('registro').addEventListener('click', registro);
    }
    
}
function registro() {
    var name = document.getElementById('name').value;
    var mail = document.getElementById('mail').value;
    var password = document.getElementById('password').value;

    
    axios({
        method: 'post',
        url: 'https://inmobiliaria-production-9f86.up.railway.app/usuarios/signin',
        data: {
            Nombre: name,
            Correo: mail,
            Contraseña: password
        }
    }).then(function(res) {
        if (res.status === 409) {
            var errorElement = document.getElementById('error'); // Selección del elemento de error
            errorElement.textContent = "Correo registrado anteriormente";
        }
        else{
            console.log(res);
            window.location.href = "inicio.html";
        }
        
    }).catch(function(err) {
        console.log(err);
        var errorElement = document.getElementById('register-error');
        errorElement.textContent = "Ocurrió un error al registrar. Intenta nuevamente."; 
    });
}

function login(){
    var mail = document.getElementById('mail-l').value;
    var pass = document.getElementById('password-l').value;


    axios({
        method: 'post',
        url: 'https://inmobiliaria-production-9f86.up.railway.app/usuarios/login',
        data: {
            Correo: mail,
            Contraseña: pass
        }
    }).then(function(res) {
        if(res.data.code === 200){
            localStorage.setItem("token", res.data.message);
            window.location.href = "principal.html";
        }
        else if(res.data.code === 201){
            localStorage.setItem("token", res.data.message);
            window.location.href = "../../interfazAdmon/html/principalA.html";
        }
        else{
            var errorElement = document.getElementById('login-error');
            errorElement.textContent = "Usuario o contraseña incorrecto";
        }
    }).catch(function(err){
        console.log(err);
    })
}