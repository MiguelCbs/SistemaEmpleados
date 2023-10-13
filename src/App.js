import React, { useEffect, useState } from 'react';
import './styles.css';
import { Route, Link, Routes } from 'react-router-dom';
import Tree from 'react-d3-tree';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


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
        <div className="bx bx-manu" id="menu-icon">
          <i className="bx bx-menu"></i>
        </div>
        <nav className="navbar">
          <Link to="/" className="active">
            Home
          </Link>
          <Link to="/Organigrama">Organigrama</Link>
          <Link to="/Empleados">Empleados</Link>
          
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
        <Route path="/Personal" element={<Personal />} /> {/* Agrega la ruta para "Personal" */}
      </Routes>

      <footer className="footer">
        <div className="footer-text">
          <p>Copyright &copy; 2023 by Cibercom | All Rights Reserved.</p>
        </div>
        <div className="footer-iconTop">
          <a href="">
            <i className="bx bx-up-arrow-alt"></i>
          </a>
        </div>
      </footer>
      <script src="./js/script.js"></script>
    </div>
  );
}

function Home({ currentRotation, handlePrevClick, handleNextClick, images }) {
  return (
    <section className="home" id="home">
      <div className="home-content">
        <div className="gallery-container">
          <div className="box">
            {images.map((image, index) => (
              <div
                className={`card ${index === 0 ? 'active' : ''}`}
                key={index}
                style={{
                  transform: `rotateY(${currentRotation + (360 / images.length) * index}deg) translateZ(300px)`,
                }}
              >
                <img src={image} alt={`Image ${index + 1}`} />
                <Link to="/Personal" className="btn-direction">
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
  return (
    <section className="organigrama" id="organigrama">
      <h2 className="heading">Organigrama</h2>
      <div className="organigrama-container">
        <Tree
          data={jerarquiaEmpleados}
          orientation="vertical"
          collapsible={true}
          separation={{
            siblings: 2,
            nonSiblings: 2,
          }}
        />
      </div>
    </section>
  );
}

function Empleados() {
  const [empleados, setEmpleados] = useState([]); // Estado para almacenar la lista de empleados

  useEffect (()=>{ 
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
  },[ ]);

  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null); // Estado para almacenar el empleado seleccionado
  const [modalAgregar, setModalAgregar] = useState(false); // Estado para mostrar/ocultar el modal de agregar empleado
  const [formEmpleado, setFormEmpleado] = useState({
    id: '',
    Nombre: '',
    ApelPaterno: '',
    ApelMaterno: '',
    FecNacimiento: null, // Usa null en lugar de una cadena para el campo de fecha
    
  });

  // Función para abrir el modal de agregar empleado
  const abrirModalAgregar = () => {
    setModalAgregar(true);
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
      
    });
  };

  // Función para agregar un empleado a la lista
  const agregarEmpleado = () => {
    // Agregar lógica para agregar un empleado aquí
    const nuevoEmpleado = {
      
      Nombre: formEmpleado.Nombre,
      ApelPaterno: formEmpleado.ApelPaterno,
      ApelMaterno: formEmpleado.ApelMaterno,
      FecNacimiento: formEmpleado.FecNacimiento,
      
    };
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

    })
    setEmpleados([...empleados, nuevoEmpleado]);
    cerrarModalAgregar();
  };

  const handleFechaNacimientoChange = (date) => {
    setFormEmpleado({ ...formEmpleado, FecNacimiento: date });
  };


  const handleEditarEmpleado = (empleado) => {
    // Agrega lógica para editar el empleado aquí
  };
  
  // Función para eliminar un empleado
  const handleEliminarEmpleado = (id) => {
    // Agrega lógica para eliminar el empleado aquí
  };
  // Más funciones CRUD para editar y eliminar empleados

  return (
    <section className="empleados" id="Empleados">
      <div className="CRUDS">
        <button className="btn" onClick={abrirModalAgregar}>
          Agregar Empleado
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Apellido Paterno</th>
              <th>Apellido Materno</th>
              <th>Fecha de Nacimiento</th>
              <th>Fotografía</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((empleado) => (
              <tr key={empleado.id}>
                <td>{empleado.id}</td>
                <td>{empleado.Nombre}</td>
                <td>{empleado.ApelPaterno}</td>
                <td>{empleado.ApelMaterno}</td>
                
                <td>{empleado.fotografia}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEditarEmpleado(empleado)}
                  >
                    Editar
                  </button>
                  {"   "}
                  <button
                    className="btn btn-danger"
                    onClick={() => handleEliminarEmpleado(empleado.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para agregar empleado */}
      <Modal isOpen={modalAgregar} toggle={cerrarModalAgregar} className="modal-floating">
        <ModalHeader>Agregar Empleado</ModalHeader>
        <ModalBody>
          <div className="form-group">
            <div className="form-item">
              <label htmlFor="id">ID:</label>
              <input
                className="form-control"
                type="text"
                name="id"
                id="id"
                value={formEmpleado.id}
                onChange={(e) => setFormEmpleado({ ...formEmpleado, id: e.target.value })}
              />
            </div>
            <div className="form-item">
              <label htmlFor="nombre">Nombre:</label>
              <input
                className="form-control"
                type="text"
                name="nombre"
                id="nombre"
                value={formEmpleado.Nombre}
                onChange={(e) => setFormEmpleado({ ...formEmpleado, Nombre: e.target.value })}
              />
            </div>
            <div className="form-item">
              <label htmlFor="ApelPaterno">Apellido Paterno:</label>
              <input
                className="form-control"
                type="text"
                name="ApelPaterno"
                id="ApelPaterno"
                value={formEmpleado.ApelPaterno}
                onChange={(e) => setFormEmpleado({ ...formEmpleado, ApelPaterno: e.target.value })}
              />
            </div>
            <div className="form-item">
              <label htmlFor="ApelMaterno">Apellido Materno:</label>
              <input
                className="form-control"
                type="text"
                name="ApelMaterno"
                id="ApelMaterno"
                value={formEmpleado.ApelMaterno}
                onChange={(e) => setFormEmpleado({ ...formEmpleado, ApelMaterno: e.target.value })}
              />
            </div>
            <div className="form-item">
              <label htmlFor="fechaNac">Fecha de Nacimiento:</label>
              <DatePicker
                selected={formEmpleado.FecNacimiento}
                onChange={handleFechaNacimientoChange}
                dateFormat="dd/MM/yyyy"
                className="form-control"
              />
            </div>
            {/* Agregar más campos del formulario según sea necesario */}
          </div>
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-success" onClick={agregarEmpleado}>
            Guardar
          </button>
          <button className="btn btn-danger" onClick={cerrarModalAgregar}>
            Cancelar
          </button>
        </ModalFooter>
      </Modal>
    </section>

  );
}

function Personal() {
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
        <h3>-Nombre-</h3>
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