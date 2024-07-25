//===============Declaracion de clases=======================
class Cooperativa {
  constructor(nombre, localidad, fechaCreacion, socies = []) {
    this.nombre = nombre;
    this.localidad = localidad;
    this.fechaCreacion = fechaCreacion;
    this.socies = socies; // lista de objetos Socie
  }
}

class Socie {
  constructor(nombre, apellido, edad, esFundador, rol) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.edad = edad;
    this.esFundador = esFundador;
    this.rol = rol;
  }
}
//=====================funciones de conteo=====================
function obtenerCantidadDeSociesFundadores(socies) {
  return socies.filter((socie) => socie.esFundador).length;
}

function obtenerCantidadDeSocies(socies) {
  return socies.length;
}

function obtenerCantidadDeCoopesTotales(coopes) {
  return coopes.length;
}

//===================funciones de formato===================
function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

let coopes = [];
let currentCoop = null;

function actualizarEstadisticas() {
  document.getElementById(
    "totalCooperativas"
  ).innerText = `Cantidad de cooperativas totales: ${obtenerCantidadDeCoopesTotales(
    coopes
  )}`;
  if (currentCoop) {
    document.getElementById(
      "totalSocies"
    ).innerText = `Cantidad de Socies: ${obtenerCantidadDeSocies(
      currentCoop.socies
    )}`;
    document.getElementById(
      "totalFundadores"
    ).innerText = `Cantidad de Socies Fundadores: ${obtenerCantidadDeSociesFundadores(
      currentCoop.socies
    )}`;
  } else {
    document.getElementById("totalSocies").innerText = `Cantidad de Socies: 0`;
    document.getElementById(
      "totalFundadores"
    ).innerText = `Cantidad de Socies Fundadores: 0`;
  }
}

//==============funciones de Storage======================================
function guardarEnLocalStorage() {
  localStorage.setItem("cooperativas", JSON.stringify(coopes));
}

function cargarDesdeLocalStorage() {
  const coopesGuardadas = localStorage.getItem("cooperativas");
  if (coopesGuardadas) {
    coopes = JSON.parse(coopesGuardadas);
    coopes.forEach((coop) => {
      coop.socies = coop.socies.map(
        (socie) =>
          new Socie(
            socie.nombre,
            socie.apellido,
            socie.edad,
            socie.esFundador,
            socie.rol
          )
      );
    });
    actualizarEstadisticas();
    mostrarListadoDeCooperativas();
  }
}

//===================================================================

document.addEventListener("DOMContentLoaded", () => {
  cargarDesdeLocalStorage();

  document
    .getElementById("coopForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const nombre = capitalize(
        document.getElementById("coopName").value.trim()
      );
      const localidad = capitalize(
        document.getElementById("coopLocation").value.trim()
      );
      const fechaCreacion = document.getElementById("coopDate").value.trim();

      currentCoop = new Cooperativa(nombre, localidad, fechaCreacion);
      coopes.push(currentCoop);

      guardarEnLocalStorage();
      actualizarEstadisticas();
      mostrarListadoDeCooperativas();

      document.getElementById("socieForm").style.display = "block";
      document.getElementById("coopForm").style.display = "none";
      document.getElementById("coopActual").innerText = nombre;
    });

  document.getElementById("addSocie").addEventListener("click", function () {
    const nombre = capitalize(
      document.getElementById("socieName").value.trim()
    );
    const apellido = capitalize(
      document.getElementById("socieSurname").value.trim()
    );
    const edad = parseInt(document.getElementById("socieAge").value.trim(), 10);
    const esFundador = document.getElementById("socieFounder").checked;
    const rol = capitalize(document.getElementById("socieRole").value.trim());

    const socie = new Socie(nombre, apellido, edad, esFundador, rol);
    currentCoop.socies.push(socie);

    guardarEnLocalStorage();
    actualizarEstadisticas();

    document.getElementById("socieForm").reset();
    document.getElementById("socieForm").style.display = "none";
    document.getElementById("anotherSocie").style.display = "block";
    document.getElementById("coopActualAnother").innerText = currentCoop.nombre;
  });

  document.getElementById("yesButton").addEventListener("click", function () {
    document.getElementById("anotherSocie").style.display = "none";
    document.getElementById("socieForm").style.display = "block";
  });

  document.getElementById("noButton").addEventListener("click", function () {
    document.getElementById("anotherSocie").style.display = "none";
    document.getElementById("confirmCloseCard").style.display = "block";
  });

  document
    .getElementById("confirmYesButton")
    .addEventListener("click", function () {
      currentCoop = null;
      guardarEnLocalStorage();
      actualizarEstadisticas();

      document.getElementById("confirmCloseCard").style.display = "none";
      document.getElementById("coopForm").style.display = "block";
      document.getElementById("coopForm").reset();
    });

  document
    .getElementById("confirmNoButton")
    .addEventListener("click", function () {
      document.getElementById("confirmCloseCard").style.display = "none";
      document.getElementById("anotherSocie").style.display = "block";
    });
});

