import React, { useEffect, useState } from "react";
import "./styles.css";
import { Route, Link, Routes } from "react-router-dom";
import Tree from "react-d3-tree";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Navbar,
  Table,
} from "reactstrap";
import "react-datepicker/dist/react-datepicker.css";
import { useFilePicker } from "use-file-picker";
import { useParams } from "react-router-dom";
import TextareaAutosize from "react-textarea-autosize";
import {
  FileAmountLimitValidator,
  FileSizeValidator,
  ImageDimensionsValidator,
} from "use-file-picker/validators";

function App() {
  const [currentRotation, setCurrentRotation] = useState(0);

  const images = [
    "/static/img/img1.jpg",
    "/static/img/img2.jpg",
    "/static/img/img3.jpg",
    "/static/img/img4.jpg",
    "/static/img/img5.jpg",
    "/static/img/img6.jpg",
  ];
  //Display control 2
  useEffect(() => {
    const menuIcon = document.querySelector("#menu-icon");
    const navbar = document.querySelector(".navbar");
    if (menuIcon) {
      menuIcon.onclick = () => {
        menuIcon.classList.toggle("bx-x");
        navbar.classList.toggle("active");
      };
    }
  }, []);

  //Display control
  let sections = document.querySelectorAll("section");
  let navLinks = document.querySelectorAll("header nav a");

  window.onscroll = () => {
    sections.forEach((sec) => {
      let top = window.scrollY;
      let offset = sec.offsetTop - 100;
      let height = sec.offsetHeight;
      let id = sec.getAttribute("id");

      if (top >= offset && top < offset) {
        navLinks.forEach((links) => {
          links.classList.remove("active");
          document
            .querySelector("header nav a[href*=" + id + "]")
            .classList.add("active");
        });
      }
    });

    let header = document.querySelector("header");

    header.classList.toggle("sticky", window.scrollY > 100);
  };

  function handlePrevClick() {
    setCurrentRotation(currentRotation + 360 / images.length);
  }

  function handleNextClick() {
    setCurrentRotation(currentRotation - 360 / images.length);
  }

  const jerarquiaEmpleados = {
    name: "Jerarquía de Empleados",
    children: [
      {
        name: "Jefe de Departamento",
        children: [
          {
            name: "Juan Pérez",
            attributes: { Cargo: "Gerente de Ventas" },
            _collapsed: true,
          },
          {
            name: "María Rodríguez",
            attributes: { Cargo: "Gerente de Marketing" },
            _collapsed: true,
          },
          // Agrega más empleados bajo el Jefe de Departamento si es necesario
        ],
      },
      {
        name: "Gerentes",
        children: [
          {
            name: "Carlos Sánchez",
            attributes: { Cargo: "Gerente de Desarrollo" },
            _collapsed: true,
          },
          {
            name: "Laura González",
            attributes: { Cargo: "Gerente de Recursos Humanos" },
            _collapsed: true,
          },
          // Agrega más gerentes si es necesario
        ],
      },
      {
        name: "Empleados",
        children: [
          {
            name: "Roberto Torres",
            attributes: { Cargo: "Analista de Datos" },
            _collapsed: true,
          },
          {
            name: "Sofía Fernández",
            attributes: { Cargo: "Diseñador Gráfico" },
            _collapsed: true,
          },
          // Agrega más empleados si es necesario
        ],
      },
    ],
  };

  return (
    <div className="App">
      <header className="header">
        <a href="/" className="logo">
          Cibercom
        </a>
        <div>
          <div
            id="menu-icon"
            color="var(--text-color)"
            class="bx bx-menu"
          ></div>
        </div>
        <nav className="navbar">
          <Link to="/" className="active">
            Home
          </Link>
          <Link to="/Organigrama">Organigrama</Link>
          <Link to="/Empleados">Empleados</Link>
          <Link to="/Login">Login</Link>

          <span class="active-nav"></span>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <Home
              currentRotation={currentRotation}
              handlePrevClick={handlePrevClick}
              handleNextClick={handleNextClick}
              images={images}
            />
          }
        />
        <Route
          path="/Organigrama"
          element={<Organigrama jerarquiaEmpleados={jerarquiaEmpleados} />}
        />
        <Route path="/Empleados" element={<Empleados />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Personal/:id" element={<Personal />} /> {}
      </Routes>

      <footer className="footer">
        <div className="footer-text">
          <p>Copyright &copy; 2023 by Cibercom | All Rights Reserved.</p>
        </div>
        <div className="footer-iconTop">
          <a href="">
            <box-icon name="up-arrow-alt"></box-icon>
          </a>
        </div>
      </footer>
      <script src="./js/script.js"></script>
    </div>
  );
}

