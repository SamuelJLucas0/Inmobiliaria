window.onload = init;

let index = 0; // Mueve la declaración de 'index' fuera para que sea accesible globalmente
const imagenes = document.querySelector('.imagenes'); // Declara la variable 'imagenes' aquí para que sea global
const detallePubli = JSON.parse(localStorage.getItem('detallePubli'));
const botonVendedor = document.getElementById('boton-perfil');
botonVendedor.addEventListener('click', () => {
    window.location.href = 'perfil.html';
})
async function init() {
    if (!localStorage.getItem("token")) {
        window.location.href = "inicio.html";
        return;
    }
    ObtenerDatosSeller(detallePubli.id_user, cargarDetalles); 
    await ObtenerDatos();
    verificarEstado();
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

function cargarDetalles() {
    const detallesUser = JSON.parse(localStorage.getItem('detalleSeller'));

    const contenedor = document.getElementById('contenedor-imagenes');
    const puntosContenedor = document.getElementById('puntos-carrusel');
    const contenedorExtras = document.querySelector('.extras');
    const extras = JSON.parse(detallePubli.Extras);
    contenedorExtras.innerHTML = '<p><strong>Características Generales:</strong></p>';

    extras.forEach(extra => {
        const parrafo = document.createElement('p');
        parrafo.textContent = `${extra} ✅`; // Agrega el texto y el símbolo de verificación
        contenedorExtras.appendChild(parrafo);
    });

    const imagenesArray = JSON.parse(detallePubli.imagenes);
    document.getElementById('precio').textContent = `MXN $${detallePubli.PRE}`;
    document.getElementById('tittle').textContent = `${detallePubli.PRO} en ${detallePubli.MUN}, ${detallePubli.ESTADO}.`;
    document.getElementById('casa').textContent = `${detallePubli.PRO}`;
    document.getElementById('metros').textContent = `${detallePubli.TAM} m²`;
    document.getElementById('cuartos').textContent = `${detallePubli.HAB}`;
    document.getElementById('baños').textContent = `${detallePubli.BAN}`;
    document.getElementById('estacionamiento').textContent = `${detallePubli.EST}`;
    // Modificar descripción principal
    document.getElementById('descripcion').textContent = detallePubli.DES;
    console.log(detallePubli.DES);
    // Modificar información general
    const infoGeneral = document.querySelector('.izquierda-descripcion');

    // Reemplazar todo el contenido bajo "Informacion General"
    infoGeneral.innerHTML = `
        <h2>Descripción</h2>
        <p id="descripcion">${detallePubli.DES}</p>
        <h2>Información General</h2>
        <p><strong>Tipo de propiedad:</strong> ${detallePubli.PRO}</p>
        <p><strong>Estado:</strong> ${detallePubli.ESTADO}</p>
        <p><strong>Municipio/Colonia:</strong> ${detallePubli.MUN}</p>
        <p><strong>Metros cuadrados de la propiedad:</strong> ${detallePubli.TAM} m²</p>
        <p><strong>Fecha de la publicación:</strong> ${detallePubli.fecha_subida}</p>

    `;
    console.log(detallePubli.fecha_subida);
    // Datos del vendedor
    const fotoVendedor = document.getElementById('foto-vendedor');
    fotoVendedor.src = `http://localhost:3000${detallesUser.photo_user}`; // Ruta completa de la imagen
    const nombreVendedor = document.querySelector('.datos-vendedor p:nth-child(1)');
    nombreVendedor.innerHTML = `<strong>Nombre:</strong> ${detallesUser.name}`;
    const telefonoVendedor = document.querySelector('.datos-vendedor p:nth-child(2)');
    telefonoVendedor.innerHTML = `<strong>Teléfono:</strong> ${detallesUser.phone}`;
    const correoVendedor = document.querySelector('.datos-vendedor p:nth-child(3)');
    correoVendedor.innerHTML = `<strong>Correo:</strong> ${detallesUser.mail2}`;

    imagenesArray.forEach((url, i) => {
        const img = document.createElement('img');
        img.src = `http://localhost:3000${url}`;
        img.alt = `Imagen ${i + 1}`;
        contenedor.appendChild(img);

        const punto = document.createElement('span');
        punto.classList.add('punto');
        if (i === 0) punto.classList.add('activo'); // activa el primero por defecto
        punto.addEventListener('click', () => {
            index = i;
            moverCarrusel();
        });
        puntosContenedor.appendChild(punto);
    });

    const totalImagenes = imagenesArray.length;

    document.getElementById('anterior').addEventListener('click', () => {
        index--;
        if (index < 0) index = totalImagenes - 1;
        moverCarrusel();
    });

    document.getElementById('siguiente').addEventListener('click', () => {
        index++;
        if (index >= totalImagenes) index = 0;
        moverCarrusel();
    });
}

function moverCarrusel() {
    imagenes.style.transform = `translateX(${-index * 600}px)`; // Usando la variable global 'imagenes'
    actualizarPuntos();
}

function actualizarPuntos() {
    const puntos = document.querySelectorAll('.punto');
    puntos.forEach(p => p.classList.remove('activo'));
    puntos[index].classList.add('activo');
}

function ObtenerDatosSeller(id, callback) {
    const token = localStorage.getItem('token');
    axios.get(`http://localhost:3000/usuarios/obtenerdatos/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        const usuario = response.data;
        console.log(usuario);
        localStorage.setItem('detalleSeller', JSON.stringify(usuario));
        callback(); // Llamamos al callback cuando los datos están listos
    })
    .catch(error => {
        console.error('Error al obtener los datos del usuario:', error);
    });
}

