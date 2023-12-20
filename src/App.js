import React, { useEffect, useState } from "react";
import "./styles.css";
import { Route, Link, Routes } from "react-router-dom";
import Tree from "react-d3-tree";
import { CiFacebook, CiLinkedin, CiYoutube } from "react-icons/ci";
import { FaInstagram, FaTiktok } from "react-icons/fa";
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
  const [redesSocialesCargadas, setRedesSocialesCargadas] = useState(false);
  const [expedienteClinicoCargado, setExpedienteClinicoCargado] =
    useState(false);

  /*Usestate para redes sociales*/
  const [redesSociales, setRedesSociales] = useState([
    {
      redSocialSeleccionada: "",
      URLRedSocial: "",
      NombreRedSocial: "",
    },
  ]);
  /*Usestate para actualizar toda la informacion de educacion*/

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

  /*Cargar los datos para Redes sociales*/

  const RedSocial = [
    { label: "Facebook", value: <CiFacebook /> },
    { label: "Instagram", value: <FaInstagram /> },
    { label: "Linkedin", value: <CiLinkedin /> },
    { label: "Youtube", value: <CiYoutube /> },
    { label: "tiktok", value: <FaTiktok /> },
  ];

  //Expediente clinico

  const [selectedFiles, setSelectedFiles] = useState([]);

  const { openFilePicker, filesContent } = useFilePicker({
    readAs: "DataURL",
    accept: "pdf/*",
    validators: [new FileAmountLimitValidator({ max: 1 })],
  });

  const opcionesTipoSangre = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const [expedienteclinico, setexpedienteclinico] = useState({
    tipoSangre: "",
    Padecimientos: "",
    NumeroSeguroSocial: "",
    Datossegurodegastos: "",
    PDFSegurodegastosmedicos: null, // Initialize as null
  });

  const descargarPDF = () => {
    const pdfData = expedienteclinico.PDFSegurodegastosmedicos?.[0];

    if (pdfData) {
      const { content, name } = pdfData;

      // Crear un Blob a partir de los datos codificados en base64
      const byteCharacters = atob(content.split(",")[1]);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Crear un enlace y simular un clic para descargar el archivo
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = name || "documento.pdf";
      link.click();
    }
  };
  useEffect(() => {
    if (filesContent && filesContent.length > 0) {
      // Handle the selected files
      setSelectedFiles(filesContent);

      // Asigna el contenido del archivo a expedienteclinico.PDFSegurodegastosmedicos
      setexpedienteclinico((prev) => ({
        ...prev,
        PDFSegurodegastosmedicos: filesContent,
      }));
    }
  }, [filesContent]);

  /*Datos contacto*/



  
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

  const [datoscontacto, setdatoscontacto] = useState({
    telefonoF: "",
    telefonoC: "",
    IDwhatsapp: "",
    IDtelegram: "",
    correo: "",
    empleadoid: id,
  });


  const [personalcontacto, setpersonalcontacto] = useState({
    parenstesco: "",
    nombreContacto: "",
    telefonoContacto: "",
    correoContacto: "",
    direccionContacto: "",
     empleadoid: id,
  });

  //Get y conexiones de los datos con los Usestate
  const cargarEducacionPorEmpleado = (empleadoId) => {
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

  const cargarRedesSocialesPorEmpleado = (empleadoId) => {
    fetch(`http://localhost:3000/redsocial/empleado/${empleadoId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error al cargar datos de redes sociales: ${response.status}`
          );
        }
        return response.json();
      })
      .then((json) => {
        console.log("Respuesta completa del servidor (Redes Sociales):", json);

        if (!json || !json[0].RedesSociales) {
          console.log(
            "Los datos de redes sociales no están en el formato esperado o no se han cargado."
          );
          return;
        }

        const redesSocialesCopy = json[0].RedesSociales.map((item) => ({
          redSocialSeleccionada: item.redSocialSeleccionada,
          URLRedSocial: item.URLRedSocial,
          NombreRedSocial: item.NombreRedSocial,
        }));

        setRedesSociales(redesSocialesCopy); // Actualiza el estado con los datos mapeados
        setRedesSocialesCargadas(true);

        console.log(
          "Datos de redes sociales mapeados a redesSociales:",
          redesSocialesCopy
        );
      })
      .catch((error) => {
        console.error("Error al cargar redes sociales:", error);
      });
  };

  const cargarExpedienteClinicoPorEmpleado = (empleadoId) => {
    fetch(`http://localhost:3000/expedienteclinico/empleado/${empleadoId}`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error al cargar datos de expediente clínico: ${response.status}`
          );
        }
        return response.json();
      })
      .then((json) => {
        console.log(
          "Respuesta completa del servidor (Expediente Clínico):",
          json
        );

        if (!json || !Array.isArray(json) || json.length === 0) {
          console.log(
            "Los datos de expediente clínico no están en el formato esperado o no se han cargado."
          );
          return;
        }

        const expedienteClinicoData = json[0]; // Tomar el primer objeto del array
        // Actualiza el estado con los datos del expediente clínico
        setexpedienteclinico({
          tipoSangre: expedienteClinicoData.tipoSangre,
          Padecimientos: expedienteClinicoData.Padecimientos,
          NumeroSeguroSocial: expedienteClinicoData.NumeroSeguroSocial,
          Datossegurodegastos: expedienteClinicoData.Segurodegastosmedicos,
          PDFSegurodegastosmedicos:
            expedienteClinicoData.PDFSegurodegastosmedicos || null,
        });
        setExpedienteClinicoCargado(true);

        console.log(
          "Datos de expediente clínico mapeados a expedienteClinico:",
          expedienteClinicoData
        );
      })
      .catch((error) => {
        console.error("Error al cargar expediente clínico:", error);
      });
  };

  const cargarDatosContactoPorEmpleado = (empleadoId) => {
    fetch(`http://localhost:3000/datoscontacto/empleado/${empleadoId}`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error al cargar datos de contacto: ${response.status}`
          );
        }
        return response.json();
      })
      .then((json) => {
        console.log("Respuesta completa del servidor (Datos de Contacto):", json);
  
        if (!json || !json["_id"]) {
          console.log(
            "Los datos de contacto no están en el formato esperado o no se han cargado."
          );
          return;
        }
  
        const datosContactoData = json; // No es necesario tratarlo como un array
        // Actualiza el estado con los datos de contacto
        setdatoscontacto({
          telefonoF: datosContactoData.TelFijo,
          telefonoC: datosContactoData.TelCelular,
          direccion: datosContactoData.Direccion, 
          IDwhatsapp: datosContactoData.IdWhatsApp,
          IDtelegram: datosContactoData.IdTelegram,
          correo: datosContactoData.ListaCorreos,
          empleadoid: datosContactoData.empleadoId
        });
  
        console.log("Datos de contacto mapeados a datoscontacto:", datosContactoData);
      })
      .catch((error) => {
        console.error("Error al cargar datos de contacto:", error);
      });
  };

  const cargarPersonasContactoPorEmpleado = (empleadoId) => {
    fetch(`http://localhost:3000/personascontacto/empleado/${empleadoId}`, {
      method: "GET",
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Error al cargar datos de personas de contacto: ${response.status}`
          );
        }
        return response.json();
      })
      .then((json) => {
        console.log(
          "Respuesta completa del servidor (Personas de Contacto):",
          json
        );
  
        if (!json || !Array.isArray(json) || json.length === 0) {
          console.log(
            "Los datos de personas de contacto no están en el formato esperado o no se han cargado."
          );
          return;
        }
  
        const personasContactoData = json[0]; // Tomar el primer objeto del array
        // Actualiza el estado con los datos de personas de contacto
        setpersonalcontacto({
          parenstesco: personasContactoData.parenstesco,
          nombreContacto: personasContactoData.nombreContacto,
          telefonoContacto: personasContactoData.telefonoContacto,
          correoContacto: personasContactoData.correoContacto,
          direccionContacto: personasContactoData.direccionContacto,
          empleadoid: personasContactoData.empleadoid,
        });
  
        console.log(
          "Datos de personas de contacto mapeados a personalcontacto:",
          personasContactoData
        );
      })
      .catch((error) => {
        console.error("Error al cargar personas de contacto:", error);
      });
  };
  
  
  // Llamada a la función para cargar personas de contacto al iniciar la página
  useEffect(() => {
    cargarEmpleadosBD();
    cargarEducacionPorEmpleado(id.trim());
    cargarRedesSocialesPorEmpleado(id.trim());
    cargarExpedienteClinicoPorEmpleado(id.trim());
    cargarDatosContactoPorEmpleado(id.trim());
    cargarPersonasContactoPorEmpleado(id.trim());
  }, [id]);

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

  //Funcion para eliminar red social
  const handleDeleteSocial = (index) => {
    const updatedRedesSociales = [...redesSociales];
    updatedRedesSociales.splice(index, 1);
    setRedesSociales(updatedRedesSociales);
  };

  /*Boton de editar, este permite que el usuario edite su informacion*/
  const handleEditClick = () => {
    setIsEditing(true);
    setIsCreating(false); // Al hacer clic en "Editar", no estás creando un elemento nuevo
  };

  /*Manda los datos al POST o PUT y tambien impide que el usuario siga editando*/
  const handleSaveClick = () => {
    setIsEditing(false);

    if (filesContent.length > 0) {
      const file = filesContent[0];

      setexpedienteclinico((prev) => ({
        ...prev,
        PDFSegurodegastosmedicos: {
          name: file.name,
          content: file.content,
        },
      }));
    }

    const datosExpedienteClinico = {
      empleado_id: id.trim(),
      tipoSangre: expedienteclinico.tipoSangre,
      Padecimientos: expedienteclinico.Padecimientos,
      NumeroSeguroSocial: expedienteclinico.NumeroSeguroSocial,
      Segurodegastosmedicos: expedienteclinico.Datossegurodegastos,
      PDFSegurodegastosmedicos: expedienteclinico.PDFSegurodegastosmedicos,
    };

    console.log("Datos expediente clinico", datosExpedienteClinico);

    const datosRedesSociales = {
      empleado_id: id.trim(),
      RedesSociales: redesSociales.map((redSocial) => ({
        redSocialSeleccionada: redSocial.redSocialSeleccionada,
        URLRedSocial: redSocial.URLRedSocial,
        NombreRedSocial: redSocial.NombreRedSocial,
      })),
    };
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
    /*
    const formData = new FormData();
    formData.append('archivo', archivoPDF); // Agrega el archivo PDF al formulario
  
    // Agrega los datos de educación al formulario
    formData.append('datos_educacion', JSON.stringify(datosEducacion));
  */

    const handleRedesSociales = () => {
      fetch(`http://localhost:3000/redsocial/empleado/${id}`, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((response) => {
          if (response.ok) {
            // Si el empleado ya tiene una entrada, realiza una solicitud PUT
            return fetch(`http://localhost:3000/redsocial/empleado/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(datosRedesSociales),
            });
          } else {
            // Si el empleado no tiene una entrada, realiza una solicitud POST
            return fetch("http://localhost:3000/redsocial", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(datosRedesSociales),
            });
          }
        })
        .then((responseRedesSociales) => {
          if (!responseRedesSociales.ok) {
            throw new Error(
              `Error al enviar datos de redes sociales: ${responseRedesSociales.status}`
            );
          }
          return responseRedesSociales.json();
        })
        .then((dataRedesSociales) => {
          console.log(
            "Respuesta del servidor (Redes Sociales):",
            dataRedesSociales
          );
          // Resto de tu lógica para manejar la respuesta del servidor...
        })
        .catch((error) => {
          console.error(
            "Error en la solicitud POST/PUT (Redes Sociales):",
            error
          );
        });
    };

    // Lógica para manejar la educación
    const handleEducacion = () => {
      fetch(`http://localhost:3000/educacion/empleado/${id}`, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((responseEducacion) => {
          if (responseEducacion.ok) {
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
        .then((responseEducacion) => responseEducacion.json())
        .then((dataEducacion) => {
          console.log("Respuesta del servidor (Educación):", dataEducacion);
        })
        .catch((error) => {
          console.error("Error en la solicitud POST/PUT (Educación):", error);
        });
    };

    const handleExpedienteClinico = () => {
      // Imprime los datos antes de la solicitud POST
      console.log(
        "Datos a enviar (Expediente Clínico):",
        datosExpedienteClinico
      );

      // Realiza una solicitud GET para verificar si ya existe un expediente clínico para el empleado
      fetch(`http://localhost:3000/expedienteclinico/empleado/${id}`, {
        method: "GET",
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      })
        .then((expedienteClinico) => {
          if (expedienteClinico.ok) {
            // Si el empleado ya tiene un expediente clínico, realiza una solicitud PUT
            return fetch(
              `http://localhost:3000/expedienteclinico/empleado/${id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(datosExpedienteClinico),
              }
            );
          } else {
            // Si el empleado no tiene un expediente clínico, realiza una solicitud POST
            return fetch("http://localhost:3000/expedienteclinico", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(datosExpedienteClinico),
            });
          }
        })
        .then((responseExpedienteClinico) => {
          if (!responseExpedienteClinico.ok) {
            throw new Error(
              `Error al enviar datos del expediente clínico: ${responseExpedienteClinico.status}`
            );
          }
          return responseExpedienteClinico.json();
        })
        .then((dataExpedienteClinico) => {
          console.log(
            "Respuesta del servidor (Expediente Clínico):",
            dataExpedienteClinico
          );
          // Resto de tu lógica para manejar la respuesta del servidor...
        })
        .catch((error) => {
          console.error(
            "Error en la solicitud POST/PUT (Expediente Clínico):",
            error
          );
          if (
            error instanceof TypeError &&
            error.message === "Failed to fetch"
          ) {
            console.error(
              "Posibles problemas de CORS o el servidor no está en ejecución."
            );
          }
        });
    };
    const handleUpdateDatosContacto = () => {
      const datosContacto = {
        empleado_id: id.trim(),
        TelFijo: datoscontacto.telefonoF,
        TelCelular: datoscontacto.telefonoC,
        IdWhatsApp: datoscontacto.IDwhatsapp,
        IdTelegram: datoscontacto.IDtelegram,
        ListaCorreos: datoscontacto.correo,
      };
    
      // Realiza una solicitud GET para verificar si ya existe un registro de datos de contacto para el empleado
      fetch(`http://localhost:3000/datoscontacto/empleado/${datosContacto.empleado_id}`, {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
        .then((response) => {
          if (response.ok) {
            // Si el empleado ya tiene un registro, realiza una solicitud PUT para actualizarlo
            return fetch(`http://localhost:3000/datoscontacto/empleado/${datosContacto.empleado_id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(datosContacto),
            });
          } else {
            // Si el empleado no tiene un registro, realiza una solicitud POST para crearlo
            return fetch('http://localhost:3000/datoscontacto', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(datosContacto),
            });
          }
        })
        .then((responseDatosContacto) => {
          if (!responseDatosContacto.ok) {
            throw new Error(`Error al enviar datos de contacto: ${responseDatosContacto.status}`);
          }
          return responseDatosContacto.json();
        })
        .then((dataDatosContacto) => {
          console.log('Respuesta del servidor (Datos de Contacto):', dataDatosContacto);
          // Resto de tu lógica para manejar la respuesta del servidor...
        })
        .catch((error) => {
          console.error('Error en la solicitud POST/PUT (Datos de Contacto):', error);
          if (error instanceof TypeError && error.message === 'Failed to fetch') {
            console.error('Posibles problemas de CORS o el servidor no está en ejecución.');
          }
        });
    };
    const handlePersonasContacto = () => {
      const datosPersonasContacto = {
        personalcontacto: {
          parenstesco: personalcontacto.parenstesco,
          nombreContacto: personalcontacto.nombreContacto,
          telefonoContacto: personalcontacto.telefonoContacto,
          correoContacto: personalcontacto.correoContacto,
          direccionContacto: personalcontacto.direccionContacto,
          empleadoid: id.trim(),
        },
      };
    
      // Realiza una solicitud GET para verificar si ya existe un registro de personas de contacto para el empleado
      fetch(`http://localhost:3000/personascontacto/empleado/${datosPersonasContacto.personalcontacto.empleadoid}`, {
        method: 'GET',
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
        .then((response) => {
          if (response.ok) {
            // Si el empleado ya tiene un registro, realiza una solicitud PUT para actualizarlo
            return fetch(`http://localhost:3000/personascontacto/empleado/${datosPersonasContacto.personalcontacto.empleadoid}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(datosPersonasContacto),
            });
          } else {
            // Si el empleado no tiene un registro, realiza una solicitud POST para crearlo
            return fetch('http://localhost:3000/personascontacto', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(datosPersonasContacto),
            });
          }
        })
        .then((responsePersonasContacto) => {
          if (!responsePersonasContacto.ok) {
            throw new Error(`Error al enviar datos de personas de contacto: ${responsePersonasContacto.status}`);
          }
          return responsePersonasContacto.json();
        })
        .then((dataPersonasContacto) => {
          console.log('Respuesta del servidor (Personas de Contacto):', dataPersonasContacto);
          // Resto de tu lógica para manejar la respuesta del servidor...
        })
        .catch((error) => {
          console.error('Error en la solicitud POST/PUT (Personas de Contacto):', error);
          if (error instanceof TypeError && error.message === 'Failed to fetch') {
            console.error('Posibles problemas de CORS o el servidor no está en ejecución.');
          }
        });
    };
    
    // Llamada a la función handlePersonasContacto
    handlePersonasContacto();
    
    
    handleUpdateDatosContacto();
    

    handleRedesSociales();

    handleEducacion();

    handleExpedienteClinico();
  };



  /*Evento para establecer parrafos*/

  const handleInputChange = (event) => {
    setDescripcion(event.target.value);
  };
  const handleAddSocial = () => {
    setRedesSociales((prevRedesSociales) => [
      ...prevRedesSociales,
      {
        redSocialSeleccionada: "",
        URLRedSocial: "",
        NombreRedSocial: "",
      },
    ]);
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

  //Actualizar expediente clinico
  const handleEditTipoSangre = (e) => {
    const updatedExpedienteclinico = { ...expedienteclinico };
    updatedExpedienteclinico.tipoSangre = e.target.value;
    setexpedienteclinico(updatedExpedienteclinico);
  };

  const handleEditPadecimientos = (e) => {
    const updatedExpedienteclinico = { ...expedienteclinico };
    updatedExpedienteclinico.Padecimientos = e.target.value;
    setexpedienteclinico(updatedExpedienteclinico);
  };

  const handleEditNumeroSeguroSocial = (e) => {
    const updatedExpedienteclinico = { ...expedienteclinico };
    updatedExpedienteclinico.NumeroSeguroSocial = e.target.value;
    setexpedienteclinico(updatedExpedienteclinico);
  };
  const handleEditsegurodegastos = (e) => {
    const updatedExpedienteclinico = { ...expedienteclinico };
    updatedExpedienteclinico.Datossegurodegastos = e.target.value;
    setexpedienteclinico(updatedExpedienteclinico);
  };

  const handleInputChangedatoscontacto = (field, value) => {
    setdatoscontacto((prevDatos) => ({
      ...prevDatos,
      [field]: value,
    }));
  };

  const handlePersonalContactoChange = (field, value) => {
    setpersonalcontacto((prevPersonalContacto) => ({
      ...prevPersonalContacto,
      [field]: value,
    }));
  };

  //Renderizado de agregar educacion y experiencia
  const renderDescription = () => {
    if (Educacion.Descripcion) {
      return (
        <div className="info-desc">
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
                      onChange={(event) =>
                        handleEditEducationYear(event, index)
                      }
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
                      onChange={(event) =>
                        handleEditExperienceYear(event, index)
                      }
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
          <h2 className="title">Habilidades Profesionales</h2>

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

  //RenderRedsocial

  const renderRedesSociales = () => {
    return (
      <div className="redes-sociales-container">
        <div className="social-media-row">
          <h2 className="heading">Redes Sociales</h2>
          {isEditing ? (
            <div>
              {redesSociales.map((social, index) => (
                <div key={index} className="social-media-content">
                  <select
                    value={social.redSocialSeleccionada}
                    onChange={(e) => {
                      const updatedRedesSociales = [...redesSociales];
                      updatedRedesSociales[index].redSocialSeleccionada =
                        e.target.value;
                      setRedesSociales(updatedRedesSociales);
                    }}
                  >
                    <option value="">Selecciona una red social</option>
                    {RedSocial.map((option) => (
                      <option key={option.label} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <TextareaAutosize
                    value={social.URLRedSocial}
                    onChange={(e) => {
                      const updatedRedesSociales = [...redesSociales];
                      updatedRedesSociales[index].URLRedSocial = e.target.value;
                      setRedesSociales(updatedRedesSociales);
                    }}
                    className="EditarPersonal"
                    placeholder="URL de la red social"
                  />
                  <TextareaAutosize
                    value={social.NombreRedSocial}
                    onChange={(e) => {
                      const updatedRedesSociales = [...redesSociales];
                      updatedRedesSociales[index].NombreRedSocial =
                        e.target.value;
                      setRedesSociales(updatedRedesSociales);
                    }}
                    className="EditarPersonal"
                    placeholder="Nombre de usuario"
                  />
                  <button
                    className="post-socialmedia"
                    onClick={() => handleDeleteSocial(index)}
                  >
                    Eliminar
                  </button>
                </div>
              ))}
              <button className="post-socialmedia" onClick={handleAddSocial}>
                Agregar red social
              </button>
            </div>
          ) : (
            <div className="redes-sociales-cont">
              {redesSociales.map((redSocial, index) => (
                
                
                <a
                  key={index}
                  href={`https://${redSocial.URLRedSocial}`}
                  className="red-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="red-social-item">
                    {redSocial.redSocialSeleccionada && (
                      <svg
                        className="red-social-icon"
                        viewBox="0 0 10 10"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {RedSocial.find(
                          (social) =>
                            social.label === redSocial.redSocialSeleccionada
                        )?.value || "Icono no encontrado"}
                      </svg>
                    )}
                    <div className="red-social-info">
                      <p className="nombre-red-social">
                        {redSocial.NombreRedSocial}
                      </p>
                    </div>
                  </div>
                </a>
              
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderInfoPersonalSection = () => {
    return (
      <div className="info-column">
        <div className="info-box">
          <div className="info-content">
            <h3>Datos de Contacto</h3>
            <div className="content">
              <label>Teléfono Fijo:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={datoscontacto.telefonoF}
                  onChange={(e) => handleInputChangedatoscontacto("telefonoF", e.target.value)}
                  className="EditarEducacion"
                />
              ) : (
                <p>{datoscontacto.telefonoF}</p>
              )}
  
              <label>Teléfono Celular (Obligatorio):</label>
              {isEditing ? (
                <input
                  type="text"
                  value={datoscontacto.telefonoC}
                  onChange={(e) => handleInputChangedatoscontacto("telefonoC", e.target.value)}
                  className="EditarEducacion"
                />
              ) : (
                <p>{datoscontacto.telefonoC}</p>
              )}
  
              <label>ID de WhatsApp:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={datoscontacto.IDwhatsapp}
                  onChange={(e) => handleInputChangedatoscontacto("IDwhatsapp", e.target.value)}
                  className="EditarEducacion"
                />
              ) : (
                <p>{datoscontacto.IDwhatsapp}</p>
              )}
  
              <label>ID de Telegram:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={datoscontacto.IDtelegram}
                  onChange={(e) => handleInputChangedatoscontacto("IDtelegram", e.target.value)}
                  className="EditarEducacion"
                />
              ) : (
                <p>{datoscontacto.IDtelegram}</p>
              )}
  
              <label>Correo:</label>
              {isEditing ? (
                <input
                  type="text"
                  value={datoscontacto.correo}
                  onChange={(e) => handleInputChangedatoscontacto("correo", e.target.value)}
                  className="EditarEducacion"
                />
              ) : (
                <p>{datoscontacto.correo}</p>
              )}
  
              <div className="personasContacto">
                <h3>Personas de Contacto</h3>
  
                <label>Nombre de Contacto:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={personalcontacto.nombreContacto}
                    onChange={(e) => handlePersonalContactoChange("nombreContacto", e.target.value)}
                    className="EditarEducacion"
                  />
                ) : (
                  <p>{personalcontacto.nombreContacto}</p>
                )}
  
                <label>Parentesco:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={personalcontacto.parenstesco}
                    onChange={(e) => handlePersonalContactoChange("parenstesco", e.target.value)}
                    className="EditarEducacion"
                  />
                ) : (
                  <p>{personalcontacto.parenstesco}</p>
                )}
  
                <label>Número de Teléfono:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={personalcontacto.telefonoContacto}
                    onChange={(e) => handlePersonalContactoChange("telefonoContacto", e.target.value)}
                    className="EditarEducacion"
                  />
                ) : (
                  <p>{personalcontacto.telefonoContacto}</p>
                )}
  
                <label>Correo del Contacto:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={personalcontacto.correoContacto}
                    onChange={(e) => handlePersonalContactoChange("correoContacto", e.target.value)}
                    className="EditarEducacion"
                  />
                ) : (
                  <p>{personalcontacto.correoContacto}</p>
                )}
  
                <label>Dirección del Contacto:</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={personalcontacto.direccionContacto}
                    onChange={(e) => handlePersonalContactoChange("direccionContacto", e.target.value)}
                    className="EditarEducacion"
                  />
                ) : (
                  <p>{personalcontacto.direccionContacto}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  //Render RH

  const renderRHSection = () => {
    return (
      <div className="RH-column">
        <div className="RH-box">
          <div className="RH-content">
            <div className="content">
              <label>Puesto</label>
              {isEditing ? (
                <input
                  type="text"
                  
                />
              ) : (
                <p></p>
              )}
  
              <label>Jefe Inmediato</label>
              {isEditing ? (
                <input
                  type="text"
                  
                />
              ) : (
                <p></p>
              )}
  
              <label>Horario Laboral</label>
              {isEditing ? (
                <input
                  type="text"
                  
                />
              ) : (
                <p></p>
              )}
  
              <label>Zona Horaria</label>
              {isEditing ? (
                <input
                  type="text"
                  
                />
              ) : (
                <p></p>
              )}

            </div>
          </div>
        </div>
      </div>
    );
  };

  
  // Resto de tu código para mostrar el empleado

  return (
    <div className="Personal">
      <div className="personal-content">
        <section className="about" id="about">
          <h2 className="main-heading">
            Sobre <span>Mi</span>
          </h2>
          <div className="circle-spin"></div>
          <div className="about-img">
            <img src={empleadoEncontrado.Fotografia} alt="about" />
          </div>

          <div className="about-content">
            <div className="left-column">
              <h2 className="desc-heading">Intro</h2>
              <div className="description">
                <h3>
                  {empleadoEncontrado.Nombre} {empleadoEncontrado.ApelPaterno}{" "}
                  {empleadoEncontrado.ApelMaterno}
                </h3>
                <p>{renderDescription()}</p>
              </div>
              <div className="info-containter">
                {renderInfoPersonalSection()}
              </div>
              <div className="redes-sociales-containter">
                {renderRedesSociales()}
              </div>
              <div className="expediente-clinico">
                
                    {isEditing ? (
                      <div>
                        <select
                          id="tipoSangre"
                          value={expedienteclinico.tipoSangre}
                          onChange={handleEditTipoSangre}
                        >
                          <option value="">Selecciona el tipo de sangre</option>
                          {opcionesTipoSangre.map((tipo) => (
                            <option key={tipo} value={tipo}>
                              {tipo}
                            </option>
                          ))}
                        </select>
                        <TextareaAutosize
                          value={expedienteclinico.Padecimientos}
                          onChange={handleEditPadecimientos}
                          className="EditarPersonal"
                          placeholder="Padecimientos"
                        />
                        <TextareaAutosize
                          value={expedienteclinico.NumeroSeguroSocial}
                          onChange={handleEditNumeroSeguroSocial}
                          className="EditarPersonal"
                          placeholder="Numero del seguro social"
                        />
                        <TextareaAutosize
                          value={expedienteclinico.Datossegurodegastos}
                          onChange={handleEditsegurodegastos}
                          className="EditarPersonal"
                          placeholder="Numero del seguro social"
                        />
                        <div>
                          <button onClick={openFilePicker}>
                            Seleccionar Archivo PDF
                          </button>

                          {selectedFiles.map((file, index) => (
                            <div key={index}>
                              <p>{file.name}</p>
                              <img
                                style={{
                                  width: 200,
                                  height: 200,
                                  marginTop: 10,
                                }}
                                alt={file.name}
                                src={file.content}
                              ></img>
                              <br />
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Si no está editando, solo muestra el nombre del archivo PDF
                      <div className="expediente-clinico">
                        <h3>Expediente Clínico</h3>
                         <div className="expediente-clinico-content"> 
                        <p>{expedienteclinico.tipoSangre}</p>
                        <p>{expedienteclinico.Padecimientos}</p>
                        <p>{expedienteclinico.NumeroSeguroSocial}</p>
                        <p>{expedienteclinico.Datossegurodegastos}</p>
                        </div>
                        <div>
                          {expedienteclinico.PDFSegurodegastosmedicos && (
                            <>
                              <p>
                                Nombre del PDF:{" "}
                                {
                                  expedienteclinico.PDFSegurodegastosmedicos[0]
                                    ?.name
                                }
                              </p>
                              <button onClick={descargarPDF}>
                                Descargar PDF
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
              
            </div>
            <div className="right-column">
              <div className="content">
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
                  <h2 className="heading">
                    Mis <span>Habilidades</span>
                  </h2>
                </p>

                <p>
                  <div className="skills-row">{renderSkillSection()}</div>
                </p>

                <div className="RH">
                <h3>Recursos Humanos</h3>
                <div className="RH-info">
                  {renderRHSection()}                  
                </div>
              </div>

                <p>
                  
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
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
