window.onload = init;
const datos = localStorage.getItem("detalleUsuario");
const mail = document.getElementById("mailU");

async function init() {
    if (!localStorage.getItem("token")) {
        window.location.href = "inicio.html";
        return;
    }
    await ObtenerDatos();
    verificarEstado();
}
function verificarEstado() {
    const detallesU = localStorage.getItem("detalleUsuario");
    detalles2 = JSON.parse(detallesU);
    const datos = JSON.parse(detallesU);
    console.log(detalles2.status);
    menu.innerHTML = "";
    if(detalles2.status == "Validado"){
        menu.innerHTML += `
            <a href="miPerfil.html">Mi perfil</a>
            <a href="publicar.html">Publica tu inmobiliaria</a>
            <a href="mispublis.html">Mis publicaciones</a>
            <a href="inicio.html">Cerrar sesión</a>
        `;
        document.getElementById("nameU").textContent = `${datos.name}`;
        document.getElementById("phoneU").textContent = `${datos.phone}`;
        document.getElementById("mailU").textContent = `${datos.mail2}`;
        document.getElementById("profile").src = `http://localhost:3000${datos.photo_user}`;
        document.querySelector(".validar").style.display = "none";
        const contenedor = document.querySelector('.resultados2');
        const token = localStorage.getItem("token");

        fetch(`inmobiliaria-production-9f86.up.railway.app/usuarios/getpublicaciones/${datos.id_user}`, {
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
            document.getElementById("vacio").style.display = "none";
            document.getElementById("mensaje").textContent = "Mis publicaciones:";
            data.forEach(publi => {
                const resultado = document.createElement('div');
                resultado.className = 'resultado';
                const extras = JSON.parse(publi.Extras);

                const preview = JSON.parse(publi.imagenes)[0] || 'default.jpg';

                resultado.innerHTML = `
                    <div class="imagen">
                        <img src="http://localhost:3000${preview}" alt="Imagen del producto" class="imagen-producto">
                    </div>
                    <div class="info">
                        <div class="desc">
                            <h3>MXN $${publi.PRE}</h3>
                            <p>${publi.PRO} en ${publi.ESTADO}, ${publi.MUN}.</p>
                            <p>${publi.TAM}m².</p>
                            <p>${extras[0]}, ${extras[1]}...</p>
                        </div>
                    </div>
                    <div class="boton">
                        <input type="button" value="Ver más" class="boton-ver-mas">
                    </div>  
                `;

                const verBtn = resultado.querySelector('.boton-ver-mas');
                verBtn.addEventListener('click', () => {
                    localStorage.setItem('detallePubli', JSON.stringify(publi));
                    window.location.href = 'detalles.html';
                });

                contenedor.appendChild(resultado);
            });
        })
        .catch(error => {
            console.error('Error al cargar publicaciones:', error);
        });
    }else{
        menu.innerHTML += `
            <a href="miPerfil.html">Mi perfil</a>
            <a href="validacionUser.html">Validar mi cuenta</a>
            <a href="inicio.html">Cerrar sesión</a>
        `;
        document.getElementById("nameU").textContent = `${datos.name}`
    }


    if(detalles2.status == "En revisión"){
        document.getElementById("profile").src = `http://localhost:3000${datos.photo_user}`;
        document.getElementById("message").textContent = "Cuenta en revisión, ¡espera un momento a que validen tu cuenta!";
        document.getElementById("link").style.display = "none";

    }else if(detalles2.status == "Rechazado"){
        document.getElementById("message").textContent = "Tu solicitud ha sido rechazada, ¡Vuelve a intentarlo!";
        document.getElementById("link").style.display = "block";
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
