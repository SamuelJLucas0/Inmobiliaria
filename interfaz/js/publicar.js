window.onload = init;
const input = document.getElementById("avatar");

async function init() {
    if (!localStorage.getItem("token")) {
        window.location.href = "inicio.html";
        return;
    }
    await ObtenerDatos();
    verificarEstado();
    document.getElementById('btn').addEventListener('click', Subir);

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

const tipoPropiedad = document.getElementById("tipo");
const estado = document.getElementById("estado");
const municipio = document.getElementById("municipio");
const habitaciones = document.getElementById("habitaciones");
const banios = document.getElementById("banios");
const estacionamiento = document.getElementById("estacionamiento");
const amueblado = document.getElementById("amueblado");
const tamanoTerreno = document.getElementById("tamano");
const precio = document.getElementById("precio");
const descripcion = document.getElementById("descripcion");

// Obtener los checkboxes y sus valores
const checkboxes = document.querySelectorAll('input[type="checkbox"]');

function Subir(){
    const archivos = input.files;

    const PRO = tipoPropiedad.value;
    const ESTADO = estado.value;
    const MUN = municipio.value;
    const HAB = habitaciones.value;
    const BAN = banios.value;
    const EST = estacionamiento.value;
    const AMU = amueblado.value;
    const TAM = tamanoTerreno.value;
    const PRE = precio.value;
    const DES = descripcion.value;

    // Obtener los valores de los checkboxes seleccionados
    const Extras = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);

    if (
        archivos.length === 0 || PRO === "" || ESTADO === "" || MUN === "" ||
        HAB === "" || BAN === "" || EST === "" || AMU === "" ||
        TAM === "" || PRE === "" || DES === ""
    ) {
        alert("Favor de completar el formulario");
        return;
    }

    const formData = new FormData();
    for (let i = 0; i < archivos.length; i++) {
        formData.append("imagenes", archivos[i]);
    }

    formData.append("PRO", PRO);
    formData.append("ESTADO", ESTADO);
    formData.append("MUN", MUN);
    formData.append("HAB", HAB);
    formData.append("BAN", BAN);
    formData.append("EST", EST);
    formData.append("AMU", AMU);
    formData.append("TAM", TAM);
    formData.append("PRE", PRE);
    formData.append("DES", DES);
    formData.append("Extras", JSON.stringify(Extras)); // Convertir el array a una cadena JSON



    const token = localStorage.getItem("token");

    axios.post('inmobiliaria-production-9f86.up.railway.app/usuarios/subirpubli', formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    })
    .then(res => {
        if (res.status === 201) {
            alert("Publicación creada correctamente");
            limpiarFormulario();
        }
    })
    .catch(err => {
        alert("Error al subir publicación");
        console.log(err);
    });
}

function limpiarFormulario() {
    // Limpiar los valores de los campos de texto
    document.getElementById('tipo').value = '';
    document.getElementById('estado').value = '';
    document.getElementById('municipio').value = '';
    document.getElementById('habitaciones').value = '';
    document.getElementById('banios').value = '';
    document.getElementById('estacionamiento').value = '';
    document.getElementById('amueblado').value = '';
    document.getElementById('tamano').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('descripcion').value = '';
    
    // Limpiar el campo de archivos (input de imágenes)
    document.getElementById('avatar').value = '';

    document.querySelectorAll('input[type="checkbox"]').checked = false;
}