function Home({ currentRotation, handlePrevClick, handleNextClick, images }) {
  const [empleados, setEmpleados] = useState([]);
  const [datosCargados, setDatosCargados] = useState(false);

  const cargarEmpleadosBD = () => {
    fetch("http://localhost:3000/empleados", {
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

  useEffect(() => {
    cargarEmpleadosBD();
  }, []);

  /*Espacio para load*/

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

  return (
    <section className="home" id="home">
      <div className="home-content">
        <div className="gallery-container">
          <div className="box">
            {empleados.map((empleado, index) => (
              <div
                className={`card ${index === 0 ? "active" : ""}`}
                key={index}
                style={{
                  transform: `rotateY(${
                    currentRotation + (360 / images.length) * index
                  }deg) translateZ(300px)`,
                }}
              >
                <img src={empleado.Fotografia} alt={`Image ${index + 1}`} />
                <Link
                  to={`/Personal/${empleado._id}`}
                  className="btn-direction"
                >
                  Ver
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="button-container">
          <div className="button prev" onClick={handlePrevClick}></div>
          <div className="button next" onClick={handleNextClick}></div>
        </div>
      </div>
    </section>
  );
}

function Organigrama({ jerarquiaEmpleados }) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Calcula el valor de translate en función del tamaño de la pantalla
  const translateX = windowWidth / 2.5; // Centra horizontalmente
  const translateY = 80; // Define la posición vertical

  // Ajusta los parámetros en función del tamaño de la pantalla
  const separation =
    windowWidth < 768
      ? { siblings: 1.1, nonSiblings: 1.4 }
      : { siblings: 1.3, nonSiblings: 1.6 };
  const scaleExtent =
    windowWidth < 768 ? { min: 0.5, max: 0.7 } : { min: 0.5, max: 0.8 };

  return (
    <section className="organigrama" id="organigrama">
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
    </section>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes agregar la lógica para manejar el inicio de sesión, como enviar los datos al servidor.
  };

  return (
    <div className="login-container">
      <h2>Log-in</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Contraseña</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={toggleShowPassword}
            >
              {showPassword ? (
                <i className="fa fa-eye-slash"></i>
              ) : (
                <i className="fa fa-eye"></i>
              )}
            </button>
          </div>
        </div>
        <button type="submit" className="btn-direction">
          Iniciar sesión
        </button>
        <a
          href="#"
          onClick={() => setRegisterModalOpen(true)}
          className="btn-direction" // Aplicamos la misma clase de estilo que el botón
        >
          Registrarse
        </a>
      </form>

      {isRegisterModalOpen && (
        <div className="modal-floating">
          <div className="modal-header">
            <h2>Registros</h2>
          </div>
          <div className="modal-body">
            {/* Contenido del registro de usuario */}
            {/* Puedes agregar campos como nombre de usuario, contraseña, confirmación de contraseña, etc. */}
          </div>
          <button onClick={() => setRegisterModalOpen(false)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}

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
    fetch("http://localhost:3000/empleados", {
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
    fetch("http://localhost:3000/empleados/" + formEmpleado.id, {
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

    console.log(nuevoEmpleado);
    fetch("http://localhost:3000/empleados", {
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
    fetch("http://localhost:3000/empleados/" + id, {
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

function Personal() {
  const { id } = useParams();
  const [empleados, setEmpleados] = useState([]);
  const [datosCargados, setDatosCargados] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [EducacionCargada, setEducacionCargada] = useState(false);

  /*Usestate para actualizar toda la informacion*/

  const [descripcion, setDescripcion] = useState(
    "Por favor, edita tu descripción. En la parte inferior, encontrarás un botón que te permite editar todos los formularios. Para modificar cualquier sección, simplemente haz clic en el botón correspondiente y podrás actualizar la información según tus necesidades."
  );

  const [educationItems, setEducationItems] = useState([
    {
      year: "2021 - 2022",
      title: "CIBERCOM",
      description: "Descripción de la experiencia",
    },
  ]);

  const [ExperienciaItems, SetExperienciaItems] = useState([
    {
      year: "2021 - 2022",
      title: "CIBERCOM",
      description: "Descripción de la experiencia",
    },
  ]);

  const [habilidades, setHabilidades] = useState([
    { skillName: "Web Design", porcentaje: 0 },
  ]);


  /*Usestate que carga los datos del get*/
  const [Educacion, setEducacion] = useState({});

  /*Carga de datos antes de que inicie la pagina*/
  useEffect(() => {
    cargarEmpleadosBD();
    cargarEducacionPorEmpleado(id.trim());
  }, [id]);


  //Cargar los datos en base el ID de empleado con UsePrams
  const cargarEmpleadosBD = () => {
    fetch("http://localhost:3000/empleados", {
      method: "get",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        setEmpleados(json);
        setDatosCargados(true); // Marcar que los datos se han cargado
      });
  };


  //Get y conexiones de los datos con los Usestate
  const cargarEducacionPorEmpleado = (empleadoId) => {
    console.log("Empleado ID:", empleadoId);
    fetch(`http://localhost:3000/educacion/empleado/${empleadoId}`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error al cargar datos de educación: ${response.status}`
          );
        }
        return response.json();
      })
      .then((json) => {
        console.log("Respuesta completa del servidor:", json);

        setEducacion(json);
        setEducacionCargada(true);
        console.log("Educación cargada:", json);

        // Mover la lógica que depende del estado actualizado aquí
        if (!json || !json.Educacion || !Array.isArray(json.Educacion)) {
          console.log(
            "Los datos de educación no están en el formato esperado o no se han cargado."
          );
        } else {
          try {
            const educationItemsCopy = json.Educacion.map((item) => ({
              year: item.Fecha,
              title: item.Titulo,
              description: item.Descripcion,
            }));
            setEducationItems(educationItemsCopy);
            console.log(
              "Datos de educación mapeados a educationItems:",
              educationItemsCopy
            );
          } catch (error) {
            console.error("Error al mapear los datos de educación:", error);
          }
        }
        if (!json || !json.Experiencia || !Array.isArray(json.Experiencia)) {
          console.log(
            "Los datos de experiencia no están en el formato esperado o no se han cargado."
          );
        } else {
          try {
            const experienceItemsCopy = json.Experiencia.map((item) => ({
              year: item.Fecha,
              title: item.Titulo,
              description: item.Descripcion,
            }));
            SetExperienciaItems(experienceItemsCopy);
            console.log(
              "Datos de experiencia mapeados a experienceItems:",
              experienceItemsCopy
            );
          } catch (error) {
            console.error("Error al mapear los datos de experiencia:", error);
          }
        }
        if (
          !json ||
          !json.Habilidades ||
          !json.Habilidades.Programacion ||
          !Array.isArray(json.Habilidades.Programacion)
        ) {
          console.log(
            "Los datos de habilidades no están en el formato esperado o no se han cargado."
          );
        } else {
          try {
            const habilidadesItemsCopy = json.Habilidades.Programacion.map(
              (item) => ({
                skillName: item.Titulo,
                porcentaje: item.Porcentaje,
              })
            );

            setHabilidades(habilidadesItemsCopy);
            console.log(
              "Datos de habilidades mapeados a habilidades:",
              habilidades
            );
          } catch (error) {
            console.error("Error al mapear los datos de habilidades:", error);
          }
        }
      })
      .catch((error) => {
        console.error("Error al cargar educación:", error);
      });
  };


  //Cargar los datos antes de iniciar la pagina
  if (setEducacionCargada) {
    if (!datosCargados) {
      return (
        <div className="loading">
          <span className="span1"></span>
          <span className="span2"></span>
          <span className="span3"></span>
          <span className="span4"></span>
        </div>
      );
    }
  } else {
    if (!datosCargados || !EducacionCargada) {
      return (
        <div className="loading">
          <span className="span1"></span>
          <span className="span2"></span>
          <span className="span3"></span>
          <span className="span4"></span>
        </div>
      );
    }
  }

  /*Funcion para añadir eduacion, experiencia y habilidades y funcion para eliminarlas*/

  //Funcion para Educacion 
  const handleAddEducation = () => {
    const newEducationItem = {
      year: "2021 - 2022",
      title: "Universidad",
      description: "Descripción de la educación",
    };

    setEducationItems([...educationItems, newEducationItem]);
  };
  const handleRemoveEducation = () => {
    const updatedEducationItems = [...educationItems];
    updatedEducationItems.pop(); // Elimina el último elemento
    setEducationItems(updatedEducationItems);
  };

//Funcion para Experiencia 
  const handleAddExperience = () => {
    const newExperienceItem = {
      year: "2021 - 2022",
      title: "Título de la experiencia",
      description: "Descripción de la experiencia",
    };

    SetExperienciaItems([...ExperienciaItems, newExperienceItem]);
  };

  const handleRemoveExperience = () => {
    const updatedExperienceItems = [...ExperienciaItems];
    updatedExperienceItems.pop(); // Elimina el último elemento
    SetExperienciaItems(updatedExperienceItems);
  };

//Funcion para skill 
  const handleRemoveSkill = () => {
    const updatedHabilidades = [...habilidades];
    updatedHabilidades.pop(); // Elimina la última habilidad
    setHabilidades(updatedHabilidades);
  };

  const handleAddSkill = () => {
    const nuevaHabilidad = {
      skillName: "Nueva Habilidad",
      porcentaje: 0,
    };

    setHabilidades([...habilidades, nuevaHabilidad]);
  };

  const empleadoEncontrado = empleados.find(
    (empleado) => empleado._id === id.trim()
  );
  
/*Boton de editar, este permite que el usuario edite su informacion*/ 
  const handleEditClick = () => {
    setIsEditing(true);
    setIsCreating(false); // Al hacer clic en "Editar", no estás creando un elemento nuevo
  };

  /*Manda los datos al POST o PUT y tambien impide que el usuario siga editando*/
  const handleSaveClick = () => {
    setIsEditing(false);

    // Obtén los datos de educación del estado
    const datosEducacion = {
      empleado_id: id.trim(),
      Descripcion: descripcion,
      Educacion: educationItems.map((item) => ({
        Fecha: item.year,
        Titulo: item.title,
        Descripcion: item.description,
      })),
      Experiencia: ExperienciaItems.map((item) => ({
        Fecha: item.year,
        Titulo: item.title,
        Descripcion: item.description,
      })),
      Habilidades: {
        Programacion: habilidades.map((habilidad) => ({
          Titulo: habilidad.skillName,
          Porcentaje: habilidad.porcentaje,
        })),
      },
    };

    // Verifica si el empleado ya tiene una entrada en la base de datos
    fetch(`http://localhost:3000/educacion/empleado/${id}`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        if (response.ok) {
          // Si el empleado ya tiene una entrada, realiza una solicitud PUT
          return fetch(`http://localhost:3000/educacion/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datosEducacion),
          });
        } else {
          // Si el empleado no tiene una entrada, realiza una solicitud POST
          return fetch("http://localhost:3000/educacion", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datosEducacion),
          });
        }
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("Respuesta del servidor:", data);
      })
      .catch((error) => {
        console.error("Error al enviar datos:", error);
      });
  };

  /*Evento para establecer parrafos*/

  const handleInputChange = (event) => {
    setDescripcion(event.target.value);
  };

  /*Editar educacion, experiencia y habilidades*/

  const handleEditEducationYear = (event, index) => {
    const updatedEducationItems = [...educationItems];
    updatedEducationItems[index].year = event.target.value;
    setEducationItems(updatedEducationItems);
  };

  const handleEditEducationTitle = (event, index) => {
    const updatedItems = [...educationItems];
    updatedItems[index].title = event.target.value;
    setEducationItems(updatedItems);
  };

  const handleEditEducationDescription = (event, index) => {
    const updatedItems = [...educationItems];
    updatedItems[index].description = event.target.value;
    setEducationItems(updatedItems);
  };

  const handleEditExperienceYear = (event, index) => {
    const updatedExperienceItems = [...ExperienciaItems];
    updatedExperienceItems[index].year = event.target.value;
    SetExperienciaItems(updatedExperienceItems);
  };


  const handleEditExperienceTitle = (event, index) => {
    const updatedItems = [...ExperienciaItems];
    updatedItems[index].title = event.target.value;
    SetExperienciaItems(updatedItems);
  };

  const handleEditExperienceDescription = (event, index) => {
    const updatedItems = [...ExperienciaItems];
    updatedItems[index].description = event.target.value;
    SetExperienciaItems(updatedItems);
  };

  const handleEditSkillName = (event, index) => {
    const updatedHabilidades = [...habilidades];
    updatedHabilidades[index].skillName = event.target.value;
    setHabilidades(updatedHabilidades);
  };

  const actualizarPorcentaje = (e, index) => {
    const porcentaje = e.target.value;
    const updatedHabilidades = [...habilidades];
    updatedHabilidades[index].porcentaje = porcentaje;
    setHabilidades(updatedHabilidades);
  };

  //Renderizado de agregar educacion y experiencia
  const renderDescription = () => {
    if (Educacion.Descripcion) {
      return (
        <div>
          {isEditing ? (
            <TextareaAutosize
              value={descripcion}
              onChange={handleInputChange}
              className="EditarPersonal"
            />
          ) : (
            <p>{Educacion.Descripcion}</p>
          )}
        </div>
      );
    } else {
      return (
        <div>
          {isEditing ? (
            <TextareaAutosize
              value={descripcion}
              onChange={handleInputChange}
              className="EditarPersonal"
            />
          ) : (
            <p>{descripcion}</p>
          )}
        </div>
      );
    }
  };

  //Reenderiza educacion

  const renderEducationSection = () => {
    return (
      <div className="education-column">
        <h3 className="title">Educación</h3>
        <div className="education-box">
          {educationItems.map((item, index) => (
            <div key={index} className="education-content">
              <div className="content">
                <div className="year">
                  {isEditing ? (
                 <input
                 type="number"
                 value={parseInt(item.year)}
                 onChange={(event) => handleEditEducationYear(event, index)}
                 className="EditarEducacion"
               />               
                  ) : (
                    <>
                      <i className="bx bxs-calendar"></i> {item.year}
                    </>
                  )}
                </div>
                {isEditing ? (
                  <TextareaAutosize
                    value={item.title}
                    onChange={(event) => handleEditEducationTitle(event, index)}
                    className="EditarEducacion"
                  />
                ) : (
                  <h3>{item.title}</h3>
                )}
                {isEditing ? (
                  <TextareaAutosize
                    value={item.description}
                    onChange={(event) =>
                      handleEditEducationDescription(event, index)
                    }
                    className="EditarEducacion"
                  />
                ) : (
                  <p>{item.description}</p>
                )}
              </div>
            </div>
          ))}
          {isEditing && (
            <>
              <button className="btn" onClick={handleAddEducation}>
                Agregar Educación
              </button>
              <button className="btn" onClick={handleRemoveEducation}>
                Eliminar Educación
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  /*Renderiza la experiencia*/

  const renderExperienceSection = () => {
    return (
      <div className="education-column">
        <h3 className="title">Experiencia</h3>
        <div className="education-box">
          {ExperienciaItems.map((item, index) => (
            <div key={index} className="education-content">
              <div className="content">
              <div className="year">
                  {isEditing ? (
                 <input
                 type="number"
                 value={parseInt(item.year)}
                 onChange={(event) => handleEditExperienceYear(event, index)}
                 className="EditarEducacion"
               />               
                  ) : (
                    <>
                      <i className="bx bxs-calendar"></i> {item.year}
                    </>
                  )}
                </div>
                {isEditing ? (
                  <TextareaAutosize
                    value={item.title}
                    onChange={(event) =>
                      handleEditExperienceTitle(event, index)
                    }
                    className="EditarEducacion"
                  />
                ) : (
                  <h3>{item.title}</h3>
                )}
                {isEditing ? (
                  <TextareaAutosize
                    value={item.description}
                    onChange={(event) =>
                      handleEditExperienceDescription(event, index)
                    }
                    className="EditarEducacion"
                  />
                ) : (
                  <p>{item.description}</p>
                )}
              </div>
            </div>
          ))}
          {isEditing && (
              <>
              <button className="btn" onClick={handleAddExperience}>
                Agregar Experiencia
              </button>
              <button className="btn" onClick={handleRemoveExperience}>
                Eliminar Experiencia
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  //Render de habilidades
  const renderSkillSection = () => {
    return (
      <div className="skills-row">
        <div className="skills-column">
          <h3 className="title">Habilidades Profesionales</h3>

          <div className="skills-box">
            {habilidades.map((habilidad, index) => (
              <div key={index} className="skills-content">
                <div className="progress">
                  {isEditing ? (
                    <div className="edit-skill-name">
                      <label htmlFor={`skillName${index}`}>Nombre:</label>
                      <input
                        type="text"
                        id={`skillName${index}`}
                        value={habilidad.skillName}
                        onChange={(e) => handleEditSkillName(e, index)}
                        className="EditarEducacion"
                      />
                      <span id={`skillSkill${index}`}>
                        {habilidad.porcentaje}%
                      </span>
                      <div className="progress-bar-container">
                        <div
                          className="bar"
                          style={{ width: `${habilidad.porcentaje}%` }}
                        >
                          <div className="bar-overlay"></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3>
                        {habilidad.skillName}{" "}
                        <span id={`skillSkill${index}`}>
                          {habilidad.porcentaje}%
                        </span>
                      </h3>
                      <div className="progress-bar-container">
                        <div
                          className="bar"
                          style={{ width: `${habilidad.porcentaje}%` }}
                        >
                          <div className="bar-overlay"></div>
                        </div>
                      </div>
                    </div>
                  )}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={habilidad.porcentaje}
                    className="skill-range"
                    onChange={(e) => actualizarPorcentaje(e, index)}
                    disabled={!isEditing}
                    style={{ display: isEditing ? "block" : "none" }}
                  />
                </div>
              </div>
            ))}
          {isEditing && (
  <>
    <button className="btn" onClick={handleAddSkill}>
      Agregar Habilidad
    </button>
    <button className="btn" onClick={handleRemoveSkill}>
      Eliminar Habilidad
    </button>
  </>
)}

          </div>
        </div>
      </div>
    );
  };

  // Resto de tu código para mostrar el empleado

  return (
    <div className="Personal">
      <div className="personal-content">
        <div className="section">
          <section class="about" id="about">
            <h2 class="heading">
              Sobre <span>Mi</span>
            </h2>

            <div class="about-img">
              <img src={empleadoEncontrado.Fotografia} alt="about" />
              <span class="circle-spin"></span>
            </div>

            <div class="about-content">
              <h3>
                {empleadoEncontrado.Nombre} {empleadoEncontrado.ApelPaterno}{" "}
                {empleadoEncontrado.ApelMaterno}
              </h3>
              {renderDescription()}

              <section className="education" id="education">
                <h2 className="heading">
                  Mi <span>Trayectoria</span>
                </h2>
                <div className="education-row">
                  {renderEducationSection()}
                  {renderExperienceSection()}
                </div>
              </section>

              <p>
                <h2 class="heading">
                  Mis <span>Habilidades</span>
                </h2>
              </p>

              <p>
                <div class="skills-row">{renderSkillSection()}</div>
              </p>
              <div>
                {isEditing ? (
                  <button className="btn" onClick={handleSaveClick}>
                    Guardar
                  </button>
                ) : (
                  <button className="btn" onClick={handleEditClick}>
                    Editar
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
