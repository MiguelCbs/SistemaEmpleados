import React, { useEffect, useState } from 'react';
import './styles.css';
import { Route, Link, Routes } from 'react-router-dom';
import Tree from 'react-d3-tree';
import { Modal, ModalHeader, ModalBody, ModalFooter, Navbar, Table } from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useFilePicker } from 'use-file-picker';
import { useParams } from 'react-router-dom';
import { FileAmountLimitValidator, FileSizeValidator, ImageDimensionsValidator } from 'use-file-picker/validators';

function App() {
  const [currentRotation, setCurrentRotation] = useState(0);
 
  const images = [
    '/static/img/img1.jpg',
    '/static/img/img2.jpg',
    '/static/img/img3.jpg',
    '/static/img/img4.jpg',
    '/static/img/img5.jpg',
    '/static/img/img6.jpg',
  ];
  //Display control 2
  useEffect(() => {
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');
    if (menuIcon) {
      menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
      };
    }
  }, []);

  //Display control
  let sections = document.querySelectorAll('section');
  let navLinks = document.querySelectorAll('header nav a');

  window.onscroll = () => {
    sections.forEach(sec => {
      let top = window.scrollY;
      let offset = sec.offsetTop - 100;
      let height = sec.offsetHeight; 
      let id = sec.getAttribute('id');

      if(top >= offset && top < offset ){
        navLinks.forEach(links => {
          links.classList.remove('active');
          document.querySelector('header nav a[href*='+ id +']').classList.add('active');
        });
      }
    });

    let header = document.querySelector('header');

    header.classList.toggle('sticky',window.scrollY > 100);
  }

  

  function handlePrevClick() {
    setCurrentRotation(currentRotation + 360 / images.length);
  }

  function handleNextClick() {
    setCurrentRotation(currentRotation - 360 / images.length);
  }

  const jerarquiaEmpleados = {
    name: 'Jerarquía de Empleados',
    children: [
      {
        name: 'Jefe de Departamento',
        children: [
          {
            name: 'Juan Pérez',
            attributes: { Cargo: 'Gerente de Ventas' },
            _collapsed: true,
          },
          {
            name: 'María Rodríguez',
            attributes: { Cargo: 'Gerente de Marketing' },
            _collapsed: true,
          },
          // Agrega más empleados bajo el Jefe de Departamento si es necesario
        ],
      },
      {
        name: 'Gerentes',
        children: [
          {
            name: 'Carlos Sánchez',
            attributes: { Cargo: 'Gerente de Desarrollo' },
            _collapsed: true,
          },
          {
            name: 'Laura González',
            attributes: { Cargo: 'Gerente de Recursos Humanos' },
            _collapsed: true,
          },
          // Agrega más gerentes si es necesario
        ],
      },
      {
        name: 'Empleados',
        children: [
          {
            name: 'Roberto Torres',
            attributes: { Cargo: 'Analista de Datos' },
            _collapsed: true,
          },
          {
            name: 'Sofía Fernández',
            attributes: { Cargo: 'Diseñador Gráfico' },
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
        <div >
        <div id='menu-icon' color='var(--text-color)' class='bx bx-menu'></div>
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
        <Route path="/Organigrama" element={<Organigrama jerarquiaEmpleados={jerarquiaEmpleados} />} />
        <Route path="/Empleados" element={<Empleados />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Personal/:id" element={<Personal />} /> { }
      </Routes>

      <footer className="footer">
        <div className="footer-text">
          <p>Copyright &copy; 2023 by Cibercom | All Rights Reserved.</p>
        </div>
        <div className="footer-iconTop">
          <a href="">
          <box-icon name='up-arrow-alt'></box-icon>
          </a>
        </div>
      </footer>
      <script src="./js/script.js"></script>
    </div>
  );
}

function Home({ currentRotation, handlePrevClick, handleNextClick, images }) {
  const [empleados, setEmpleados] = useState([]); 

  const cargarEmpleadosBD = ()=>{
    fetch ('http://localhost:3000/empleados',{      
      method:'get',
      headers:{
      'Access-Control-Allow-Origin': '*'
      }
    })
    .then ((response)=>{
      return response.json()
    }).then ((json)=>{
setEmpleados(json)
    })
  }

  useEffect (()=>{ 
    cargarEmpleadosBD();
  },[ ]);
  
  return (
    <section className="home" id="home">
      <div className="home-content">
        <div className="gallery-container">
          <div className="box">
            {empleados.map((empleado, index) => (
              <div
                className={`card ${index === 0 ? 'active' : ''}`}
                key={index}
                style={{
                  transform: `rotateY(${currentRotation + (360 / images.length) * index}deg) translateZ(300px)`,
                }}
              >
                <img src={empleado.Fotografia} alt={`Image ${index + 1}`} />
                <Link to={`/Personal/${empleado._id}`} className="btn-direction">
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

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calcula el valor de translate en función del tamaño de la pantalla
  const translateX = windowWidth / 2.5; // Centra horizontalmente
  const translateY = 80; // Define la posición vertical

  // Ajusta los parámetros en función del tamaño de la pantalla
  const separation = windowWidth < 768 ? { siblings: 1.1, nonSiblings: 1.4 } : { siblings: 1.3, nonSiblings: 1.6 };
  const scaleExtent = windowWidth < 768 ? { min: 0.5, max: 0.7 } : { min: 0.5, max: 0.8 };

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
        <button
          type="submit"
          className="btn-direction"
        >
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
    accept: 'image/*',
    validators: [
      new FileAmountLimitValidator({ max: 1 }),
      //new FileSizeValidator({ maxFileSize: 50 * 1024 * 1024 /* 50 MB */ }),
    ],
  });
  const [imgActual,setImgActual] = useState([]);
  const [modalTitulo,setModalTitulo] = useState("")
  const [empleados, setEmpleados] = useState([]); // Estado para almacenar la lista de empleados
  const [globalFilter, setglobalFilter] = useState(''); // Estado para almacenar el filro pro nombres
  const [globalpage, setglobalpage] = useState(0);
  

  useEffect (()=>{ 
    cargarEmpleadosBD();
  },[ ]);

  useEffect(() => {
    
    setImgActual(filesContent);
  }, [filesContent]);
  

  const cargarEmpleadosBD = ()=>{
    fetch ('http://localhost:3000/empleados',{      
      method:'get',
      headers:{
      'Access-Control-Allow-Origin': '*'
      }
    })
    .then ((response)=>{
      return response.json()
    }).then ((json)=>{
setEmpleados(json)
    })
  }

  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null); // Estado para almacenar el empleado seleccionado
  const [modalAgregar, setModalAgregar] = useState(false); // Estado para mostrar/ocultar el modal de agregar empleado
  const [formEmpleado, setFormEmpleado] = useState({
    id: '',
    Nombre: '',
    ApelPaterno: '',
    ApelMaterno: '',
    FecNacimiento: null, // Usa null en lugar de una cadena para el campo de fecha
    Fotografia:null,
  });

  // Función para abrir el modal de agregar empleado
  const abrirModalAgregar = () => {
    setImgActual([]);
    setModalTitulo("Agregar Empleado")
    setModalAgregar(true);
  };

  const abrirModalEditar = (empleado,id) => {
    setModalTitulo("Editar Empleado")
    setModalAgregar(true);
    const editEmp = {
      id: id,
      Nombre: empleado.Nombre,
      ApelPaterno: empleado.ApelPaterno,
      ApelMaterno: empleado.ApelMaterno,
      FecNacimiento: empleado.FecNacimiento, // Usa null en lugar de una cadena para el campo de fecha
    }
    if (empleado.hasOwnProperty('Fotografia'))
      editEmp["Fotografia"] = empleado.Fotografia;

    setImgActual([{"name":"foto","content":empleado.Fotografia}])
    setFormEmpleado(editEmp);

  };

  // Función para cerrar el modal de agregar empleado
  const cerrarModalAgregar = () => {
    setModalAgregar(false);
    setFormEmpleado({
      id: '',
      Nombre: '',
      ApelPaterno: '',
      ApelMaterno: '',
      FecNacimiento: '',
      Fotografia:null,
    });
    
  };

// Función para editar un empleado a la lista
const editarEmpleado = () => {
  // Agregar lógica para editar un empleado aquí

  var foto=null;
  console.log("formEmpleado")
  console.log(formEmpleado)
  const nuevoEmpleado = {
    
    Nombre: formEmpleado.Nombre,
    ApelPaterno: formEmpleado.ApelPaterno,
    ApelMaterno: formEmpleado.ApelMaterno,
    FecNacimiento: formEmpleado.FecNacimiento,
  };
  
  if (imgActual.length>0)
    nuevoEmpleado["Fotografia"] =imgActual[0].content;

  
  console.log(nuevoEmpleado)
  fetch ('http://localhost:3000/empleados/'+formEmpleado.id,{      
    method:'put',
    headers:{
      'Content-type':'application/json', 
      'Accept':'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body:JSON.stringify(nuevoEmpleado)
  })
  .then ((response)=>{
    return response.json()
  }).then ((json)=>{
    alert(json.message)
    cargarEmpleadosBD();
    cerrarModalAgregar();
    clear();
  })
  
  
};


  // Función para agregar un empleado a la lista
  const agregarEmpleado = () => {
    // Agregar lógica para agregar un empleado aquí
    
    var foto=null;
    
    const nuevoEmpleado = {
      
      Nombre: formEmpleado.Nombre,
      ApelPaterno: formEmpleado.ApelPaterno,
      ApelMaterno: formEmpleado.ApelMaterno,
      FecNacimiento: formEmpleado.FecNacimiento,
    };
    
    if (filesContent.length>0)
      nuevoEmpleado["Fotografia"] =filesContent[0].content;

    
    console.log(nuevoEmpleado)
    fetch ('http://localhost:3000/empleados',{      
      method:'post',
      headers:{
        'Content-type':'application/json', 
        'Accept':'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body:JSON.stringify(nuevoEmpleado)
    })
    .then ((response)=>{
      return response.json()
    }).then ((json)=>{
      cargarEmpleadosBD();
      cerrarModalAgregar();
      clear();
    })
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
      resultado = empleados.filter((dato) =>
      dato.Nombre.toLowerCase().includes(globalFilter.toLowerCase())
    ).slice(globalpage , globalpage  + 5);
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

  const PrevPage = () =>{
    if(globalpage > 0)
    setglobalpage(globalpage - 5 );
  }
  

  const handleEditarEmpleado = (empleado,id) => {
    // Agrega lógica para editar el empleado aquí
    abrirModalEditar(empleado,id);
    
  };
  
  // Función para eliminar un empleado
  const handleEliminarEmpleado = (id) => {
    // Agrega lógica para eliminar el empleado aquí
    fetch ('http://localhost:3000/empleados/'+id,{      
      method:'delete',
      headers:{
        'Content-type':'application/json', 
        'Accept':'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      
    })
    .then ((response)=>{
      return response.json()
    }).then ((json)=>{
      alert(json.message);
      cargarEmpleadosBD();
    })


  };
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
                <td style={{ width: "600px"}}>
                  <div className="form-item foto" style={{ textAlign: "center" }}>
                    <label htmlFor="Fotografia" style={{display: 'block'}}>Fotografía:</label>
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

const cargarEmpleadosBD = () => {
  fetch('http://localhost:3000/empleados', {      
    method: 'get',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
    .then((response) => response.json())
    .then((json) => {
      setEmpleados(json);
      setDatosCargados(true); // Marcar que los datos se han cargado
    });
}

useEffect(() => { 
  cargarEmpleadosBD();
}, []);

if (!datosCargados) {
  // Aquí puedes mostrar un mensaje de carga o algún indicador de carga
  return  <div className='cargando'></div>;
 
}

const empleadoEncontrado = empleados.find((empleado) => empleado._id === id.trim());

if (empleadoEncontrado) {
  console.log('Empleado encontrado:', empleadoEncontrado);
} else {
  console.log(id);
}

// Resto de tu código para mostrar el empleado

  return (
    <div className="Personal">
      
      <div className="personal-content">
        <div className="section">
          <section class="about" id="about">
      <h2 class="heading">Sobre <span>Mi</span></h2>

      <div class="about-img">
        <img src="/static/img/img2.jpg" alt="about" />
        <span class="circle-spin"></span>
      </div>

      <div class="about-content">
        <h3>{empleadoEncontrado.Nombre}</h3>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt deserunt
          qui atque, quos eos tempore? Culpa officia dicta, illo, sit dolorum
          aut error cum ipsam ab eos odit doloremque. Nisi qui unde error
          tempore adipisci quos corporis incidunt in? Eos quia labore expedita
          pariatur laborum iure suscipit, quos aut minima!
        </p>

        <p>
        <section class="education" id="education">
      <h2 class="heading">Mi <span>Trayectoria</span></h2>

      <div class="education-row">
        <div class="education-column">
          <h3 class="title">Educación</h3>

          <div class="education-box">
            <div class="education-content">
              <div class="content">
                <div class="year">
                  <i class="bx bxs-calendar"></i> 2017 - 2018
                </div>
                <h3>Universidad</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
                  saepe quisquam non distinctio architecto blanditiis similique
                  placeat in accusantium eos.
                </p>
              </div>
            </div>

            <div class="education-content">
              <div class="content">
                <div class="year">
                  <i class="bx bxs-calendar"></i> 2018 - 2019
                </div>
                <h3>Universidad</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
                  saepe quisquam non distinctio architecto blanditiis similique
                  placeat in accusantium eos.
                </p>
              </div>
            </div>

            <div class="education-content">
              <div class="content">
                <div class="year">
                  <i class="bx bxs-calendar"></i> 2019 - 2020
                </div>
                <h3>Universidad</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
                  saepe quisquam non distinctio architecto blanditiis similique
                  placeat in accusantium eos.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="education-column">
          <h3 class="title">Experiencia</h3>

          <div class="education-box">
            <div class="education-content">
              <div class="content">
                <div class="year">
                  <i class="bx bxs-calendar"></i> 2017 - 2018
                </div>
                <h3>Web Developer</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
                  saepe quisquam non distinctio architecto blanditiis similique
                  placeat in accusantium eos.
                </p>
              </div>
            </div>

            <div class="education-content">
              <div class="content">
                <div class="year">
                  <i class="bx bxs-calendar"></i> 2018 - 2019
                </div>
                <h3>Web Developer</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
                  saepe quisquam non distinctio architecto blanditiis similique
                  placeat in accusantium eos.
                </p>
              </div>
            </div>

            <div class="education-content">
              <div class="content">
                <div class="year">
                  <i class="bx bxs-calendar"></i> 2019 - 2020
                </div>
                <h3>Web Developer</h3>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ea
                  saepe quisquam non distinctio architecto blanditiis similique
                  placeat in accusantium eos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

        </p>

        <p>
        <h2 class="heading">Mis <span>Habilidades</span></h2>
        </p>

        <p>
        <div class="skills-row">
        <div class="skills-column">
          <h3 class="title">Habilidades de Programación</h3>

          <div class="skills-box">
            <div class="skills-content">
              <div class="progress">
                <h3>HTML <span>90%</span></h3>
                <div class="bar"><span></span></div>
              </div>

              <div class="progress">
                <h3>CSS <span>80%</span></h3>
                <div class="bar"><span></span></div>
              </div>

              <div class="progress">
                <h3>JavaScript <span>65%</span></h3>
                <div class="bar"><span></span></div>
              </div>

              <div class="progress">
                <h3>Python <span>75%</span></h3>
                <div class="bar"><span></span></div>
              </div>
            </div>
          </div>
        </div>

        <div class="skills-column">
          <h3 class="title">Habilidades Profesionales</h3>

          <div class="skills-box">
            <div class="skills-content">
              <div class="progress">
                <h3>Web Design <span>25%</span></h3>
                <div class="bar"><span></span></div>
              </div>

              <div class="progress">
                <h3>Web Development <span>73%</span></h3>
                <div class="bar"><span></span></div>
              </div>

              <div class="progress">
                <h3>Graphinc Design <span>52%</span></h3>
                <div class="bar"><span></span></div>
              </div>

              <div class="progress">
                <h3>SEO Marketing <span>65%</span></h3>
                <div class="bar"><span></span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </p>

       
      </div>
    </section>
        </div>
      </div>
    </div>
  );
}

export default App;