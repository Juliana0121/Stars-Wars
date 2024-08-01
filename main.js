const url = "https://www.swapi.tech/api/";
const type_endpoint = [
  "people/",
  "species",
  "films/",
  "planets/",
  "starships/",
  "vehicles/",
];

const peliculas = [
  "Episode 1: The Phantom Menace",
  "Episode 2: Attack of the Clones",
  "Episode 3: Revenge of the Sith",
  "Episode 4: A New Hope",
  "Episode 5: The Empire Strikes Back",
  "Episode 6: Return of the Jedi",
];

// Función para cargar datos desde la API
async function cargarDatos(endpoint = 0, value = "") {
  try {
    const response = await fetch(url + type_endpoint[endpoint] + value);
    const data = await response.json();
    if (value === "") {
      return data;
    }
    return data.result.properties;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Función para listar personajes
async function listaPersonajes() {
  const personajes = await cargarDatos(0);
  const personajes_propiedades = personajes.results;

  if (!personajes_propiedades || personajes_propiedades.length === 0) {
    console.log("No se encontraron personajes.\n");
    return;
  }

  console.log("Lista de Personajes:\n" + "-".repeat(20));
  personajes_propiedades.forEach((personaje) => {
    console.log(personaje.name);
  });

  console.log("");
}

// Función para listar especies
async function listaEspecies() {
  const especies = await cargarDatos(1);
  const especies_propiedades = especies.results;

  if (!especies_propiedades || especies_propiedades.length === 0) {
    console.log("No se encontraron especies.\n");
    return;
  }

  console.log("Lista de Especies:\n" + "-".repeat(20));
  especies_propiedades.forEach((especie) => {
    console.log(especie.name);
  });

  console.log("");
}

// Función para mostrar el menú de personajes
async function mensajePersonajes() {
  let opcion = "";

  while (opcion !== "3") {
    console.log(
      "PERSONAJES\n" +
        "-".repeat(76) +
        "\n1.Lista de Personajes\n2.Lista de especies\n3.Menú principal"
    );

    console.log("");

    opcion = prompt("Ingrese su opción (1-3):");

    switch (opcion) {
      case "1":
        await listaPersonajes();
        break;
      case "2":
        await listaEspecies();
        break;
      case "3":
        console.log("Volviendo al menú principal...\n");
        return;
      default:
        console.error("Selecciona una opción válida del menú\n");
        break;
    }
  }
}

// Función para mostrar el menú de películas
function mostrarMenuPeliculas() {
  console.log("PELICULAS\n" + "-".repeat(76));
  peliculas.forEach((pelicula, index) => {
    console.log(`${index + 1}. ${pelicula}`);
  });
  console.log("7. Menú principal\n");
}

// Función para validar la opción ingresada
function esOpcionValida(opcion, totalOpciones) {
  const opcionNumero = parseInt(opcion, 10);
  return (
    !isNaN(opcionNumero) && opcionNumero >= 1 && opcionNumero <= totalOpciones
  );
}

//Función para mostrar información del episodio
function informacionEpisodio(info) {
  try {
    console.log(
        peliculas[info.episode_id - 1] +
        "\n" +
        "-".repeat(76) +
        "\nRelase Date: \n" +
        info.release_date +
        "\n" +
        ".".repeat(76) +
        "\nDirector: " +
        "\n" +
        info.director +
        "\n"
    );
    console.log("");
  } catch (error) {
    console.error(error);
  }
}

// Función para mostrar características de la película
async function cacteristicaEpisodio(info, opcion) {
  const caracteristicas = [
    "Personajes",
    "Planetas",
    "Naves espaciales",
    "Vehículos",
    "Especies",
  ];

  console.log(`\n${caracteristicas[opcion]} del Episodio ${info.episode_id}:`);

  let i = 0;
  let listaCaracteristicas = [];

  switch (opcion) {
    case 0:
      listaCaracteristicas = info.characters;
      break;
    case 1:
      listaCaracteristicas = info.planets;
      break;
    case 2:
      listaCaracteristicas = info.starships;
      break;
    case 3:
      listaCaracteristicas = info.vehicles;
      break;
    case 4:
      listaCaracteristicas = info.species;
      break;
    default:
      console.error("Opción no válida");
      return;
  }

  while (i < listaCaracteristicas.length) {
    const urlCaracteristica = listaCaracteristicas[i];

    if (!urlCaracteristica) {
      console.log("No hay más características para mostrar.");
      return;
    }

    try {
      const caracteristicaEspecifica = await buscarElementoApi(
        urlCaracteristica
      );
      console.log(caracteristicaEspecifica.result.properties.name);
    } catch (error) {
      console.error("Error al cargar:", error);
    }

    i++;
  }

  console.log("");
}

//Función para mostrar el menú del episodio en específico
async function menuEpisodio(info) {
  let opcion = "";

  console.log("");

  while (opcion !== "7") {
    console.log(
      peliculas[info.episode_id - 1] +
        "\n" +
        "-".repeat(76) +
        "\n1.Información\n2.Personajes\n3.Planetas\n4.Naves espaciales\n5.Vehículos\n6.Especies\n7.Menú películas"
    );

    opcion = prompt("Ingrese su opción (1-7):");

    switch (opcion) {
      case "1":
        informacionEpisodio(info);
        break;
      case "2":
        await cacteristicaEpisodio(info, 0);
        break;
      case "3":
        await cacteristicaEpisodio(info, 1);
        break;
      case "4":
        await cacteristicaEpisodio(info, 2);
        break;
      case "5":
        await cacteristicaEpisodio(info, 3);
        break;
      case "6":
        await cacteristicaEpisodio(info, 4);
        break;
      case "7":
        console.log("");
        return;
      default:
        console.error("Selecciona una opción del menú\n");
        break;
    }
  }
}

async function episodio(numeroEpisodio) {
  let validaOpcion = false;
  let pelicular;
  let info;
  let info_id;

  const numero = Number(numeroEpisodio);

  try {
    pelicular = await cargarDatos(2);
  } catch (error) {
    console.error("Error al cargar datos de películas:", error);
    return;
  }

  for (let i = 0; i < 7; i++) {
    info = pelicular.result[i].properties;

    info_id = Number(info.episode_id);

    if (info_id === numero) {
      validaOpcion = true;
      break;
    }
  }

  if (validaOpcion) {
    await menuEpisodio(info);
  } else {
    console.error("Episodio no encontrado\n");
    await mensajePeliculas();
  }
}

// Función para mostrar el menú de personajes
async function mensajePeliculas() {
  let opcion = "";
  let atras = false;

  while (!atras) {
    mostrarMenuPeliculas();
    opcion = prompt("Ingrese su opción (1-7)");

    if (esOpcionValida(opcion, peliculas.length + 1)) {
      if (opcion === "7") {
        console.log("Volviendo al menú principal.");
        atras = true;
        return;
      } else {
        try {
          await episodio(opcion);
        } catch (error) {
          console.error("Error al cargar el episodio:", error);
        }
      }
    } else {
      console.error("Selecciona una opción válida del menú\n");
    }
  }

  console.log("");
}

// Función para listar los planetas
async function listaPlanetas() {
  const datos_planetas = await cargarDatos(3);

  const planetas = datos_planetas.results;

  if (!planetas || planetas.length === 0) {
    console.log("No se encontraron planetas.\n");
    return;
  }

  console.log("Lista de Planetas:\n" + "-".repeat(20));

  for (const planeta of planetas) {
    const planeta_url = planeta.url;

    try {
      const planeta_especifico = await buscarElementoApi(planeta_url);

      const descripcion = `El planeta ${planeta_especifico.result.properties.name} tiene un diámetro de ${planeta_especifico.result.properties.diameter} unidades, con un clima ${planeta_especifico.result.properties.climate} y un terreno compuesto por ${planeta_especifico.result.properties.terrain}.`;

      console.log(descripcion + "\n");
    } catch (error) {
      console.error(
        `Error al cargar datos del planeta ${planeta.name}:`,
        error
      );
    }
  }

  console.log(""); // Nueva línea al final de la lista de planetas
}

// Función para comparar planetas por diámetro
function compararPorDiametro(planetas) {
  console.log("CALCULANDO DATOS...");
  console.log("Espere unos segundos...");
  planetas.sort((a, b) => parseInt(b.diameter) - parseInt(a.diameter));

  console.log("Comparación de planetas por diámetro:");
  planetas.forEach((planeta) => {
    console.log(`- ${planeta.name}: Diámetro de ${planeta.diameter} unidades`);
  });
  console.log("");
}

// Función para comparar planetas por población
function compararPorPoblacion(planetas) {
  console.log("CALCULANDO DATOS...");
  console.log("Espere unos segundos...");
  planetas.sort((a, b) => parseInt(b.population) - parseInt(a.population));

  console.log("Comparación de planetas por población:");
  planetas.forEach((planeta) => {
    const poblacion =
      planeta.population === "unknown" ? "Desconocida" : planeta.population;
    console.log(`- ${planeta.name}: Población de ${poblacion}`);
  });
  console.log("");
}

// Función para comparar planetas por clima
function compararPorClima(planetas) {
  console.log("CALCULANDO DATOS...");
  console.log("Espere unos segundos...");
  const climaMap = {};

  planetas.forEach((planeta) => {
    if (!climaMap[planeta.climate]) {
      climaMap[planeta.climate] = [];
    }
    climaMap[planeta.climate].push(planeta.name);
  });

  console.log("Comparación de planetas por clima:");
  for (const clima in climaMap) {
    console.log(`- Clima ${clima}: ${climaMap[clima].join(", ")}`);
  }
  console.log("");
}

// Función para comparar planetas por gravedad
function compararPorGravedad(planetas) {
  console.log("CALCULANDO DATOS...");
  console.log("Espere unos segundos...");
  const gravedadMap = {};

  planetas.forEach((planeta) => {
    if (!gravedadMap[planeta.gravity]) {
      gravedadMap[planeta.gravity] = [];
    }
    gravedadMap[planeta.gravity].push(planeta.name);
  });

  console.log("Comparación de planetas por gravedad:");
  for (const gravedad in gravedadMap) {
    console.log(`- Gravedad ${gravedad}: ${gravedadMap[gravedad].join(", ")}`);
  }
  console.log("");
}

// Función para comparar planetas
async function compararPlanetas(criterio) {
  const datosPlanetas = await cargarDatos(3); // Cargar todos los planetas
  const planetas = datosPlanetas.results;

  // Comprobación si no hay planetas
  if (!planetas || planetas.length === 0) {
    console.log("No se encontraron planetas para comparar.");
    return;
  }

  // Array para almacenar datos específicos de cada planeta
  const planetasEspecificos = [];

  // Obtener datos específicos de cada planeta
  for (const planeta of planetas) {
    const planetaEspecifico = await buscarElementoApi(planeta.url);
    if (planetaEspecifico) {
      planetasEspecificos.push(planetaEspecifico.result.properties);
    }
  }

  // Comparar planetas según el criterio
  switch (criterio) {
    case "1":
      compararPorDiametro(planetasEspecificos);
      break;
    case "2":
      compararPorPoblacion(planetasEspecificos);
      break;
    case "3":
      compararPorClima(planetasEspecificos);
      break;
    case "4":
      compararPorGravedad(planetasEspecificos);
      break;
    default:
      console.error("Criterio de comparación no válido.");
      break;
  }
}

// Función para mostrar el menú de comparación de planetas
async function mensajeComparacion() {
  let opcion = "";

  while (opcion !== "5") {
    console.log(
      "PLANETAS - COMPARACIÓN\n" +
        "-".repeat(76) +
        "\n1.Diametro\n2.Población\n3.Clima\n4.Gravedad\n5.Menú planetas"
    );

    console.log("");

    opcion = prompt("Ingrese su opción (1-5):");

    switch (opcion) {
      case "1":
        await compararPlanetas(opcion);
        break;
      case "2":
        await compararPlanetas(opcion);
        break;
      case "3":
        await compararPlanetas(opcion);
        break;
      case "4":
        await compararPlanetas(opcion);
        break;
      case "5":
        console.log("Volviendo al menú planetas...\n");
        return;
      default:
        console.error("Selecciona una opción válida del menú\n");
        break;
    }
  }

  console.log("");
}

// Función para mostrar el menú de planetas
async function mensajePlanetas() {
  let opcion = "";

  while (opcion !== "3") {
    console.log(
      "PLANETAS\n" +
        "-".repeat(76) +
        "\n1.Lista de Planetas\n2.Comparar planetas\n3.Menú principal"
    );

    console.log("");

    opcion = prompt("Ingrese su opción (1-3):");

    switch (opcion) {
      case "1":
        await listaPlanetas();
        break;
      case "2":
        await mensajeComparacion();
        break;
      case "3":
        console.log("Volviendo al menú principal...\n");
        return;
      default:
        console.error("Selecciona una opción válida del menú\n");
        break;
    }
  }

  console.log("");
}

// Función para listar naves espaciales
async function listaNaves() {
  const naves = await cargarDatos(4);
  const naves_lista = naves.results;

  if (!naves_lista || naves_lista.length === 0) {
    console.log("No se encontraron naves espaciales.\n");
    return;
  }

  console.log("Lista de naves:\n" + "-".repeat(20));
  naves_lista.forEach((nave) => {
    console.log(nave.name);
  });

  console.log("");
}

// Función para mostrar los modelos de las naves
async function mostrarModelos() {
  const naves = await cargarDatos(4);
  const naves_modelos = naves.results;

  console.log("\nNaves Espaciales:");

  for (let nave of naves_modelos) {
    const nave_url = nave.url;
    try {
      const caracteristicaEspecifica = await buscarElementoApi(nave_url);

      console.log(
        "Nave: " +
          caracteristicaEspecifica.result.properties.name +
          " | " +
          "Modelo: " +
          caracteristicaEspecifica.result.properties.model
      );
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  }

  console.log("");
}

// Función para mostrar los pilotos de las naves
async function mostrarPilotos() {
  const naves = await cargarDatos(4);
  const naves_pilotos = naves.results;

  console.log("\nPilotos:");

  for (let nave of naves_pilotos) {
    const nave_url = nave.url;
    try {
      const caracteristicaEspecifica = await buscarElementoApi(nave_url);

      let resultadosCaracteristicas = caracteristicaEspecifica.result;

      for (let pilot of resultadosCaracteristicas.properties.pilots) {
        let naves_piloto = await buscarElementoApi(pilot);
        console.log(
          "La nave " +
            caracteristicaEspecifica.result.properties.name +
            ", su piloto es: " +
            naves_piloto.result.properties.name
        );
      }
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  }

  console.log("");
}

// Función para mostrar las velocidades atmosféricas de las naves
async function mostrarVelocidad() {
  const naves = await cargarDatos(4);
  const naves_pilotos = naves.results;

  console.log("\nVelocidades Atmosféricas:");

  for (let nave of naves_pilotos) {
    const nave_url = nave.url;

    try {
      const caracteristicaEspecifica = await buscarElementoApi(nave_url);
      let resultadosCaracteristicas = caracteristicaEspecifica.result;
      console.log(
        "La nave " +
          caracteristicaEspecifica.result.properties.name +
          " tiene una velocidad de " +
          resultadosCaracteristicas.properties.max_atmosphering_speed
      );
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  }

  console.log("");
}

// Función para mostrar el menú de Naves Espaciales
async function mensajeNaves() {
  let opcion = "";

  while (opcion !== "5") {
    console.log(
      "NAVES ESPACIALES\n" +
        "-".repeat(76) +
        "\n1.Lista de Naves espaciales\n2.Modelos de naves\n3.Pilotos\n4.velocidad atmosférica\n5.Menú principal"
    );

    console.log("");

    opcion = prompt("Ingrese su opción (1-5):");

    switch (opcion) {
      case "1":
        await listaNaves();
        break;
      case "2":
        await mostrarModelos();
        break;
      case "3":
        await mostrarPilotos();
        break;
      case "4":
        await mostrarVelocidad();
        break;
      case "3":
        console.log("Volviendo al menú principal...\n");
        return;
      default:
        console.error("Selecciona una opción válida del menú\n");
        break;
    }
  }

  console.log("");
}

// Función para listar vehículos
async function listaVehiculos() {
  const vehiculo = await cargarDatos(5);
  const vehiculos_lista = vehiculo.results;

  if (!vehiculos_lista || vehiculos_lista.length === 0) {
    console.log("No se encontraron vehículos.\n");
    return;
  }

  console.log("Lista de vehículos:\n" + "-".repeat(20));
  vehiculos_lista.forEach((vehiculo) => {
    console.log(vehiculo.name);
  });

  console.log("");
}

// Función para mostrar los modelos de los vehículos
async function mostrarModelosVehiculos() {
  const naves = await cargarDatos(5);
  const vehiculos_modelos = naves.results;

  console.log("\nVehículos:");

  for (let vehiculo of vehiculos_modelos) {
    const vehiculo_url = vehiculo.url;
    try {
      const caracteristicaEspecifica = await buscarElementoApi(vehiculo_url);

      console.log(
        "Vehículo: " +
          caracteristicaEspecifica.result.properties.name +
          " | " +
          "Modelo: " +
          caracteristicaEspecifica.result.properties.model
      );
    } catch (error) {
      console.error("Error al cargar:", error);
    }
  }

  console.log("");
}


// Función para mostrar el menú de vehículos
async function mensajeVehiculos() {
  let opcion = "";

  while (opcion !== "3") {
    console.log(
      "VEHÍCULOS\n" +
        "-".repeat(76) +
        "\n1.Lista de vehículos\n2.Modelos de vehículos\n3.Menú principal"
    );

    console.log("");

    opcion = prompt("Ingrese su opción (1-3):");

    switch (opcion) {
      case "1":
        await listaVehiculos();
        break;
      case "2":
        await mostrarModelosVehiculos();
        break;
      case "3":
        console.log("Volviendo al menú principal...\n");
        return;
      default:
        console.error("Selecciona una opción válida del menú\n");
        break;
    }
  }

  console.log("");
}

//Función parra buscar información de API en específico
async function buscarElementoApi(api) {
  try {
    const response = await fetch(api);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

// Función para mostrar el menú principal y capturar la opción
async function menu_inicial() {
  let opcion = "";

  while (opcion !== "6") {
    console.log(
      "¿Qué le gustaría buscar?\n" +
        "-".repeat(76) +
        "\n1.Personajes\n2.Películas\n3.Planetas\n4.Naves espaciales\n5.Vehículos\n6.Salir"
    );

    console.log("");

    opcion = prompt("Ingrese su opción (1-6):");

    switch (opcion) {
      case "1":
        await mensajePersonajes();
        break;
      case "2":
        await mensajePeliculas();
        break;
      case "3":
        await mensajePlanetas();
        break;
      case "4":
        await mensajeNaves();
        break;
      case "5":
        await mensajeVehiculos();
        break;
      case "6":
        console.log("Vuelva pronto");
        return;
      default:
        console.error("Selecciona una opción del menú");
        break;
    }
  }
}

// Función principal que inicia el programa
function main() {
  console.log("Bienvenidos a la wikipedia Stars Wars");
  menu_inicial();
}

main();