//=============== funciones dinamicas de HTML ========================

function mostrarListadoDeCooperativas() {
  const coopListItems = document.getElementById("coopListItems");
  coopListItems.innerHTML = "";
  coopes.forEach((coop) => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${coop.nombre}</strong> - ${coop.localidad} (${coop.fechaCreacion})
      <button onclick="mostrarDetalleCoop('${coop.nombre}')">Ver Detalle</button>`;
    coopListItems.appendChild(li);
  });
  document.getElementById("coopList").classList.remove("hidden");
}

function mostrarDetalleCoop(nombre) {
  const coop = coopes.find((coop) => coop.nombre === nombre);
  if (coop) {
    const detailCard = document.createElement("div");
    detailCard.classList.add("card");
    detailCard.innerHTML = `
      <h4>Detalles de la Cooperativa</h4>
      <p><strong>Nombre:</strong> ${coop.nombre}</p>
      <p><strong>Localidad:</strong> ${coop.localidad}</p>
      <p><strong>Fecha de Creación:</strong> ${coop.fechaCreacion}</p>
      <p><strong>Socies:</strong> ${coop.socies.length}</p>
      <div class="button-container">
        <button onclick="cerrarDetalle(this)">Cerrar</button>
        <button onclick="mostrarDetalleSocies('${coop.nombre}')">Ver Socies</button>
      </div>
    `;
    document.body.appendChild(detailCard);
  }
}


function crearSocieDetalleHTML(socie) {
  return `
    <li>
      <p><strong>Datos de :</strong> ${socie.nombre} ${socie.apellido}</p>
      <p><strong>Edad:</strong> ${socie.edad} años</p>
      <p>${socie.esFundador ? "Es Fundador/a" : ""}</p>
      <p><strong>Rol:</strong> ${socie.rol}</p>
    </li>
  `;
}

function mostrarDetalleSocies(nombre) {
  const coop = coopes.find((coop) => coop.nombre === nombre);
  if (coop) {
    const sociesDetailCard = document.createElement("div");
    sociesDetailCard.classList.add("card");
    sociesDetailCard.innerHTML = `
      <h4>Socies de la Cooperativa ${coop.nombre}</h4>
      <ul>
        ${coop.socies.map(crearSocieDetalleHTML).join("")}
      </ul>
      <div class="button-container">
        <button class="cerrar-detalle">Cerrar</button>
      </div>
    `;
    document.body.appendChild(sociesDetailCard);

    sociesDetailCard
      .querySelector(".cerrar-detalle")
      .addEventListener("click", () => {
        document.body.removeChild(sociesDetailCard);
      });
  }
}

function cerrarDetalle(elemento) {
  const card = elemento.closest(".card");
  if (card) {
    document.body.removeChild(card);
  }
}
