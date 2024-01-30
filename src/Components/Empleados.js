import React, { useEffect, useState } from "react";
import "../styles.css";
import { Modal, ModalHeader, ModalBody, ModalFooter, Table } from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";
import { useFilePicker } from "use-file-picker";
import { useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize"; 
import {
  FileAmountLimitValidator,
  FileSizeValidator,
  ImageDimensionsValidator,
} from "use-file-picker/validators";

const apiurl = "http://localhost:3000";

function Empleados() {
    const { openFilePicker, filesContent, loading, clear } = useFilePicker({
      readAs: "DataURL",
      accept: "image/*",
      validators: [
        new FileAmountLimitValidator({ max: 1 }),
        //new FileSizeValidator({ maxFileSize: 50 * 1024 * 1024 /* 50 MB */ }),
      ],
    });
    const [imgActual, setImgActual] = useState([]);
    const [modalTitulo, setModalTitulo] = useState("");
    const [empleados, setEmpleados] = useState([]); // Estado para almacenar la lista de empleados
    const [globalFilter, setglobalFilter] = useState(""); // Estado para almacenar el filro pro nombres
    const [globalpage, setglobalpage] = useState(0);
    const [datosCargados, setDatosCargados] = useState(false);
  
    useEffect(() => {
      cargarEmpleadosBD();
    }, []);
  
    useEffect(() => {
      setImgActual(filesContent);
    }, [filesContent]);
  
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
          setEmpleados(json);
          setDatosCargados(true);
        });
    };
  
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null); // Estado para almacenar el empleado seleccionado
    const [modalAgregar, setModalAgregar] = useState(false); // Estado para mostrar/ocultar el modal de agregar empleado
    const [formEmpleado, setFormEmpleado] = useState({
      id: "",
      Nombre: "",
      ApelPaterno: "",
      ApelMaterno: "",
      FecNacimiento: null, // Usa null en lugar de una cadena para el campo de fecha
      Fotografia: null,
    });
  
    // Función para abrir el modal de agregar empleado
    const abrirModalAgregar = () => {
      setImgActual([]);
      setModalTitulo("Agregar Empleado");
      setModalAgregar(true);
    };
  
    const abrirModalEditar = (empleado, id) => {
      setModalTitulo("Editar Empleado");
      setModalAgregar(true);
      const editEmp = {
        id: id,
        Nombre: empleado.Nombre,
        ApelPaterno: empleado.ApelPaterno,
        ApelMaterno: empleado.ApelMaterno,
        FecNacimiento: empleado.FecNacimiento, // Usa null en lugar de una cadena para el campo de fecha
      };
      if (empleado.hasOwnProperty("Fotografia"))
        editEmp["Fotografia"] = empleado.Fotografia;
  
      setImgActual([{ name: "foto", content: empleado.Fotografia }]);
      setFormEmpleado(editEmp);
    };
  
    // Función para cerrar el modal de agregar empleado
    const cerrarModalAgregar = () => {
      setModalAgregar(false);
      setFormEmpleado({
        id: "",
        Nombre: "",
        ApelPaterno: "",
        ApelMaterno: "",
        FecNacimiento: "",
        Fotografia: null,
      });
    };
  
    // Función para editar un empleado a la lista
    const editarEmpleado = () => {
      // Agregar lógica para editar un empleado aquí
  
      var foto = null;
      console.log("formEmpleado");
      console.log(formEmpleado);
      const nuevoEmpleado = {
        Nombre: formEmpleado.Nombre,
        ApelPaterno: formEmpleado.ApelPaterno,
        ApelMaterno: formEmpleado.ApelMaterno,
        FecNacimiento: formEmpleado.FecNacimiento,
      };
  
      if (imgActual.length > 0)
        nuevoEmpleado["Fotografia"] = imgActual[0].content;
  
      console.log(nuevoEmpleado);
      fetch(`${apiurl}/empleados/` + formEmpleado.id, {
        method: "put",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(nuevoEmpleado),
      })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          alert(json.message);
          cargarEmpleadosBD();
          cerrarModalAgregar();
          clear();
        });
    };
  
    // Función para agregar un empleado a la lista
    const agregarEmpleado = () => {
      // Agregar lógica para agregar un empleado aquí
  
      var foto = null;
  
      const nuevoEmpleado = {
        Nombre: formEmpleado.Nombre,
        ApelPaterno: formEmpleado.ApelPaterno,
        ApelMaterno: formEmpleado.ApelMaterno,
        FecNacimiento: formEmpleado.FecNacimiento,
      };
  
      if (filesContent.length > 0)
        nuevoEmpleado["Fotografia"] = filesContent[0].content;
      
      fetch(`${apiurl}/empleados`, {
        method: "post",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(nuevoEmpleado),
      })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          cargarEmpleadosBD();
          cerrarModalAgregar();
          clear();
        });
      //setEmpleados([...empleados, nuevoEmpleado]);
    };
  
    const handleFechaNacimientoChange = (date) => {
      setFormEmpleado({ ...formEmpleado, FecNacimiento: date.target.value });
    };
  
    //Metodo de filtrado
    let resultado = [];
    if (!globalFilter) {
      resultado = empleados.slice(globalpage, globalpage + 5);
    } else {
      resultado = empleados
        .filter((dato) =>
          dato.Nombre.toLowerCase().includes(globalFilter.toLowerCase())
        )
        .slice(globalpage, globalpage + 5);
    }
  
    //Siguiente pagina
    const NextPage = () => {
      if (!globalFilter) {
        if (empleados.length > globalpage + 5) {
          setglobalpage(globalpage + 5);
        }
      } else {
        const empleadosFiltrados = empleados.filter((dato) =>
          dato.Nombre.toLowerCase().includes(globalFilter.toLowerCase())
        );
        if (empleadosFiltrados.length > globalpage + 5) {
          setglobalpage(globalpage + 5);
        }
      }
    };
  
    const PrevPage = () => {
      if (globalpage > 0) setglobalpage(globalpage - 5);
    };
  
    const handleEditarEmpleado = (empleado, id) => {
      // Agrega lógica para editar el empleado aquí
      abrirModalEditar(empleado, id);
    };
  
    // Función para eliminar un empleado
    const handleEliminarEmpleado = (id) => {
      // Agrega lógica para eliminar el empleado aquí
      fetch(`${apiurl}/empleados/` + id, {
        method: "delete",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          alert(json.message);
          cargarEmpleadosBD();
          fetch(`${apiurl}/datoscontacto/${id}`, {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Error al eliminar datoscontacto: ${response.status}`
                );
              }
              return response.json();
            })
            .catch((error) => {
              console.error(
                "Error en la solicitud DELETE (datoscontacto):",
                error
              );
              // Maneja errores aquí si es necesario
            });
          fetch(`${apiurl}/expedienteclinico/${id}`, {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Error al eliminar expedienteclinico: ${response.status}`
                );
              }
              return response.json();
            })
            .catch((error) => {
              console.error(
                "Error en la solicitud DELETE (expedienteclinico):",
                error
              );
              // Maneja errores aquí si es necesario
            });
          fetch(`${apiurl}/educacion/${id}`, {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Error al eliminar educacion: ${response.status}`
                );
              }
              return response.json();
            })
            .catch((error) => {
              console.error(
                "Error en la solicitud DELETE (educacion):",
                error
              );
              // Maneja errores aquí si es necesario
            });
          fetch(`${apiurl}/redsocial/${id}`, {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Error al eliminar redsocial: ${response.status}`
                );
              }
              return response.json();
            })
            .catch((error) => {
              console.error(
                "Error en la solicitud DELETE (redsocial):",
                error
              );
              // Maneja errores aquí si es necesario
            });
          fetch(`${apiurl}/personascontacto/${id}`, {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Error al eliminar personascontacto: ${response.status}`
                );
              }
              return response.json();
            })
            .catch((error) => {
              console.error(
                "Error en la solicitud DELETE (personascontacto):",
                error
              );
              // Maneja errores aquí si es necesario
            });
            fetch(`${apiurl}/rh/${id}`, {
            method: "DELETE",
            headers: {
              "Content-type": "application/json",
              Accept: "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error(
                  `Error al eliminar RH: ${response.status}`
                );
              }
              return response.json();
            })
            .catch((error) => {
              console.error(
                "Error en la solicitud DELETE (RH):",
                error
              );
              // Maneja errores aquí si es necesario
            });
        });
    };
  
    /*Loader*/
  
    if (!datosCargados) {
      // Muestra el indicador de carga o un mensaje de carga
      return (
        <div className="loading">
          <span className="span1"></span>
          <span className="span2"></span>
          <span className="span3"></span>
          <span className="span4"></span>
        </div>
      );
    }
  
    // Más funciones CRUD para editar y eliminar empleados
  
    return (
      <section className="empleados" id="Empleados">
        <div className="CRUDS">
          <button className="btn" onClick={abrirModalAgregar}>
            Agregar Empleado
          </button>
          <div>
            <input
              type="text"
              className="inputEmpleados"
              placeholder="Buscar..."
              value={globalFilter}
              onChange={(e) => setglobalFilter(e.target.value)}
            />
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido Paterno</th>
                <th>Apellido Materno</th>
                <th>Fecha de Nacimiento</th>
                <th>Fotografía</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {resultado.map((empleado) => (
                <tr key={empleado.id}>
                  <td style={{ display: "none" }}>{empleado._id}</td>
                  <td>{empleado.Nombre}</td>
                  <td>{empleado.ApelPaterno}</td>
                  <td>{empleado.ApelMaterno}</td>
                  <td>{empleado.FecNacimiento}</td>
  
                  <td>
                    {empleado.Fotografia ? (
                      <img
                        style={{ width: 200, height: 200 }}
                        alt=""
                        src={empleado.Fotografia}
                      ></img>
                    ) : (
                      <></>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleEditarEmpleado(empleado, empleado._id)}
                    >
                      Editar
                    </button>
                    {"   "}
                    <button
                      className="btn btn-danger"
                      onClick={() => handleEliminarEmpleado(empleado._id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex items-center justify-between ">
            <div className="flex items-center gap-2">
              <button className="btn" onClick={PrevPage}>
                {"Anterior"}
              </button>
              <button className="btn" onClick={NextPage}>
                {"Siguiente"}
              </button>
            </div>
          </div>
        </div>
  
        {/* Modal para agregar empleado */}
        <Modal
          isOpen={modalAgregar}
          toggle={cerrarModalAgregar}
          className="modal-floating"
        >
          <ModalHeader>{modalTitulo}</ModalHeader>
          <ModalBody>
            <Table className="form-tabla">
              <div className="form-group">
                <tr>
                  <td>
                    <div className="form-item">
                      <label htmlFor="nombre">Nombre:</label>
                      <input
                        className="form-control"
                        type="text"
                        name="nombre"
                        id="nombre"
                        value={formEmpleado.Nombre}
                        onChange={(e) =>
                          setFormEmpleado({
                            ...formEmpleado,
                            Nombre: e.target.value,
                          })
                        }
                      />
                    </div>
                  </td>
                  <td>
                    <div className="form-item">
                      <label htmlFor="ApelPaterno">Apellido Paterno:</label>
                      <input
                        className="form-control"
                        type="text"
                        name="ApelPaterno"
                        id="ApelPaterno"
                        value={formEmpleado.ApelPaterno}
                        onChange={(e) =>
                          setFormEmpleado({
                            ...formEmpleado,
                            ApelPaterno: e.target.value,
                          })
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div className="form-item">
                      <label htmlFor="fechaNac">Fecha de Nacimiento:</label>
                      <input
                        className="datepicker form-control"
                        type="date"
                        value={formEmpleado.FecNacimiento}
                        onChange={handleFechaNacimientoChange}
                      />
                    </div>
                  </td>
                  <td>
                    <div className="form-item">
                      <label htmlFor="ApelMaterno">Apellido Materno:</label>
                      <input
                        className="form-control"
                        type="text"
                        name="ApelMaterno"
                        id="ApelMaterno"
                        value={formEmpleado.ApelMaterno}
                        onChange={(e) =>
                          setFormEmpleado({
                            ...formEmpleado,
                            ApelMaterno: e.target.value,
                          })
                        }
                      />
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style={{ width: "600px" }}>
                    <div
                      className="form-item foto"
                      style={{ textAlign: "center" }}
                    >
                      <label htmlFor="Fotografia" style={{ display: "block" }}>
                        Fotografía:
                      </label>
                      <button onClick={() => openFilePicker()}>
                        Subir archivo...
                      </button>
                      {imgActual.map((file, index) => {
                        console.log("OBJETO IMG");
                        console.log(file);
  
                        return (
                          <div style={{ textAlign: "center" }}>
                            <img
                              style={{ width: 200, height: 200, marginTop: 10 }}
                              alt={file.name}
                              src={file.content}
                            ></img>
                            <br />
                          </div>
                        );
                      })}
                    </div>
                  </td>
                </tr>
              </div>
            </Table>
          </ModalBody>
          <ModalFooter>
            <div style={{ textAlign: "center" }}>
              {" "}
              {/* Contenedor para centrar los botones */}
              <button
                className="btn btn-success"
                onClick={() =>
                  modalTitulo === "Agregar Empleado"
                    ? agregarEmpleado()
                    : editarEmpleado()
                }
              >
                Guardar
              </button>
              <button className="btn btn-danger" onClick={cerrarModalAgregar}>
                Cancelar
              </button>
            </div>
          </ModalFooter>
        </Modal>
      </section>
    );
  }

export default Empleados;