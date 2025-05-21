window.onload = init;
const data = JSON.parse(localStorage.getItem("publicacionAEditar"));
const actualizar = document.getElementById("btn");
actualizar.addEventListener("click", async (e) => {
    e.preventDefault();
    const tipo = document.getElementById("tipo").value;
    const estado = document.getElementById("estado").value;
    const municipio = document.getElementById("municipio").value;
    const habitaciones = document.getElementById("habitaciones").value;
    const banios = document.getElementById("banios").value;
    const estacionamiento = document.getElementById("estacionamiento").value;
    const amueblado = document.getElementById("amueblado").value;
    const tamano = document.getElementById("tamano").value;
    const precio = document.getElementById("precio").value;
    const descripcion = document.getElementById("descripcion").value;
    const extrasSeleccionados = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        extrasSeleccionados.push(checkbox.value);
    });
    const datosActualizar = {
        PRO: tipo,
        ESTADO: estado,
        MUN: municipio,
        HAB: habitaciones,
        BAN: banios,
        EST: estacionamiento,
        AMU: amueblado,
        TAM: tamano,
        PRE: precio,
        DES: descripcion,
        Extras: JSON.stringify(extrasSeleccionados) // Convertir el array a JSON
    };

    try {
        const response = await fetch(`http://localhost:3000/usuarios/actualizar/${data.id_publicacion}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify(datosActualizar)
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            window.location.href = "mispublis.html"; // Redirigir a la lista de publicaciones
        } else {
            alert(`Error: ${result.message}`);
        }
    } catch (error) {
        console.error("Error al actualizar publicación:", error);
        alert("Hubo un problema al actualizar la publicación.");
    }
});

async function init() {
    if (!localStorage.getItem("token")) {
        window.location.href = "inicio.html";
        return;
    }
    await ObtenerDatos();
    verificarEstado();
    cargarDatos();
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

function cargarDatos(){
    document.getElementById("tipo").value = data.PRO;
    document.getElementById("estado").value = data.ESTADO;
    document.getElementById("municipio").value = data.MUN;
    document.getElementById("habitaciones").value = data.HAB;
    document.getElementById("banios").value = data.BAN;
    document.getElementById("estacionamiento").value = data.EST;
    document.getElementById("amueblado").value = data.AMU;
    document.getElementById("tamano").value = data.TAM;
    document.getElementById("precio").value = data.PRE;
    document.getElementById("descripcion").value = data.DES;

    // Marcar los extras (es un JSON con array de valores)
    const extrasSeleccionados = JSON.parse(data.Extras || "[]");
    extrasSeleccionados.forEach(extra => {
        const checkbox = document.querySelector(`input[type="checkbox"][value="${extra}"]`);
        if (checkbox) checkbox.checked = true;
    });
}