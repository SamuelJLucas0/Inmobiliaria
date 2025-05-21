window.onload = init;
const fotoPerfil = document.getElementById('foto-perfil');
const menu = document.getElementById('menu-desplegable');

fotoPerfil.addEventListener('click', () => {
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

// Cierra el menú si se hace clic fuera
document.addEventListener('click', function(event) {
    if (!event.target.closest('.perfil-container')) {
        menu.style.display = 'none';
    }
});

// Variables globales para almacenar las publicaciones
let todasLasPublicaciones = [];

async function init() {
    if (!localStorage.getItem("token")) {
        window.location.href = "inicio.html";
        return;
    }
    await cargarPublicaciones(); // Cargamos todas las publicaciones primero
    await ObtenerDatos();
    verificarEstado();
    
    // Configurar eventos de filtrado
    configurarFiltros();
}

function configurarFiltros() {
    // Filtro de búsqueda por texto (con Enter)
    const buscador = document.getElementById('buscador');
    buscador.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            aplicarFiltros();
        }
    });
    
    // Botón de buscar
    const btnBuscar = document.getElementById('btn-buscar');
    btnBuscar.addEventListener('click', aplicarFiltros);
}

function aplicarFiltros() {
    // Obtener valores de los filtros
    const textoBusqueda = document.getElementById('buscador').value.toLowerCase();
    const tipo = document.getElementById('tipo').value;
    const estado = document.getElementById('estado').value;
    const habitaciones = document.getElementById('habitaciones').value;
    const banios = document.getElementById('banios').value;
    const estacionamiento = document.getElementById('estacionamiento').value;
    const amueblado = document.getElementById('amueblado').value;
    const tamano = document.getElementById('tamano').value;
    const precio = document.getElementById('precio').value;
    
    // Obtener extras seleccionados
    const extrasSeleccionados = [];
    document.querySelectorAll('.checkbox-item input[type="checkbox"]:checked').forEach(checkbox => {
        extrasSeleccionados.push(checkbox.value);
    });
    
    // Filtrar publicaciones
    const publicacionesFiltradas = todasLasPublicaciones.filter(publi => {
        // Filtro por texto (busca en descripción y características)
        if (textoBusqueda && 
            !publi.DES.toLowerCase().includes(textoBusqueda) && 
            !`${publi.PRO} en ${publi.ESTADO}, ${publi.MUN}`.toLowerCase().includes(textoBusqueda)) {
            return false;
        }
        
        // Filtro por tipo de propiedad
        if (tipo && publi.PRO !== tipo) {
            return false;
        }
        
        // Filtro por estado
        if (estado && publi.ESTADO !== estado) {
            return false;
        }
        
        // Filtro por habitaciones
        if (habitaciones && parseInt(publi.HAB) < parseInt(habitaciones)) {
            return false;
        }
        
        // Filtro por baños
        if (banios && parseInt(publi.BAN) < parseInt(banios)) {
            return false;
        }
        
        // Filtro por estacionamiento
        if (estacionamiento && publi.EST !== estacionamiento) {
            return false;
        }
        
        // Filtro por amueblado
        if (amueblado && publi.AMU !== amueblado) {
            return false;
        }
        
        // Filtro por tamaño (convertir a número para comparar)
        if (tamano) {
            const tamanoPubli = parseFloat(publi.TAM.replace(',', ''));
            if (tamanoPubli < parseFloat(tamano)) {
                return false;
            }
        }
        
        // Filtro por precio (convertir a número para comparar)
        if (precio) {
            const precioPubli = parseFloat(publi.PRE.replace(',', ''));
            if (precioPubli < parseFloat(precio)) {
                return false;
            }
        }
        
        // Filtro por extras (todos los seleccionados deben estar presentes)
        if (extrasSeleccionados.length > 0) {
            const extrasPubli = JSON.parse(publi.Extras);
            const todosPresentes = extrasSeleccionados.every(extra => 
                extrasPubli.includes(extra)
            );
            if (!todosPresentes) {
                return false;
            }
        }
        
        return true;
    });
    
    // Mostrar resultados filtrados
    mostrarPublicaciones(publicacionesFiltradas);
}

