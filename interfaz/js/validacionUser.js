window.onload = init;

async function init() {
    if (!localStorage.getItem("token")) {
        window.location.href = "inicio.html";
        return;
    }
    await ObtenerDatos();
    verificarEstado();
    document.getElementById('enviar').addEventListener('click', Subir);
}
function verificarEstado() {
    const detallesU = localStorage.getItem("detalleUsuario");
    detalles2 = JSON.parse(detallesU);
    console.log(detalles2.status);
    menu.innerHTML = "";
    if(detalles2.status == "Validado"){
        menu.innerHTML += `
            <a href="miPerfil.html">Mi perfil</a>
            <a href="publicar.html">Publica tu inmobiliaria</a>
            <a href="mispublis.html">Mis publicaciones</a>
            <a href="inicio.html">Cerrar sesión</a>
        `;
    }else{
        menu.innerHTML += `
            <a href="miPerfil.html">Mi perfil</a>
            <a href="validacionUser.html">Validar mi cuenta</a>
            <a href="inicio.html">Cerrar sesión</a>
        `;
    }

    if(detalles2.status == "En revisión"){
        alert("Tu cuenta está en revisión, por favor espera la validación del administrador.");
        window.location.href = "principal.html";
    }else if(detalles2.status == "Rechazado"){
        alert("Tu cuenta no ha sido validada, por favor verifique y reenvie nuevamente los datos enviados.");
    }
}

function ObtenerDatos() {
    const data = JSON.parse(localStorage.getItem("detalleUsuario"));  
    const fotoPerfil = document.getElementById('foto-perfil');
    const saludo = document.getElementById("txt");
    saludo.textContent = `Hola ${data.name}, gracias por escoger CASSAS`;
    if (data.photo_user) {
        fotoPerfil.src = `http://localhost:3000${data.photo_user}`;
    } else {
        fotoPerfil.src = "../img/user.jpg";
        console.log("Usuario sin validación. No se muestra imagen personalizada.");
    }
}

function Subir(event) {
    event.preventDefault(); // Evita el recargo del formulario

    const phone = document.getElementById("phone").value;
    const mail = document.getElementById("mail").value;
    const curp = document.getElementById("curp").value;
    const rfc = document.getElementById("rfc").value;
    const ine_photo = document.getElementById("ine_photo").files[0];
    const photo_user = document.getElementById("photo_user").files[0];

    if (!phone || !mail || !curp || !rfc || !ine_photo || !photo_user) {
        alert("Todos los campos son obligatorios");
        return;
    }

    const formData = new FormData();
    formData.append("phone", phone);
    formData.append("mail", mail);
    formData.append("curp", curp);
    formData.append("rfc", rfc);
    formData.append("ine_photo", ine_photo);
    formData.append("photo_user", photo_user);

    const token = localStorage.getItem("token");

    axios.post("http://localhost:3000/usuarios/verificar", formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
        },
    })
    .then(res => {
        alert("Datos enviados correctamente");
        document.getElementById("verificacion-form").reset();
        window.location.href = "principal.html";
    })
    .catch(err => {
        alert("Error al enviar los datos");
        console.error(err);
    });
}
