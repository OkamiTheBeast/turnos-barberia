var turnos = [];
var proximoId = 1;

var formulario = document.getElementById("formulario");
var nombre = document.getElementById("nombre");
var dia = document.getElementById("dia");
var hora = document.getElementById("hora");
var aviso = document.getElementById("aviso");
var lista = document.getElementById("lista");
var contador = document.getElementById("contador");
var vacio = document.getElementById("vacio");

function mostrarAviso(texto) {
  aviso.textContent = texto;
}

function formatearDia(fecha) {
  var partes = fecha.split("-");
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function dibujarLista() {
  lista.innerHTML = "";
  contador.textContent = turnos.length;
  vacio.style.display = turnos.length === 0 ? "block" : "none";

  turnos.forEach(function (turno) {
    var fila = document.createElement("li");

    var datos = document.createElement("div");
    datos.className = "datos";

    var nombreTurno = document.createElement("strong");
    nombreTurno.textContent = turno.nombre;

    var detalle = document.createElement("span");
    detalle.textContent = formatearDia(turno.dia) + " a las " + turno.hora;

    datos.appendChild(nombreTurno);
    datos.appendChild(detalle);

    if (turno.atendido) {
      var etiqueta = document.createElement("span");
      etiqueta.className = "etiqueta-atendido";
      etiqueta.textContent = "Atendido";
      datos.appendChild(etiqueta);
      fila.className = "atendido";
    }

    var acciones = document.createElement("div");
    acciones.className = "acciones";

    var botonAtendido = document.createElement("button");
    botonAtendido.type = "button";
    botonAtendido.className = "marcar";
    botonAtendido.textContent = turno.atendido ? "Marcar pendiente" : "Marcar atendido";
    botonAtendido.addEventListener("click", function () {
      alternarAtendido(turno.id);
    });

    var botonCancelar = document.createElement("button");
    botonCancelar.type = "button";
    botonCancelar.className = "cancelar";
    botonCancelar.textContent = "Cancelar";
    botonCancelar.addEventListener("click", function () {
      cancelarTurno(turno.id);
    });

    acciones.appendChild(botonAtendido);
    acciones.appendChild(botonCancelar);

    fila.appendChild(datos);
    fila.appendChild(acciones);
    lista.appendChild(fila);
  });
}

function cancelarTurno(id) {
  turnos = turnos.filter(function (turno) {
    return turno.id !== id;
  });
  mostrarAviso("");
  dibujarLista();
}

function alternarAtendido(id) {
  turnos.forEach(function (turno) {
    if (turno.id === id) {
      turno.atendido = !turno.atendido;
    }
  });
  dibujarLista();
}

function horarioOcupado(diaBuscado, horaBuscada) {
  return turnos.some(function (turno) {
    return turno.dia === diaBuscado && turno.hora === horaBuscada;
  });
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  var textoNombre = nombre.value.trim();
  var textoDia = dia.value;
  var textoHora = hora.value;

  if (textoNombre === "" || textoDia === "" || textoHora === "") {
    mostrarAviso("Completá el nombre, el día y la hora para reservar.");
    return;
  }

  if (horarioOcupado(textoDia, textoHora)) {
    mostrarAviso("Ese día y hora ya están ocupados. Elegí otro horario.");
    return;
  }

  turnos.push({
    id: proximoId,
    nombre: textoNombre,
    dia: textoDia,
    hora: textoHora,
    atendido: false
  });
  proximoId = proximoId + 1;

  turnos.sort(function (a, b) {
    var claveA = a.dia + " " + a.hora;
    var claveB = b.dia + " " + b.hora;
    if (claveA < claveB) {
      return -1;
    }
    if (claveA > claveB) {
      return 1;
    }
    return 0;
  });

  formulario.reset();
  mostrarAviso("");
  nombre.focus();
  dibujarLista();
});

dibujarLista();