function mostrarPublicaciones(publicaciones) {
    const contenedor = document.querySelector('.resultados');
    contenedor.innerHTML = ''; // Limpiar resultados anteriores
    
    if (publicaciones.length === 0) {
        contenedor.innerHTML = '<p>No se encontraron propiedades con los filtros seleccionados.</p>';
        return;
    }
    
    publicaciones.forEach(publi => {
        const resultado = document.createElement('div');
        resultado.className = 'resultado';

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
                    <p>${publi.phone}</p>
                </div>
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
}

function verificarEstado() {
    const detallesU = localStorage.getItem("detalleUsuario");
    detalles = JSON.parse(detallesU);
    estado = detalles.status;
    console.log(estado);
    menu.innerHTML = "";
    if(estado == "Validado"){
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
    const token = localStorage.getItem("token");

    return fetch('http://localhost:3000/usuarios/getuser', {
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

        // Cambiar saludo con el nombre
        const saludo = document.getElementById("txt");
        saludo.textContent = `Hola ${data.name}, gracias por escoger CASSAS`;

        // Mostrar foto solo si está validado
        const fotoPerfil = document.getElementById('foto-perfil');
        if (data.photo_user) {
            fotoPerfil.src = `http://localhost:3000${data.photo_user}`;
        } else {
            fotoPerfil.src = "../img/user.jpg";
            console.log("Usuario sin validación. No se muestra imagen personalizada.");
        }
        localStorage.setItem('detalleUsuario', JSON.stringify(data));
    })
    .catch(error => {
        console.error('Error al cargar datos del usuario:', error);
    });
}

function cargarPublicaciones() {
    const token = localStorage.getItem("token");

    return fetch('http://localhost:3000/usuarios/getpublicaciones', {
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
        if (!data) return; // Si no hay datos, salimos
        
        // Guardar todas las publicaciones para filtrar después
        todasLasPublicaciones = data.map(publi => {
            // Obtener el teléfono del usuario que publicó
            const phone = getPhoneFromUser(publi.id_user);
            return {...publi, phone};
        });
        
        // Mostrar todas las publicaciones inicialmente
        mostrarPublicaciones(todasLasPublicaciones);
    })
    .catch(error => {
        console.error('Error al cargar publicaciones:', error);
    });
}

// Función auxiliar para obtener el teléfono del usuario (simplificada)
function getPhoneFromUser(id_user) {
    // En una implementación real, harías una llamada al servidor
    // o tendrías esta información en las publicaciones
    // Esta es una implementación simplificada para el ejemplo
    const usuariosConTelefono = {
        8: '7776438044',
        14: '2211996527',
        15: '7771377483',
        17: '777-137-74-83'
    };
    return usuariosConTelefono[id_user] || 'Sin teléfono';
}

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".container");

    document.getElementById("btn-contacto").addEventListener("click", (e) => {
        e.preventDefault();
        container.innerHTML = `
    <div class="contenido-estatico">
        <h2>Contáctanos</h2>
        <div class="equipo-grid">
            <div class="miembro">
                <img src="../img/chris.jpg" alt="Chris">
                <h3>Christopher Eduardo Barrientos Guerra</h3>
                
                <p>Full-Stack / Administración</p>
                <p>chris@gmail.com</p>
                <p>+52 123 456 7890</p>
                
            </div>

            <div class="miembro">
                <img src="../img/sam2.jpg" alt="Sam">
                <h3>Samuel Juarez Lucas</h3>
                
                <p>Lider de Proyecto / Full-Stack</p>
                <p>citus@gmail.com</p>
                <p>+52 123 456 7891</p>
            </div>

            <div class="miembro">
            
                <img src="../img/jean2.jpg" alt="chon">
                <h3>Jean Emmanuel Aguilar Benitez</h3>
                
                <p>Diseño / User-Experience</p>
                <p>chon@hotmail.com</p>
                <p>+52 123 456 7892</p>
            </div>

            <div class="miembro">
                <img src="../img/ivan2.jpg" alt="Pepe">
                <h3>Manuel Ivan Gerardo Rosas</h3>
                
                <p>Back-End / Administración</p>
                <p>ceratilover@gmail.com</p>
                <p>+52 123 456 7893</p>
            </div>

            <div class="miembro">
                <img src="../img/ivan.jpg" alt="Chron">
                <h3>Erick Isaac Berrios Rodriguez</h3>
                
                <p>Back-End / Base de Datos</p>
                <p>barrios@gmail.com</p>
                <p>+52 123 456 7894</p>
            </div>

            <div class="miembro">
                <img src="../img/ivan.jpg" alt="emo">
                <h3>Emiliano Arias Villafania</h3>
                
                <p>Back-End / Base de Datos</p>
                <p>Emo@gmail.com</p>
                <p>+52 123 456 7895</p>
            </div>
        </div>
    </div>
`;

    });

    document.getElementById("btn-ayuda").addEventListener("click", (e) => {
        e.preventDefault();
        container.innerHTML = `
            <div class="contenido-estatico">
                <h2>Ayuda</h2>
                <p>¿Tienes dudas? Aquí encontrarás respuestas a las preguntas frecuentes.</p>
                <a href="img/manual_usuario.pdf" download class="boton-descarga">📄 Descargar Manual de Usuario</a>
            <br><br>
                </div>

        `;
    });

    document.getElementById("btn-nosotros").addEventListener("click", (e) => {
        e.preventDefault();
        container.innerHTML = `
            
        <div class="contenido-estatico">
        <h2>Sobre Nosotros</h2>
    <img src="../img/casaaa.jpg" alt="Imagen representativa" class="imagen-portada">
    
    <h2>¿Quiénes Somos?</h2>
    <p>CASSASQRO.com es una empresa joven con una plataforma digital libre de publicidad y contenidos adicionales que constituyen un valor agregado a tu proceso de compra-venta o renta. Preferimos emplear nuestro empeño en construir una plataforma totalmente enfocada en servicios útiles que faciliten la toma de decisiones importantes a la hora de ofrecer o conseguir una propiedad en venta o renta.
Partimos de la premisa de que tú sabes bien dónde y cómo te gustaría vivir. Te ofrecemos una búsqueda muy dinámica, por mapa, para que sientas que recorres las calles de la ciudad sin mover más que un dedo.
Nuestro equipo trabaja en el desarrollo de nuevos servicios: queremos sorprenderte, ayudarte y emocionarte, porque sabemos que buscar o anunciar propiedades no tiene por qué ser tedioso ni cansado. Pero eso sólo será posible con la retroalimentación de nuestros usuarios. Conoce nuestro sitio, vívelo, recórrelo y dinos qué te parece. Aquí sí, tu opinión cuenta.</p>

    <div class="mision-vision">
        <div class="bloque">
            <h3>Nuestra Visión</h3>
            <p>Aspiramos a ser líderes en el mercado inmobiliario disruptivo, facilitando el acceso a alojamientos ideales con una relación calidad-precio excepcional.  A través de un enfoque centrado en el cliente, construiremos una comunidad sólida respaldada por asesoramiento personalizado y soluciones adaptadas a las necesidades individuales, garantizando una experiencia integral y sin fricciones.</p>
        </div>
        <div class="bloque">
            <h3>Nuestra Misión</h3>
            <p>Nuestra misión es redefinir la experiencia de hospedaje a nivel global, ofreciendo a las personas un sentido de pertenencia y comodidad en cualquier destino. 
Aunque inicialmente el concepto de compartir espacios con desconocidos fue recibido con escepticismo, hemos demostrado que es posible construir una comunidad global basada en confianza, innovación y conexiones auténticas.</p>
        </div>
    </div>

    <div class="valores">
        <h3>Nuestros Valores</h3>
        <p>
Confianza y Transparencia: Relaciones basadas en integridad y equidad.
Innovación y Adaptabilidad: Soluciones creativas y resilientes frente a los desafíos del mercado.
Excelencia en Servicio: Compromiso con la comodidad, seguridad y satisfacción del cliente.
Autenticidad y Conexión: Fomentamos interacciones genuinas y crecimiento personal.
Sostenibilidad: Promovemos un modelo de economía colaborativa con impacto positivo.</p>
    </div>
</div>


        `;
    });

    document.getElementById("btn-sugerencias").addEventListener("click", (e) => {
        e.preventDefault();
        container.innerHTML = `
            <div class="contenido-estatico">
                <h2>Sugerencias</h2>
                <p>¿Tienes alguna sugerencia? ¡Queremos escucharte!</p>
                <textarea placeholder="Escribe aquí..." rows="5" cols="50"></textarea><br>
                <button class="boton-ver-mas22">Enviar</button>
            </div>
        `;
    });
});


//contenedores
const info1 = document.getElementById('info1');
const recorrido = document.getElementById('recorrido');
const runo = document.getElementById('runo');
const rdos = document.getElementById('rdos');
const rtres = document.getElementById('rtres');

const siguiente = document.getElementById('siguiente');
const siguiente1 = document.getElementById('siguiente1');
const siguiente2 = document.getElementById('siguiente2');
const rcuatro = document.getElementById('rcuatro');
const cerrarreco = document.getElementById('cerrar-reco');

info1.addEventListener('click', function() {
    recorrido.style.display = 'block';
    runo.style.display = 'block';

})

siguiente.addEventListener('click', function() {
    runo.style.display = 'none';
    rdos.style.display = 'block';
})

siguiente1.addEventListener('click', function() {
    rdos.style.display = 'none';
    runo.style.display = 'none';
    rtres.style.display = 'block';
})

siguiente2.addEventListener('click', function() {
    rtres.style.display = 'none';
    runo.style.display = 'none';
    rcuatro.style.display = 'block';
})

cerrarreco.addEventListener('click', function() {
    recorrido.style.display = 'none';
    runo.style.display = 'none';
    rdos.style.display = 'none';
    rtres.style.display = 'none';
    rcuatro.style.display = 'none';
})