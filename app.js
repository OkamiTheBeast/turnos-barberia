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

    var boton = document.createElement("button");
    boton.type = "button";
    boton.className = "cancelar";
    boton.textContent = "Cancelar";
    boton.addEventListener("click", function () {
      cancelarTurno(turno.id);
    });

    fila.appendChild(datos);
    fila.appendChild(boton);
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

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  var textoNombre = nombre.value.trim();
  var textoDia = dia.value;
  var textoHora = hora.value;

  if (textoNombre === "" || textoDia === "" || textoHora === "") {
    mostrarAviso("Completá el nombre, el día y la hora para reservar.");
    return;
  }

  turnos.push({
    id: proximoId,
    nombre: textoNombre,
    dia: textoDia,
    hora: textoHora
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
