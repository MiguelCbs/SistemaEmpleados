import React, { useEffect, useState } from "react";
import "../styles.css";
import Tree from "react-d3-tree";

const apiurl = "http://191.96.145.59:8000";

function Organigrama() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [jerarquiaEmpleados, setJerarquiaEmpleados] = useState({
    name: "Jerarquía de Empleados",
    children: [],
  });

  const [nuevoElemento, setNuevoElemento] = useState({
    name: "",
    attributes: { Cargo: "" },
    selectedArea: "Jerarquía de Empleados",
  });

  const [nuevaArea, setNuevaArea] = useState("");
  const [ubicacionBotonAgregarArea, setUbicacionBotonAgregarArea] = useState(
    "Jerarquía de Empleados"
  );
  const [errorAgregarElemento, setErrorAgregarElemento] = useState("");
  const [listaAreas, setListaAreas] = useState(["Jerarquía de Empleados"]);

  const [empleados, setEmpleados] = useState([]); // Estado para almacenar la lista de empleados

  const cargarEmpleadosBD = () => {
    fetch(`${apiurl}/empleados`, {
      method: "get",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        // Modificar el formato de los empleados
        const empleadosConEnlace = json.map((empleado) => ({
          ...empleado,
          linkVariable: `${apiurl}/personal/${empleado._id}`, // Utilizar el campo _id para construir el enlace
        }));
        setEmpleados(empleadosConEnlace);
      });
  };

  const cargarJerarquiaEmpleados = () => {
    fetch(`${apiurl}/jerarquia`, {
      method: "get",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        // Modificar el formato de la jerarquía si es necesario
        setJerarquiaEmpleados(
          json.jerarquia || { name: "Jerarquía de Empleados", children: [] }
        );
      })
      .catch((error) => {
        console.error("Error al cargar la jerarquía:", error);
      });
  };

  const guardarJerarquia = () => {
    // Realizar la solicitud POST para guardar la jerarquía
    fetch(`${apiurl}/jerarquia`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jerarquiaEmpleados), // Enviar jerarquiaEmpleados directamente
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos guardados correctamente:", data);
      })
      .catch((error) => {
        console.error("Error al enviar los datos:", error);
      });
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    cargarEmpleadosBD();
    cargarJerarquiaEmpleados();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const todasLasAreas = obtenerTodasLasAreas(jerarquiaEmpleados);
    setListaAreas(todasLasAreas);
  }, [jerarquiaEmpleados]);

  const obtenerTodasLasAreas = (arbol) => {  
    let areas = ["Jerarquía de Empleados"];
    if (arbol.children) {
      for (const area of arbol.children) {
        areas.push(area.name);
        if (area.children) {
          areas = [...areas, ...obtenerTodasLasAreas(area)];
        }
      }
    }
    return areas;
  };

  const translateX = windowWidth / 2.5;
  const translateY = 80;

  const separation =
    windowWidth < 768
      ? { siblings: 1.1, nonSiblings: 1.4 }
      : { siblings: 1.3, nonSiblings: 1.6 };
  const scaleExtent =
    windowWidth < 768 ? { min: 0.5, max: 0.7 } : { min: 1.5, max: 4 };

  const agregarNuevoElemento = () => {
    if (
      nuevoElemento.name.trim() === "" ||
      nuevoElemento.attributes.Cargo.trim() === ""
    ) {
      setErrorAgregarElemento("Por favor, complete todos los campos.");
      return;
    }

    const nuevaJerarquia = { ...jerarquiaEmpleados };
    const areaSeleccionada = buscarArea(
      nuevaJerarquia,
      nuevoElemento.selectedArea
    );

    if (!areaSeleccionada) {
      setErrorAgregarElemento("Área no encontrada.");
      return;
    }

    if (!areaSeleccionada.children) {
      areaSeleccionada.children = [];
    }

    // Encuentra el empleado seleccionado
    const empleadoSeleccionado = empleados.find(
      (empleado) => empleado.Nombre === nuevoElemento.name
    );

    // Agregar un nodo con la propiedad adicional linkVariable
    areaSeleccionada.children.push({
      name: nuevoElemento.name,
      attributes: { Cargo: nuevoElemento.attributes.Cargo },
      children: [],
      linkVariable: empleadoSeleccionado
        ? empleadoSeleccionado.linkVariable
        : "/",
    });

    setJerarquiaEmpleados(nuevaJerarquia);
    setNuevoElemento({
      name: "",
      attributes: { Cargo: "" },
      selectedArea: nuevoElemento.selectedArea,
    });
    setErrorAgregarElemento("");
    guardarJerarquia(); // Mover la llamada aquí después de realizar cambios
  };

  const buscarArea = (arbol, areaPrincipal) => {
    if (arbol.name === areaPrincipal) {
      return arbol;
    }

    if (arbol.children) {
      for (const subarea of arbol.children) {
        const resultado = buscarArea(subarea, areaPrincipal);
        if (resultado) {
          return resultado;
        }
      }
    }

    return null;
  };

  const agregarNuevaAreaDesdeBoton = () => {
    if (nuevaArea.trim() === "") {
      return;
    }

    const nuevaJerarquia = { ...jerarquiaEmpleados };
    const ubicacionIndex = nuevaJerarquia.children.findIndex(
      (area) => area.name === ubicacionBotonAgregarArea
    );

    if (ubicacionIndex !== -1) {
      // Verificar si la ubicación es válida antes de acceder a sus children
      if (!nuevaJerarquia.children[ubicacionIndex].children) {
        nuevaJerarquia.children[ubicacionIndex].children = [];
      }

      nuevaJerarquia.children[ubicacionIndex].children.push({
        name: nuevaArea,
        children: [],
      });

      setJerarquiaEmpleados(nuevaJerarquia);
      setNuevaArea("");
      guardarJerarquia(); // Mover la llamada aquí después de realizar cambios
    }
  };

  return (
    <section className="organigrama" id="organigrama">
      <div>
        <div className="Org-Empleado">
          <select
            value={nuevoElemento.id}
            onChange={(e) => {
              const selectedId = e.target.value;
              const selectedEmpleado = empleados.find(
                (empleado) => empleado._id === selectedId
              );

              // Aquí, asegúrate de que selectedEmpleado no sea null antes de acceder a sus propiedades
              const selectedName = selectedEmpleado
                ? `${selectedEmpleado.Nombre} ${selectedEmpleado.ApelPaterno} ${selectedEmpleado.ApelMaterno}`
                : "";

              setNuevoElemento({
                ...nuevoElemento,
                id: selectedId,
                name: selectedName,
              });
            }}
          >
            <option value="">Seleccionar Empleado</option>
            {empleados.map((empleado) => (
              <option key={empleado._id} value={empleado._id}>
                {`${empleado.Nombre} ${empleado.ApelPaterno} ${empleado.ApelMaterno}`}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Cargo del Elemento"
            value={nuevoElemento.attributes.Cargo}
            onChange={(e) =>
              setNuevoElemento({
                ...nuevoElemento,
                attributes: { Cargo: e.target.value },
              })
            }
          />
          <select
            value={nuevoElemento.selectedArea}
            onChange={(e) => {
              setNuevoElemento({
                ...nuevoElemento,
                selectedArea: e.target.value,
              });
            }}
          >
            {listaAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          <button onClick={agregarNuevoElemento}>Agregar Elemento</button>
          {errorAgregarElemento && (
            <div className="Org-Error">{errorAgregarElemento}</div>
          )}
        </div>
        <div className="Org-Area">
          <input
            type="text"
            placeholder="Nombre de la Área"
            value={nuevaArea}
            onChange={(e) => setNuevaArea(e.target.value)}
          />
          <select
            value={ubicacionBotonAgregarArea}
            onChange={(e) => setUbicacionBotonAgregarArea(e.target.value)}
          >
            {listaAreas.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
          <button onClick={agregarNuevaAreaDesdeBoton}>Agregar Área</button>
        </div>
        <div className="organigrama-container">
          <Tree
            data={jerarquiaEmpleados}
            orientation="vertical"
            collapsible={true}
            separation={separation}
            translate={{ x: translateX, y: translateY }}
            scaleExtent={scaleExtent}
            initialDepth={2}
          />
        </div>
      </div>
    </section>
  );
}

export default Organigrama;
