window.onload = init;
const detallesU = localStorage.getItem("detalleUsuario");
const datos = JSON.parse(detallesU);

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
    document.getElementById("mi-foto").src = `http://localhost:3000${datos.photo_user}`;
    document.getElementById("nombre").innerHTML = `<strong>Nombre: </strong>${datos.name}`;
    document.getElementById("telefono").innerHTML = `<strong>Telefono: </strong>${datos.phone}`;
    document.getElementById("correo").innerHTML = `<strong>Correo: </strong>${datos.mail2}`;

    const contenedor = document.querySelector('.resultados');
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3000/usuarios/getpublicaciones/${datos.id_user}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(res => {
        if (res.status === 401) {
            localStorage.removeItem("token");
            window.location.href = "inicio.html";
            return;
        }
        return res.json();
    })
    .then(data => {
        if (!data) return; 
        document.querySelector(".vacio").style.display = "none";
        document.getElementById("mensaje").textContent = "Mis publicaciones:";
        data.forEach(publi => {
            const resultado = document.createElement('div');
            resultado.className = 'resultado';
            const extras = JSON.parse(publi.Extras);

            const preview = JSON.parse(publi.imagenes)[0] || 'default.jpg';

            resultado.innerHTML = `
                <div class="acciones">
                    <button class="btn-accion actualizar" title="Actualizar"></button>
                    <button class="btn-accion eliminar" title="Eliminar"></button>
                </div>
                <div class="imagen">
                    <img src="http://localhost:3000${preview}" alt="Imagen del producto" class="imagen-producto">
                </div>
                <div class="info">
                    <div class="desc">
                        <h3>MXN $${publi.PRE}</h3>
                        <p>${publi.PRO} en ${publi.ESTADO}, ${publi.MUN}.</p>
                        <p>${publi.TAM}m².</p>
                        <p><strong>Baños: </strong>${publi.BAN} | <strong>Habitaciones: </strong>${publi.HAB}</p>
                    </div>
                    <input type="button" value="Ver más" class="boton-ver-mas">
                </div>

            `;

            const verBtn = resultado.querySelector('.boton-ver-mas');
            verBtn.addEventListener('click', () => {
                localStorage.setItem('detallePubli', JSON.stringify(publi));
                window.location.href = 'detalles.html';
            });
            const eliminarBtn = resultado.querySelector('.btn-accion.eliminar');
            eliminarBtn.addEventListener('click', () => {
                const confirmacion = confirm("¿Estás seguro de que deseas eliminar esta publicación?");
                if (confirmacion) {
                    fetch(`http://localhost:3000/usuarios/eliminar/${publi.id_publicacion}`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data);
                        window.location.reload();
                    })
                    .catch(error => console.error('Error al eliminar la publicación:', error));
                }
            });

            const actualizarBtn = resultado.querySelector('.btn-accion.actualizar');
            actualizarBtn.addEventListener('click', () => {
                localStorage.setItem('publicacionAEditar', JSON.stringify(publi));
                window.location.href = 'editar.html';
            });

            contenedor.appendChild(resultado);
        });
    })
    .catch(error => {
        console.error('Error al cargar publicaciones:', error);
    });
}