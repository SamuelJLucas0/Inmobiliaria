window.onload = init;
const Vendedor = JSON.parse(localStorage.getItem("detalleSeller"));

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
    const photoSeller = document.getElementById('profile');
    const name = document.getElementById('nameS');
    document.getElementById('phoneV').textContent = `${Vendedor.phone}`
    document.getElementById('mailV').textContent = `${Vendedor.mail2}`

    photoSeller.src = `http://localhost:3000${Vendedor.photo_user}`;
    name.textContent = `${Vendedor.name}`;

    const contenedor = document.querySelector('.resultados2');
    const token = localStorage.getItem("token");

    fetch(`http://localhost:3000/usuarios/getpublicaciones/${Vendedor.id_user}`, {
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

                        <div class="boton">
                    <input type="button" value="Ver más" class="boton-ver-mas">
                </div>  
                    </div>

                     
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
}

