let datosOriginales = [];

window.onload = async () => {
  if (!localStorage.getItem("token")) {
    window.location.href = "inicio.html";
    return;
  }

  try {
    const { data } = await axios.get("http://localhost:3000/usuarios/validaciones");
    datosOriginales = data;
    renderizarTarjetas(data);
  } catch (error) {
    console.error("Error al cargar validaciones:", error);
  }

  document.getElementById("filtroOrden").addEventListener("change", aplicarFiltros);
  document.getElementById("filtroEstado").addEventListener("change", aplicarFiltros);
};

// Función para aplicar filtros y ordenamiento
function aplicarFiltros() {
  const estadoSeleccionado = document.getElementById("filtroEstado").value;
  const ordenSeleccionado = document.getElementById("filtroOrden").value;

  let datosFiltrados = [...datosOriginales];

  // Filtrado por estado
  if (estadoSeleccionado) {
    datosFiltrados = datosFiltrados.filter(item => item.status === estadoSeleccionado);
  }

  // Ordenamiento por nombre
  if (ordenSeleccionado === "AZ") {
    datosFiltrados.sort((a, b) => a.name.localeCompare(b.name));
  } else if (ordenSeleccionado === "ZA") {
    datosFiltrados.sort((a, b) => b.name.localeCompare(a.name));
  }

  renderizarTarjetas(datosFiltrados);
}

// Función para mostrar las tarjetas
function renderizarTarjetas(data) {
  const container = document.getElementById("admin-container");
  container.innerHTML = "";

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "validation-card";

    const statusColor = getStatusColor(item.status);

    card.innerHTML = `
      <div class="status-text" style="color: ${statusColor}; font-weight: bold;">${item.status}</div>
      <div class="card-content">
        <div class="card-images">
          <img src="http://localhost:3000${item.photo_user}" alt="Foto Usuario">
        </div>
        <div class="card-info">
          <h3>${item.name}</h3>
          <p><strong>Email:</strong> ${item.mail2}</p>
          <p><strong>Tel:</strong> ${item.phone}</p>
          <p><strong>CURP:</strong> ${item.curp}</p>
          <p><strong>RFC:</strong> ${item.rfc}</p>
        </div>
        <div class="details-button">
          <button class="details-btn">Ver detalles</button>
        </div>
      </div>
    `;

    card.querySelector(".details-btn").addEventListener("click", () => {
      localStorage.setItem("detalleUsuario", JSON.stringify(item));
      window.location.href = "detallesU.html";
    });

    container.appendChild(card);
  });
}

// Obtener el color correspondiente al estado
function getStatusColor(status) {
  switch (status) {
    case 'En revisión':
      return 'orange';
    case 'Validado':
      return 'green';
    case 'Rechazado':
      return 'red';
    default:
      return 'black';
  }
}
